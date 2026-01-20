import { UniqueConstraintError } from "sequelize";
import {
  Brand,
  Category,
  Product,
  Reviews,
  User,
  UserProfile,
} from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";
import { findBrandById } from "./brand.service.js";
import { getCategoryService } from "./category.service.js";
import { findUserById } from "./user.service.js";

export const createProductService = async (req) => {
  const reqBody = req.body;
  try {
    // Find Category with id before create product
    await getCategoryService(reqBody.category_id);
    await findBrandById(reqBody.brand_id);
    await findUserById(req.user.id);

    await Product.create({
      title: reqBody?.title,
      description: reqBody?.description,
      category_id: reqBody?.category_id,
      brand_id: reqBody?.brand_id,
      created_by: req?.user.id,
      price: reqBody?.price,
      discount_percentage: reqBody?.discount_percentage ?? 0,
      stock: reqBody?.stock,
      sku: reqBody?.sku,
      weight: reqBody?.weight,
      width: reqBody?.width,
      height: reqBody?.height,
      warranty_infor: reqBody?.warranty_infor,
      shipping_infor: reqBody?.shipping_infor,
      availability_status: reqBody?.availability_status,
      return_policy: reqBody?.return_policy,
      minimum_order_quantity: reqBody?.minimum_order_quantity,
      barcode_url: reqBody?.barcode_url,
      qr_code_url: reqBody?.qr_code_url,
      thumbnail_url: reqBody?.thumbnail,
    });
    return;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const duplicatedFields = error.errors.map((e) => ({
        field: e.path,
        value: e.value,
      }));
      throw new ApiError(
        "Some product field must be unique or can't be dupplicated",
        error.statusCode,
        duplicatedFields,
      );
    }
    throw new ApiError(error.message, error.statusCode);
  }
};
export const getProductsService = async () => {
  try {
    const products = await Product.findAll();

    return products;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ApiError("Product already exists", error.statusCode);
    }
    throw new ApiError(error.message, error.statusCode);
  }
};
export const getAllProductsViaCategoryService = async (categoryId) => {
  try {
    const products = await Product.findAll({
      where: {
        category_id: categoryId,
      },
    });
    return products;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
export const getProductByIdService = async (id) => {
  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          as: "category",
        },
        {
          model: Brand,
          attributes: ["id", "name"],
          as: "brand",
        },
        {
          model: Reviews,
          attributes: ["rating", "comment"],
          include: [
            {
              model: User,
              attributes: ["id", "email"],
              include: [
                {
                  model: UserProfile,
                  attributes: ["first_name", "last_name"],
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        "title",
        "description",
        "price",
        "discount_percentage",
        "stock",
        "sku",
        "weight",
        "width",
        "height",
        "warranty_infor",
        "shipping_infor",
        "availability_status",
        "return_policy",
        "qr_code_url",
        "barcode_url",
        "thumbnail_url",
        "like_count",
      ],
    });
    if (!product) {
      throw new ApiError("Product not found", 404);
    }
    return product;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};

export const updateProductService = async (productId, reqBody) => {
  try {
    console.log("request body", reqBody);

    const findExist = await Product.findByPk(productId);
    if (!findExist) {
      throw new ApiError("Product update not found", 404);
    }
    await getCategoryService(reqBody.category_id);
    await findBrandById(reqBody.brand_id);

    await findExist.update({
      title: reqBody?.title,
      description: reqBody?.description,
      category_id: reqBody?.category_id,
      brand_id: reqBody?.brand_id,
      price: reqBody?.price,
      discount_percentage: reqBody?.discount_percentage ?? 0,
      stock: reqBody?.stock,
      sku: reqBody?.sku,
      weight: reqBody?.weight,
      width: reqBody?.width,
      height: reqBody?.height,
      warranty_infor: reqBody?.warranty_infor,
      shipping_infor: reqBody?.shipping_infor,
      availability_status: reqBody?.availability_status,
      return_policy: reqBody?.return_policy,
      minimum_order_quantity: reqBody?.minimum_order_quantity,
      barcode_url: reqBody?.barcode_url,
      qr_code_url: reqBody?.qr_code_url,
      thumbnail_url: reqBody?.thumbnail,
    });
    return findExist;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
export const destroyProductService = async (productId) => {
  try {
    const productDelete = await Product.findByPk(productId);
    if(!productDelete){
      throw new ApiError('Product to Delete not found', 404)
    };
    await productDelete.destroy();
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
