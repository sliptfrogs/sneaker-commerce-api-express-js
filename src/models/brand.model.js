import { DataTypes } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';

export const Brand = sequelize.define('brand_tb', {
  name: {
    type: DataTypes.STRING,
  },
});
