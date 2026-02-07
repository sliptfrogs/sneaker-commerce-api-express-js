import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
export const ProductLike = sequelize.define(
  'ProductLike',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'product_likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'], // 🚨 prevents double-like
      },
    ],
  },
);
