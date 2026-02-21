import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const env = process.env.NODE_ENV || 'development';
// const envFile = env === 'production' ? '.env.production' : '.env.dev';

// dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });
dotenv.config();
export const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER, // username
  process.env.DB_PASSWORD, // <-- fixed to match .env
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? { ssl: { rejectUnauthorized: false } }
        : {},
    logging: false,
  },
);
