import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { Order } from "./order.model.js";


export const Payment = sequelize.define("payment_tb",{

    method:{
        type: DataTypes.ENUM('CREDIT', 'PAYPAL', 'STRIPE', 'CASH', 'OTHER'),
        defaultValue: 'OTHER'
    },
    status:{
        type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING'
    },
    order_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Order,
            key: 'id'
        },
    },

    paid_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    created_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
})

