import { parse } from 'path';
import { sequelize } from '../config/SequelizeORM.js';
import { CartItems } from '../models/cart.items.model.js';
import {
  Brand,
  Cart,
  Category,
  Product,
  ProductColor,
  ProductSize,
  Reviews,
  User,
  UserProfile,
} from '../models/index.js';
import { ApiError } from '../utils/ApiError.util.js';

export const AddCart = async (userId, reqBody) => {
  const t = await sequelize.transaction();

  try {
    if (!userId) {
      throw new ApiError('User ID is required to add to cart', 400);
    }

    const product = await Product.findByPk(reqBody.product_id, {
      transaction: t,
    });
    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    const [cart, cartCreated] = await Cart.findOrCreate({
      where: { user_id: userId, status: 'ACTIVE' },
      defaults: {
        user_id: userId,
        status: 'ACTIVE',
      },
      transaction: t,
    });

    if (!cart) {
      throw new ApiError('Failed to find or create cart', 500);
    }

    const [cartItems, created] = await CartItems.findOrCreate({
      where: {
        cart_id: cart.id,
        product_id: product.id,
      },
      defaults: {
        cart_id: cart.id,
        product_id: product.id,
        quantity: reqBody.quantity,
        price_at_time: product.price * reqBody.quantity,
      },
      transaction: t,
    });

    if (!created) {
      cartItems.quantity += reqBody.quantity;
      cartItems.price_at_time = product.price * cartItems.quantity;
      await cartItems.save({ transaction: t });
    }

    await t.commit();
    return cartItems;
  } catch (error) {
    await t.rollback();
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
export const GetCartItems = async (userId) => {
  try {
    // Fetch all items belonging to the user's active cart
    const userCart = await Cart.findAll({
      where: { user_id: userId, status: 'ACTIVE' },
      include: [
        {
          model: CartItems,
          as: 'cartItems',
          include: [
            {
              model: Product,
              as: 'products_in_cart',
              include: [
                {
                  model: ProductSize,
                  as: 'sizes',
                  attributes: ['id', 'size'],
                },
                {
                  model: ProductColor,
                  as: 'colors',
                  attributes: ['id', 'color'],
                },
                {
                  model: Category,
                  as: 'category',
                },
                {
                  model: Brand,
                  as: 'brand',
                },
              ],
            },
          ],
        },
      ],

      order: [
        [
          { model: CartItems, as: 'cartItems' },
          { model: Product, as: 'products_in_cart' },
          { model: ProductSize, as: 'sizes' },
          'id',
          'ASC',
        ],
        [
          { model: CartItems, as: 'cartItems' },
          { model: Product, as: 'products_in_cart' },
          { model: ProductColor, as: 'colors' },
          'id',
          'ASC',
        ],
      ],
    });
    // return userCart[0];
    return {
      cart_id: userCart[0].id,
      user_cart_id: userCart[0].user_id,
      cart_status: userCart[0].status,
      cart_items: userCart[0].cartItems.map((item) => ({
        price_at_time: item.price_at_time,
        quantity: item.quantity,
        product: item.products_in_cart,
      })),
      // products: userCart[0].cartItems.map((item) => item.products_in_cart),
    };
  } catch (error) {
    // Use custom error class; ensure a status code is set (default to 500)
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
export const ClearCartByIdService = async (product_id, user_id) => {
  try {
    // 1. Find the user's ACTIVE cart
    const cart = await Cart.findOne({
      where: { user_id: user_id, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new ApiError('Active cart not found for this user.', 404);
    }

    // 2. Attempt to delete the cart item directly and check affected rows
    const deletedCount = await CartItems.destroy({
      where: {
        cart_id: cart.id,
        product_id: product_id,
      },
    });

    if (deletedCount === 0) {
      throw new ApiError(
        `Product with ID ${product_id} not found in your active cart.`,
        404,
      );
    }

    // 3. Optionally return the updated cart items or a success message
    return {
      success: true,
      message: 'Item removed from cart successfully.',
    };
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
export const ClearAllCartsByUserIdService = async (userId) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: userId, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new ApiError('Active cart not found for the user', 404);
    }

    await CartItems.destroy({
      where: { cart_id: cart.id },
    });

    return;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
export const updateQuantityCartByIdService = async (
  productId,
  userId,
  deltaQuantity,
) => {
  try {
    // 1. Find the user's ACTIVE cart (not just any cart)
    const cart = await Cart.findOne({
      where: { user_id: userId, status: 'ACTIVE' },
    });

    if (!cart) {
      throw new ApiError('Active cart not found for this user.', 404);
    }

    // 2. Find the specific cart item
    const cartItem = await CartItems.findOne({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
      include: [
        {
          model: Product,
          as: 'products_in_cart', // adjust alias if needed
          attributes: ['stock'], // needed for stock validation
        },
      ],
    });

    if (!cartItem) {
      throw new ApiError('Product not found in cart.', 404);
    }

    // 3. Calculate new quantity
    const newQuantity = cartItem.quantity + deltaQuantity;

    // 4. Validate new quantity
    if (newQuantity < 0) {
      throw new ApiError('Quantity cannot be negative.', 400);
    }

    // Optional: check against product stock
    const product = cartItem.products_in_cart;
    if (product && newQuantity > product.stock) {
      throw new ApiError(
        `Only ${product.stock} items available in stock.`,
        400,
      );
    }

    // 5. Handle deletion if quantity becomes zero
    if (newQuantity === 0) {
      await cartItem.destroy();
      return {
        success: true,
        message: 'Item removed from cart.',
        cart_id: cart.id,
      };
    }

    // 6. Update only the quantity (DO NOT change price_at_time – it stores the unit price at time of addition)
    await cartItem.update({
      quantity: newQuantity,
      price_at_time:
        (parseFloat(cartItem.price_at_time) / cartItem.quantity) * newQuantity, // adjust total price based on new quantity
    });

    // 7. Return updated cart item (or any useful data)
    return {
      success: true,
      message: 'Cart quantity updated.',
      cart_item: {
        id: cartItem.id,
        product_id: cartItem.product_id,
        quantity: newQuantity,
        price_at_time: cartItem.price_at_time, // still the original unit price
        subtotal: (newQuantity * parseFloat(cartItem.price_at_time)).toFixed(2),
      },
    };
  } catch (error) {
    // Ensure a status code is always passed (default to 500)
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
