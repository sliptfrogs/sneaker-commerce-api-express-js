import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
import { Product } from './products.model.js';

export const ProductSize = sequelize.define('product_size_tb', {
  size: {
    type: DataTypes.DECIMAL,
    allowNull: false,
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
