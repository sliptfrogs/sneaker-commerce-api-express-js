import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
import { User } from './user.model.js';
import { Product } from './products.model.js';

export const Reviews = sequelize.define('review_tb', {
  rating: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
