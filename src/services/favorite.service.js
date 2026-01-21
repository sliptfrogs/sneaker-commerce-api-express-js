import { Favorite , Product, User } from "../models/index.js";

export const addFavoriteService = async (user_id, product_id) => {
  const [favorite, created] = await Favorite.findOrCreate({
    where: { user_id, product_id },
  });

  if (!created) {
    throw new Error("Product already in favorites");
  }

  return favorite;
};

// Remove favorite
export const removeFavoriteService = async (fav_id) => {
  const deleted = await Favorite.destroy({
    where: { id: fav_id }, 
  });

  if (!deleted) throw new Error("Favorite not found");
  return true;
};

// Get my favorites
export const getMyFavoritesService = async (user_id) => {
  const userWithFavorites = await User.findByPk(user_id, {
    attributes: ["id", "email", "role"],
    include: [
      {
        model: Product,
        as: "favoriteProducts",
        attributes: ["id", "title"],
        through: { attributes: ["created_at"] },
      },
   
    ],
  });

  if (!userWithFavorites) {
    throw new ApiError("Favorites not found", 404);
  }

  return userWithFavorites;
};