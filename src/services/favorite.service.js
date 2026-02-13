import {
  Brand,
  Category,
  Favorite,
  Product,
  ProductColor,
  ProductImage,
  ProductSize,
  User,
  UserProfile,
} from '../models/index.js';
import { ApiError } from '../utils/ApiError.util.js';

export const addFavoriteService = async (user_id, product_id) => {
  const [favorite, created] = await Favorite.findOrCreate({
    where: { user_id, product_id },
  });

  if (!created) {
    throw new Error('Product already in favorites');
  }

  return favorite;
};

// Remove favorite
export const removeFavoriteService = async (pro_id, user_id) => {
  const findDeleteFavourite = await Favorite.findOne({
    where: {
      product_id: pro_id,
      user_id: user_id,
    },
  });

  if (!findDeleteFavourite) {
    throw new ApiError('Favourite not found', 404);
  }

  await findDeleteFavourite.destroy();

  return true;
};

// Get my favorites
export const getMyFavoritesService = async (user_id) => {
  const userWithFavorites = await User.findByPk(user_id, {
    attributes: ['id', 'email', 'role'],
    include: [
      {
        model: UserProfile,
        as: 'profile',
        attributes: ['first_name', 'last_name', 'avatar_url'],
      },
      {
        model: Product,
        as: 'favoriteProducts',
        // attributes: ["id", "title"],
        through: { attributes: ['created_at'] },
        include: [
          {
            model: ProductImage,
            as: 'images',
            attributes: ['image_url'],
          },
          {
            model: ProductSize,
            as: 'sizes',
            attributes: ['size'],
          },
          {
            model: ProductColor,
            as: 'colors',
            attributes: ['color'],
          },
          {
            model: Category,
            as: 'category',
          },
          {
            model: Brand,
            as: 'brand',
          },
          {
            model: User,
            as: 'create_by_admin',
            attributes: ['email'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: {
                  exclude: ['user_id'],
                },
              },
            ],
          },
        ],
      },
    ],
  });

  if (!userWithFavorites) {
    throw new ApiError('Favorites not found', 404);
  }

  return userWithFavorites;
};
