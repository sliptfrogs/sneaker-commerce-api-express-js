import { sequelize } from '../config/SequelizeORM.js';
import { Product } from '../models/products.model.js';
import { Order } from '../models/order.model.js';
import { OrderItems } from '../models/order.items.model.js';
import { ApiError } from '../utils/ApiError.util.js';
import { Payment } from '../models/payment.model.js';
import { Category } from '../models/category.model.js';
import { ProductImage } from '../models/product.image.model.js';
import { FakeBankAccount } from '../models/fake.bank.account.model.js';
import { CartItems } from '../models/cart.items.model.js';
import { Cart } from '../models/cart.model.js';
import {
  Brand,
  Coupon,
  ProductColor,
  ProductSize,
  Reviews,
  User,
  UserProfile,
} from '../models/index.js';

export const CreateCheckoutService = async (req) => {
  const t = await sequelize.transaction();

  try {
    const { items, payment_method, coupon_code } = req.body;
    const userId = req.user.id;

    if (!payment_method) {
      throw new ApiError('Payment method is required', 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError('Items array is required', 400);
    }

    // Prevent duplicate product IDs
    const productIds = items.map((i) => i.product_id);
    if (new Set(productIds).size !== productIds.length) {
      throw new ApiError('Duplicate products in request', 400);
    }

    // 1️⃣ Get active cart (lock)
    const cart = await Cart.findOne({
      where: { user_id: userId, status: 'ACTIVE' },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!cart) {
      throw new ApiError('Active cart not found', 404);
    }

    // 2️⃣ Get cart items for requested products (lock)
    const cartItems = await CartItems.findAll({
      where: {
        cart_id: cart.id,
        product_id: productIds,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const foundIds = cartItems.map((ci) => ci.product_id);
    const missingIds = productIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new ApiError(`Products not in cart: ${missingIds.join(', ')}`, 400);
    }

    // 3️⃣ Fetch products (lock)
    const products = await Product.findAll({
      where: { id: productIds },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (products.length !== productIds.length) {
      throw new ApiError('Some products not found', 404);
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 4️⃣ Stock validation
    for (const cartItem of cartItems) {
      const product = productMap.get(cartItem.product_id);

      if (!product) {
        throw new ApiError('Product not found', 404);
      }

      if (product.stock_quantity < cartItem.quantity) {
        throw new ApiError(`Insufficient stock for ${product.name}`, 400);
      }
    }

    // 5️⃣ Calculate subtotal & discounts (in cents)
    let subtotalCents = 0;
    let totalAfterProductDiscountCents = 0;

    for (const cartItem of cartItems) {
      const product = productMap.get(cartItem.product_id);

      const priceCents = Math.round(product.price * 100);
      const discountPercent = product.discount_percentage || 0;

      const discountedPriceCents = Math.round(
        priceCents * (1 - discountPercent / 100),
      );

      subtotalCents += priceCents * cartItem.quantity;
      totalAfterProductDiscountCents +=
        discountedPriceCents * cartItem.quantity;
    }

    // 6️⃣ Coupon handling
    let coupon = null;
    let couponDiscountCents = 0;

    if (coupon_code) {
      coupon = await Coupon.findOne({
        where: { code: coupon_code },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!coupon) {
        throw new ApiError('Invalid coupon code', 400);
      }

      const now = new Date();

      if (!coupon.is_active) {
        throw new ApiError('Coupon inactive', 400);
      }

      if (coupon.expiry_date && coupon.expiry_date < now) {
        throw new ApiError('Coupon expired', 400);
      }

      if (coupon.min_order_amount) {
        const minOrderCents = Math.round(coupon.min_order_amount * 100);
        if (totalAfterProductDiscountCents < minOrderCents) {
          throw new ApiError(
            `Minimum order amount is ${coupon.min_order_amount}`,
            400,
          );
        }
      }

      if (
        coupon.usage_limit_global &&
        coupon.used_count >= coupon.usage_limit_global
      ) {
        throw new ApiError('Coupon usage limit reached', 400);
      }

      if (coupon.usage_limit_per_user) {
        const userUsage = await Order.count({
          where: { user_id: userId, coupon_id: coupon.id },
          transaction: t,
        });

        if (userUsage >= coupon.usage_limit_per_user) {
          throw new ApiError('You have reached coupon usage limit', 400);
        }
      }

      if (coupon.discount_type === 'FIXED') {
        couponDiscountCents = Math.round(coupon.discount_value * 100);
      } else {
        couponDiscountCents = Math.round(
          (coupon.discount_value / 100) * totalAfterProductDiscountCents,
        );
      }

      if (couponDiscountCents > totalAfterProductDiscountCents) {
        couponDiscountCents = totalAfterProductDiscountCents;
      }
    }

    // 7️⃣ Final total
    let finalTotalCents = totalAfterProductDiscountCents - couponDiscountCents;

    if (finalTotalCents < 0) finalTotalCents = 0;

    const subtotal = subtotalCents / 100;
    const totalAmount = finalTotalCents / 100;
    const discountAmount = (subtotalCents - finalTotalCents) / 100;

    // 8️⃣ Create order
    const order = await Order.create(
      {
        user_id: userId,
        payment_method,
        subtotal_amount: subtotal,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        coupon_id: coupon ? coupon.id : null,
        status: 'PENDING',
      },
      { transaction: t },
    );

    // 9️⃣ Create order items + reduce stock
    for (const cartItem of cartItems) {
      const product = productMap.get(cartItem.product_id);

      await OrderItems.create(
        {
          order_id: order.id,
          product_id: product.id,
          price: product.price,
          quantity: cartItem.quantity,
        },
        { transaction: t },
      );

      product.stock_quantity -= cartItem.quantity;
      await product.save({ transaction: t });
    }

    // 🔟 Remove ONLY checked-out items from cart
    await CartItems.destroy({
      where: {
        cart_id: cart.id,
        product_id: productIds,
      },
      transaction: t,
    });

    // 1️⃣1️⃣ If cart empty → close it and create new one
    const remainingItems = await CartItems.count({
      where: { cart_id: cart.id },
      transaction: t,
    });

    if (remainingItems === 0) {
      cart.status = 'CHECKED_OUT';
      await cart.save({ transaction: t });

      await Cart.create(
        {
          user_id: userId,
          status: 'ACTIVE',
        },
        { transaction: t },
      );
    }

    // 1️⃣2️⃣ Increase coupon usage
    if (coupon) {
      coupon.used_count += 1;
      await coupon.save({ transaction: t });
    }

    await t.commit();

    return order;
  } catch (error) {
    await t.rollback();

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error.message, 500);
  }
};

export const GetUserOrderService = async (id) => {
  try {
    const checkouts = await Order.findAll({
      where: { user_id: id },
      include: [
        {
          model: OrderItems,
          as: 'order_items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: Category,
                  attributes: ['id', 'name'],
                  as: 'category',
                },
                {
                  model: Brand,
                  attributes: ['id', 'name'],
                  as: 'brand',
                },
                {
                  model: ProductSize,
                  attributes: ['size'],
                  as: 'sizes',
                  order: [['size', 'ASC']],
                },
                {
                  model: ProductColor,
                  attributes: ['color'],
                  as: 'colors',
                },
                {
                  model: Reviews,
                  attributes: ['rating', 'comment'],
                  include: [
                    {
                      model: User,
                      attributes: ['id', 'email'],
                      include: [
                        {
                          model: UserProfile,
                          attributes: ['first_name', 'last_name'],
                          as: 'profile',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Payment,
          as: 'payment',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return checkouts;
  } catch (error) {
    throw new ApiError(
      error.message || 'Something went wrong',
      error.statusCode || 500,
    );
  }
};
export const PayUserOrderService = async (userId, orderId, cardNumber) => {
  const t = await sequelize.transaction();
  try {
    // 1️⃣ Find the specific order with items and products
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
      include: [
        {
          model: OrderItems,
          as: 'order_items', // alias from association
          include: [
            {
              model: Product,
              as: 'product', // alias from OrderItems → Product
              include: [
                { model: ProductImage, as: 'images' },
                { model: Category, as: 'category' }, // optional
              ],
            },
          ],
        },
        { model: Payment, as: 'payment' }, // alias from Order → Payment
      ],
      transaction: t,
      // lock: t.LOCK.UPDATE, // lock order row
    });

    if (!order) throw new ApiError(`Order not found`, 404);
    if (order.status !== 'PENDING')
      throw new ApiError('Order already processed', 409);

    // 2️⃣ Check stock for each product
    for (const item of order.order_items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        throw new ApiError(
          `Insufficient stock for product ${product.id} (${product.title})`,
        );
      }
    }

    // 3️⃣ Deduct stock
    for (const item of order.order_items) {
      const product = item.product;
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }
    //Check Bank Card number and balance

    const checkBankCard = await FakeBankAccount.findOne({
      where: { user_id: userId, card_number: cardNumber },
      transaction: t,
    });

    if (!checkBankCard) {
      throw new ApiError('Bank card not found', 404);
    }
    if (checkBankCard.balance < order.total_amount) {
      throw new ApiError('Insufficient bank balance', 400);
    }

    // Deduct amount from bank balance
    checkBankCard.balance -= order.total_amount;
    await checkBankCard.save({ transaction: t });

    // 4️⃣ Create Payment record
    const payment = await Payment.create(
      {
        order_id: order.id,
        user_id: userId,
        bank_id: checkBankCard.id,
        amount: order.total_amount,
        status: 'COMPLETED', // simulate success/failure
        method: order.payment_method,
      },
      { transaction: t },
    );

    // 5️⃣ Update Order Status
    order.status = 'PAID';
    await order.save({ transaction: t });

    // 6️⃣ Commit Transaction
    await t.commit();

    return { order, payment };
  } catch (err) {
    await t.rollback();

    // Surface validation / unique constraint details if present
    if (
      err.name === 'SequelizeValidationError' ||
      err.name === 'SequelizeUniqueConstraintError'
    ) {
      const details =
        err.errors?.map((e) => ({
          message: e.message,
          path: e.path,
          value: e.value,
        })) || [];
      throw new ApiError('Payment validation error', 400, details);
    }

    throw new ApiError(err.message, err.statusCode || 500, err.errors || []);
  }
};
