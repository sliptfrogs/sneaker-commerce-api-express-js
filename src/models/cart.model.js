import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
import { User } from './user.model.js';

export const Cart = sequelize.define(
  'cart_tb',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CHECKED_OUT', 'ABANDONED'),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  },
);
