import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";


export const User = sequelize.define("user_tb",{
    email:{
        type: DataTypes.STRING,
        unique: true
    },
    password_hash:{
        type: DataTypes.TEXT
    },
    role: {
        type: DataTypes.ENUM("ADMIN", "USER"),
        defaultValue: "USER"
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    }
})

