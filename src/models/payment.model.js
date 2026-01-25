import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { Order } from "./order.model.js";
import { FakeBankAccount } from "./fake.bank.account.model.js";


export const Payment = sequelize.define("payment_tb", {
  method: {
    type: DataTypes.ENUM(
      "CREDIT_CARD",
      "FAKE_BANK",
      "PAYPAL",
      "STRIPE",
      "CASH",
      "OTHER",
    ),
    allowNull: false,
    defaultValue: "CREDIT_CARD",
  },
  status: {
    type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
    defaultValue: "PENDING",
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: Order,
      key: "id",
    },
  },
  bank_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FakeBankAccount,
      key: "id",
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

