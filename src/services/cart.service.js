import { sequelize } from "../config/SequelizeORM.js";
import { CartItems } from "../models/cart.items.model.js";
import { Cart, Product, User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";

export const AddCart = async (userId, reqBody) => {
  const t = await sequelize.transaction();

  try {
    if (!userId) {
      throw new ApiError("User ID is required to add to cart", 400);
    }

    const product = await Product.findByPk(reqBody.product_id, { transaction: t });
    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const [cart, cartCreated] = await Cart.findOrCreate({
      where: { user_id: userId, status: "ACTIVE" },
      defaults: {
        user_id: userId,
        status: "ACTIVE",
      },
      transaction: t,
    });

    if (!cart) {
      throw new ApiError("Failed to find or create cart", 500);
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
export const GetCartItems = async(userId)=>{
    try {
        const carts = await Cart.findAll({
            where: { user_id: userId, status: "ACTIVE" },
            include: [
                {
                    model: Product,
                    as: "productsInCart",
                    through: {
                        attributes: ["quantity", "price_at_time"],
                    },
                },
            ],
        })
        return carts;
    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500);
    }
}
export const ClearCartByIdService = async(cartId)=>{
    try {
        await CartItems.destroy({
            where: { cart_id: cartId },
        });

        return;

    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500);
    }
}
export const ClearAllCartsByUserIdService = async(userId)=>{
    try {
        const cart = await Cart.findOne({
            where: { user_id: userId, status: "ACTIVE" },
        });

        if (!cart) {
            throw new ApiError("Active cart not found for the user", 404);
        }

        await CartItems.destroy({
            where: { cart_id: cart.id },
        });

        return;

    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500);
    }
};
