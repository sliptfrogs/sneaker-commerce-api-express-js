import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
import { User } from './user.model.js';
import { Product } from './products.model.js';

export const RecentlyViewed = sequelize.define(
  'recently_viewed_tb',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    viewed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  },
);
