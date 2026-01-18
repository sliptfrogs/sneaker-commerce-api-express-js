import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";



export const Order = sequelize.define("order_tb",{

    status:{
        type: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING'
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
    },
    created_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
})

