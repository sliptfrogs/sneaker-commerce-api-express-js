import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';

export const Favorite = sequelize.define(
  'favorites_tb',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'], // 🚫 prevent duplicates
      },
    ],
  },
);
