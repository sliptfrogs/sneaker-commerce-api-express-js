import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";


export const Category = sequelize.define("category_tb",{
    name:{
        type: DataTypes.STRING
    }
})

