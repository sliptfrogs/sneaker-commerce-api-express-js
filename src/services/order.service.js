import { sequelize } from "../config/SequelizeORM.js";
import { Product } from "../models/products.model.js";
import { Order } from "../models/order.model.js";
import { OrderItems } from "../models/order.items.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { Payment } from "../models/payment.model.js";
import { Category } from "../models/category.model.js";
import { ProductImage } from "../models/product.image.model.js";
import { FakeBankAccount } from "../models/fake.bank.account.model.js";

export const CreateCheckoutService = async (req) => {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError("No products provided in items array", 400);
    }

    // 1️⃣ Fetch all products
    const productIds = items.map((i) => i.product_id);
    const products = await Product.findAll({
      where: { id: productIds },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // 2️⃣ Validate products exist
    const existingIds = products.map((p) => p.id);
    const missingIds = productIds.filter((id) => !existingIds.includes(id));
    if (missingIds.length > 0) {
      throw new ApiError(`Product not found: ${missingIds.join(", ")}`);
    }

    // 3️⃣ Validate stock & calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);

      // Convert price string to number
      const price = parseFloat(product.price);

      // Apply discount if exists
      const discount = product.discount_percentage || 0;
      const discountedPrice = price * (1 - discount / 100);

      // Multiply by quantity
      totalAmount += discountedPrice * item.quantity;
    }

    // Round to 2 decimals
    totalAmount = parseFloat(totalAmount.toFixed(2));

    // 4️⃣ Create Order
    const order = await Order.create(
      {
        user_id: req.user.id,
        payment_method,
        total_amount: totalAmount,
        status: "PENDING",
      },
      { transaction: t },
    );

    // 5️⃣ Create OrderItems
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        order_id: order.id,
        product_id: product.id,
        price: product.price,
        quantity: item.quantity,
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
          as: "order_items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
    });
    return checkouts;
  } catch (error) {
    throw new ApiError(
      error.message || "Something went wrong",
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
          as: "order_items", // alias from association
          include: [
            {
              model: Product,
              as: "product", // alias from OrderItems → Product
              include: [
                { model: ProductImage, as: "images" },
                { model: Category, as: "category" }, // optional
              ],
            },
          ],
        },
        { model: Payment, as: "payment" }, // alias from Order → Payment
      ],
      transaction: t,
      // lock: t.LOCK.UPDATE, // lock order row
    });

    if (!order) throw new ApiError(`Order not found`, 404);
    if (order.status !== "PENDING")
      throw new ApiError("Order already processed", 409);



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
      throw new ApiError("Bank card not found", 404);
    }
    if (checkBankCard.balance < order.total_amount) {
      throw new ApiError("Insufficient bank balance", 400);
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
        status: "COMPLETED", // simulate success/failure
        method: order.payment_method,
      },
      { transaction: t },
    );

    // 5️⃣ Update Order Status
    order.status = "PAID";
    await order.save({ transaction: t });

    // 6️⃣ Commit Transaction
    await t.commit();

    return { order, payment };
  } catch (err) {
    await t.rollback();
    throw new ApiError(err.message, err.statusCode || 500);
  }
};
