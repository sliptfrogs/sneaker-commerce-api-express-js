import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
import { User } from './user.model.js';

export const Order = sequelize.define(
  'order_tb',
  {
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED'),
      defaultValue: 'PENDING',
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('CREDIT_CARD', 'FAKE_BANK', 'CASH'),
      defaultValue: 'CREDIT_CARD',
      allowNull: false,
    },
    subtotal_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: true },
);
