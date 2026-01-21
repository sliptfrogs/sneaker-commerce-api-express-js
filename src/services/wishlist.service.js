import { UniqueConstraintError } from "sequelize";
import { Product, User, UserProfile, Wishlist } from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";
import { getProductByIdService } from "./product.service.js";
import { findUserById } from "./user.service.js";

export const createWishlistService = async (rqBody) => {
  try {
    await findUserById(rqBody.userId);
    await getProductByIdService(rqBody.productId);
    await Wishlist.create({
      user_id: rqBody.userId,
      product_id: rqBody.productId,
    });
    return;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ApiError(
        "Product you already wished, try to add another product",
        error.statusCode,
      );
    }
    throw new ApiError(error.message, error.statusCode);
  }
};
export const getUserWishlistByUserId = async (id) => {
  try {
    const wishlist = await User.findByPk(id,{
      include:[
        {
          model: Product,
          as: "wishlistProducts",
          through: {attributes: ['added_at']}
        },
        {
          model: UserProfile,
          as:'profile',
          attributes: ['id', 'first_name', 'last_name', 'phone_number','avatar_url']
        }
      ],
      attributes: ['id', 'email','role']
    })
    if (!wishlist) {
      throw new ApiError("Wishlist Not found", 404);
    }
    return wishlist;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
export const destroyUserWishlist=async(userId, productId)=>{
  try {
    const wishlistToDestroy = await Wishlist.findOne({
      where: {
        user_id: userId,
        product_id: productId
      }
    });
    if(!wishlistToDestroy)throw new ApiError('Wishlist to delete not found', 404)

      await wishlistToDestroy.destroy();
      return;
  } catch (error) {
    throw new ApiError(error.message,error.statusCode)
  }
}
