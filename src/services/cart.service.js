import { sequelize } from '../config/SequelizeORM.js';
import { CartItems } from '../models/cart.items.model.js';
import { Cart, Product, User } from '../models/index.js';
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
    const carts = await Cart.findAll({
      where: { user_id: userId, status: 'ACTIVE' },
      include: [
        {
          model: Product,
          as: 'productsInCart',
          // through: {
          //   attributes: ['quantity', 'price_at_time'],
          // },
        },
      ],
    });
    return carts;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
export const ClearCartByIdService = async (product_id, user_id) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: user_id },
    });

    if (!cart) {
      throw new ApiError(`Cannot find your cart`, 404);
    }

    const product = await Product.findByPk(product_id);

    if (!product) {
      throw new ApiError(
        `Product with ID ${product_id} not found in your cart!`,
        404,
      );
    }

    await CartItems.destroy({
      where: {
        cart_id: cart.id,
        product_id: product_id,
      },
    });

    return;
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
  quantity,
) => {
  try {
    const findUserCart = await Cart.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!findUserCart) {
      throw new ApiError('User cart is empty', 404);
    }
    const findCartItems = await CartItems.findOne({
      where: {
        cart_id: findUserCart.id,
        product_id: productId,
      },
    });
    if (!findCartItems) {
      throw new ApiError('Cart not found');
    }

    const checkValidQuantity = findCartItems.quantity + quantity;
    if (checkValidQuantity < 0) {
      throw new ApiError('Cart quantity must be negative or below 0');
    } else if (checkValidQuantity == 0) {
      await findCartItems.destroy();
      return;
    }

    // const findCartItms

    await findCartItems.update({
      quantity: checkValidQuantity,
      price_at_time: findCartItems.price_at_time * checkValidQuantity,
    });
    return;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
