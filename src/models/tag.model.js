import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";



export const Tag = sequelize.define("tag_tb",{

    tag_name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

