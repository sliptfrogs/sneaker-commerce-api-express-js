import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
import { Product } from './products.model.js';

export const ProductColor = sequelize.define('product_color_tb', {
  color: {
    type: DataTypes.STRING,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
});
