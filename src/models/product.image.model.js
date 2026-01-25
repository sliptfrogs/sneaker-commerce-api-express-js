import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { Product } from "./products.model.js";

export const ProductImage = sequelize.define("product_image_tb", {
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
});
