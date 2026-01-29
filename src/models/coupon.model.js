import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";

export const Coupon = sequelize.define(
  "coupon_tb",
  {
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    discount_type: {
      type: DataTypes.ENUM("FIXED", "PERCENT"),
      defaultValue: "FIXED",
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    max_discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    used_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }
  },
  { timestamps: true },
);
