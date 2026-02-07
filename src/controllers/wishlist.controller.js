import {
  createWishlistService,
  destroyUserWishlist,
  getUserWishlistByUserId,
} from '../services/wishlist.service.js';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../utils/ApiResponse.util.js';

export const createWishlistController = async (req, res) => {
  try {
    await createWishlistService({
      userId: req.user.id,
      productId: req.body.product_id,
    });
    sendSuccessResponse(res, [], 'Wishlist created');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};

export const getWishListController = async (req, res) => {
  try {
    const wishlist = await getUserWishlistByUserId(req.user.id);
    sendSuccessResponse(res, wishlist, 'Wishlist fetched');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};
export const destroyWishlistController = async (req, res) => {
  try {
    await destroyUserWishlist(req.user.id, req.body.product_id);
    sendSuccessResponse(res, [], 'Wishlist deleted');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};
