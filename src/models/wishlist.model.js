import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";
import { Product } from "./products.model.js";


export const Wishlist = sequelize.define("wishlist_tb",{

    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
    },
    product_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        },
    },
     added_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

},{
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'product_id']
        }
    ],
    timestamps:false
})
