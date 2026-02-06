import { col, fn, literal, UniqueConstraintError } from "sequelize";
import { sequelize } from "../config/SequelizeORM.js";
import {
  Brand,
  Category,
  Product,
  ProductImage,
  Reviews,
  User,
  UserProfile,
  Order,
  ProductSize,
} from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";
import { findBrandById } from "./brand.service.js";
import { getCategoryService } from "./category.service.js";
import { findUserById } from "./user.service.js";
import { OrderItems } from "../models/order.items.model.js";

export const createProductService = async (req) => {
  const reqBody = req.body;

  const t = await sequelize.transaction();
  try {
    const thumbnailFile = req.files.thumbnail?.[0];
    const barcodeFile = req.files.barcode_url?.[0];
    const qrCodeFile = req.files.qr_code_url?.[0];

    if (!thumbnailFile || !barcodeFile || !qrCodeFile) {
      throw new ApiError(
        "Thumbnail, barcode, and QR code files are required",
        400,
      );
    }

    const product = await Product.create(
      {
        title: reqBody.title,
        description: reqBody.description,
        category_id: reqBody.category_id,
        brand_id: reqBody.brand_id,
        created_by: req.user.id,
        price: reqBody.price,
        discount_percentage: reqBody.discount_percentage ?? 0,
        stock: reqBody.stock,
        sku: reqBody.sku,
        weight: reqBody.weight,
        width: reqBody.width,
        height: reqBody.height,
        warranty_infor: reqBody.warranty_infor,
        shipping_infor: reqBody.shipping_infor,
        availability_status: reqBody.availability_status,
        return_policy: reqBody.return_policy,
        minimum_order_quantity: reqBody.minimum_order_quantity,
        barcode_url: `/uploads/${barcodeFile.filename}`,
        qr_code_url: `/uploads/${qrCodeFile.filename}`,
        thumbnail_url: `/uploads/${thumbnailFile.filename}`,
      },
      { transaction: t },
    );

    const imagesData = req.files.product_images?.map((file) => ({
      image_url: `/uploads/${file.filename}`,
      product_id: product.id,
    }));

    if (imagesData?.length)
      await ProductImage.bulkCreate(imagesData, { transaction: t });
    if (reqBody.sizes?.length)
      await ProductSize.bulkCreate(
        reqBody.sizes.map((size) => ({ size, product_id: product.id })),
        { transaction: t },
      );

    await t.commit();
    return product;
  } catch (error) {
    await t.rollback();
    if (error instanceof UniqueConstraintError) {
      const duplicatedFields = error.errors.map((e) => ({
        field: e.path,
        value: e.value,
      }));
      throw new ApiError(
        "Some product field must be unique or can't be duplicated",
        error.statusCode || 400,
        duplicatedFields,
      );
    }
    throw new ApiError(error.message, error.statusCode || 400);
  }
};

export const getProductsService = async () => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: ProductSize,
          as: "sizes",
          attributes: ["size"],
        },
        {
          model: Category,
          as: "category",
        },
        {
          model: Brand,
          as: "brand",
        },
        {
          model: User,
          as: 'create_by_admin'
        },
      ],
      attributes: {
        exclude: ["category_id", "brand_id", "created_by"],
      },
    });

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
                  as: "profile",
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

export const updateProductService = async (productId, req) => {
  const reqBody = req.body;
  const t = await sequelize.transaction();
  try {
    console.log("request body", reqBody);

    const findExist = await Product.findByPk(productId);
    if (!findExist) {
      throw new ApiError("Product update not found", 404);
    }
    await getCategoryService(reqBody.category_id);
    await findBrandById(reqBody.brand_id);

    // Files
    const thumbnailFile = req.files.thumbnail[0];
    const barcodeFile = req.files.barcode_url[0];
    const qrCodeFile = req.files.qr_code_url[0];

    // Build URL (to save in DB)
    const thumbnailUrl = `/uploads/${thumbnailFile.filename}`;
    const barcodeUrl = `/uploads/${barcodeFile.filename}`;
    const qrCodeUrl = `/uploads/${qrCodeFile.filename}`;

    await findExist.update(
      {
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
        barcode_url: barcodeUrl,
        qr_code_url: qrCodeUrl,
        thumbnail_url: thumbnailUrl,
      },
      {
        transaction: t,
      },
    );
    const imagesData = req.files.product_images.map((file) => ({
      image_url: `/uploads/${file.filename}`,
      product_id: findExist.id,
    }));

    await ProductImage.bulkCreate(imagesData, { transaction: t });

    await t.commit();
    return findExist;
  } catch (error) {
    await t.rollback();
    throw new ApiError(error.message, error.statusCode);
  }
};
export const destroyProductService = async (productId) => {
  try {
    const productDelete = await Product.findByPk(productId);
    if (!productDelete) {
      throw new ApiError("Product to Delete not found", 404);
    }
    await productDelete.destroy();
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};

export const getPopularProductsService = async (limit = 10) => {
  const popularProducts = await Product.findAll({
    include: [
      {
        model: OrderItems,
        as: "orderItems", // must match association in models/index.js
        attributes: [],
        required: true, // only products that have at least one matching order item
        include: [
          {
            model: Order,
            as: "order", // must match OrderItems → Order association (models/index.js)
            attributes: [],
            required: true,
            where: { status: "PAID" }, // only count items from PAID orders
          },
        ],
      },
      {
        model: ProductImage,
        as: "images",
        separate: true, // load images in a separate query to avoid GROUP BY issues
      },
    ],
    attributes: [
      "id",
      "title",
      "price",
      "thumbnail_url",
      [fn("COALESCE", fn("SUM", col("orderItems.quantity")), 0), "total_sold"],
    ],
    group: [col("product_tb.id")],
    order: [[literal('"total_sold"'), "DESC"]],
    limit,
    subQuery: false,
  });

  return popularProducts;
};
