import { DataTypes } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import { User } from "./user.model.js";
import { Category } from "./category.model.js";
import { Brand } from "./brand.model.js";


export const Product = sequelize.define("product_tb",{

    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    price_after_discount:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    discount_price:{
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },

    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sku:{
        type: DataTypes.STRING,
        allowNull: true
    },
    weight: {
        type : DataTypes.DECIMAL,
        allowNull: true
    },
    width: {
        type : DataTypes.DECIMAL,
        allowNull: true
    },
    height: {
        type : DataTypes.DECIMAL,
        allowNull: true
    },
    warranty_infor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    shipping_infor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    availability_status: {
        type: DataTypes.ENUM("IN_STOCK", "OUT_OF_STOCK", "PREORDER"),
        defaultValue: "IN_STOCK"
    },
    return_policy: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    minimum_order_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    barcode_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    qr_code_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    thumbnail_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    category_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        },
    },
    brand_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Brand,
            key: 'id'
        },
    },
    created_by:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },


})

