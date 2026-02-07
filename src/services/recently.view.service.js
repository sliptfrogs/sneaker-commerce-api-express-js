import { Product, User } from '../models/index.js';
import { RecentlyViewed } from '../models/index.js';
import { ApiError } from '../utils/ApiError.util.js';
export const createRecentlyViewedService = async (userId, productId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError('User not found', 404);

    const product = await Product.findByPk(productId);
    if (!product) throw new ApiError('Product not found', 404);

    const [view, created] = await RecentlyViewed.findOrCreate({
      where: {
        user_id: userId,
        product_id: productId,
      },
      defaults: {
        viewed_at: new Date(),
      },
    });

    if (!created) {
      view.viewed_at = new Date();
      await view.save();
    }

    return view;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};

export const getRecentlyViewedService = async (userId) => {
  try {
    const products = await Product.findAll({
      where: {
        '$usersWhoViewed.id$': userId,
      },
      include: [
        {
          model: User,
          as: 'usersWhoViewed',
          attributes: ['id', 'email'],
        },
      ],
    });
    return products;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
