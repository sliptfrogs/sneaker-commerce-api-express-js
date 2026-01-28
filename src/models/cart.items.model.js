import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";
import { Cart } from "./cart.model.js";
import { Product } from "./products.model.js";

export const CartItems = sequelize.define("cart_items_tb", {
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cart,
      key: "id",
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_at_time: {
    type: DataTypes.DECIMAL(10, 2),
  }
},{
    timestamps: true,
});
