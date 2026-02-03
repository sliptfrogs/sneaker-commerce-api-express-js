import { Favorite, Product, User } from "../models/index.js";
import {
  addFavoriteService,
  getMyFavoritesService,
  removeFavoriteService,
} from "../services/favorite.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/ApiResponse.util.js";

// Add product to favorites
export const addToFavorite = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;

    const favorite = await addFavoriteService(user_id, product_id);

    res.status(201).json({
      success: true,
      message: "Added to favorites",
      data: favorite,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params; // product ID from URL
    const user_id = req.user.id;

    await removeFavoriteService(id, user_id);

    sendSuccessResponse(res, [], "Favourite Removed");
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const favorites = await getMyFavoritesService(user_id);

    res.status(200).json({
      count: favorites.favoriteProducts.length,
      statusCode: 200,
      success: true,
      message: "Success",
      data: favorites,
      meta: [],
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
