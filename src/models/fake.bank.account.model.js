import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";

export const FakeBankAccount = sequelize.define(
  "fake_bank_account_tb",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    card_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // each card number must be unique
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0, // initial fake balance
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["user_id"], 
      },
    ],
  }
);
