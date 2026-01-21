import { Favorite, Product, User } from "../models/index.js";
import {
  addFavoriteService,
  getMyFavoritesService,
  removeFavoriteService,
} from "../services/favorite.service.js";

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
    const { fav_id } = req.params; // favorite ID from URL

    await removeFavoriteService(fav_id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Favorite removed successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: error.message,
    });
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

