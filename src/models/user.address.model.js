import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";


export const UserAddress = sequelize.define("user_address_tb",{

    address_one:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    address_two: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city:{
        type: DataTypes.STRING
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'id'
        },
    },
})

