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

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError('Items array is required', 400);
    }

    // 1️⃣ Find the user's active cart
    const cart = await Cart.findOne({
      where: { user_id: userId, status: 'ACTIVE' },
      transaction: t,
    });

    if (!cart) {
      throw new ApiError('Active cart not found for the user', 404);
    }

    // 2️⃣ Restrict checkout to products that are actually in this user's cart
    const productIds = items.map((i) => i.product_id);

    const cartItems = await CartItems.findAll({
      where: { cart_id: cart.id, product_id: productIds },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const cartItemProductIds = cartItems.map((ci) => ci.product_id);
    const missingFromCart = productIds.filter(
      (id) => !cartItemProductIds.includes(id),
    );

    if (missingFromCart.length > 0) {
      throw new ApiError(
        `One or more products are not in your cart: ${missingFromCart.join(', ')}`,
        400,
      );
    }

    // 3️⃣ Fetch product details for pricing/discounts
    const products = await Product.findAll({
      where: { id: productIds },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const existingIds = products.map((p) => p.id);
    const missingIds = productIds.filter((id) => !existingIds.includes(id));
    if (missingIds.length > 0) {
      throw new ApiError(`Product not found: ${missingIds.join(', ')}`, 404);
    }

    // 4️⃣ Calculate total based on quantities stored in CartItems
    let totalAmount = 0;
    let subtotal_amount = 0;
    for (const cartItem of cartItems) {
      const product = products.find((p) => p.id === cartItem.product_id);
      const price = parseFloat(product.price);
      const discount = Number(product.discount_percentage) || 0;
      const discountedPrice = price * (1 - discount / 100);
      totalAmount += discountedPrice * cartItem.quantity;
      subtotal_amount += price * cartItem.quantity;
    }

    // Round to 2 decimals
    totalAmount = parseFloat(totalAmount.toFixed(2));
    subtotal_amount = parseFloat(subtotal_amount.toFixed(2));

    let coupon_price_in_fixed = 0;
    let coupondiscount = null;

    if (coupon_code) {
      coupondiscount = await Coupon.findOne({
        where: { code: coupon_code },
        transaction: t,
      });

      if (coupondiscount.discount_type === 'FIXED') {
        coupon_price_in_fixed = coupondiscount.discount_value;
      } else {
        coupon_price_in_fixed =
          (coupondiscount.discount_value / 100) * totalAmount;
      }
    }

    coupon_price_in_fixed = parseFloat(coupon_price_in_fixed).toFixed(2);

    totalAmount = totalAmount - coupon_price_in_fixed;

    if (totalAmount < 0) totalAmount = 0;

    // 5️⃣ Create Order for this user
    const order = await Order.create(
      {
        user_id: userId,
        payment_method,
        total_amount: totalAmount,
        subtotal_amount: subtotal_amount,
        discount_amount: subtotal_amount - totalAmount,
        coupon_id: coupondiscount ? coupondiscount.id : null,
        status: 'PENDING',
      },
      { transaction: t },
    );

    // 6️⃣ Create OrderItems from the user's cart items
    const orderItemsData = cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product_id);
      return {
        order_id: order.id,
        product_id: product.id,
        price: product.price,
        quantity: cartItem.quantity,
      };
    });

    await OrderItems.bulkCreate(orderItemsData, { transaction: t });

    await t.commit();

    return order;
  } catch (error) {
    await t.rollback();
    throw new ApiError(error.message, error.statusCode || 500);
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
