import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";
import { Coupon } from "./coupon.model.js";

export const CouponUsage = sequelize.define(
  "coupon_usage_tb",
  {
    coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Coupon,
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: User,
            key: "id"
        }
    },
    usage_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false },
);
