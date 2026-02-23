import { col, fn, literal, UniqueConstraintError } from 'sequelize';
import { sequelize } from '../config/SequelizeORM.js';
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
  ProductColor,
} from '../models/index.js';
import { ApiError } from '../utils/ApiError.util.js';
import { findBrandById } from './brand.service.js';
import { getCategoryService } from './category.service.js';
import { findUserById } from './user.service.js';
import { OrderItems } from '../models/order.items.model.js';

export const createProductService = async (req) => {
  const reqBody = req.body;
  const urls = req.cloudinaryUrls || {};

  const t = await sequelize.transaction();
  try {
    const thumbnailUrl = urls.thumbnail?.[0];
    const barcodeUrl = urls.barcode_url?.[0];
    const qrCodeUrl = urls.qr_code_url?.[0];

    if (!thumbnailUrl || !barcodeUrl || !qrCodeUrl) {
      throw new ApiError(
        'Thumbnail, barcode, and QR code files are required',
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
        barcode_url: barcodeUrl,
        qr_code_url: qrCodeUrl,
        thumbnail_url: thumbnailUrl,
      },
      { transaction: t },
    );

    const imagesData = urls.product_images?.map((imageUrl) => ({
      image_url: imageUrl,
      product_id: product.id,
    }));

    if (imagesData?.length)
      await ProductImage.bulkCreate(imagesData, { transaction: t });
    if (reqBody.sizes?.length)
      await ProductSize.bulkCreate(
        reqBody.sizes.map((size) => ({ size, product_id: product.id })),
        { transaction: t },
      );
    if (reqBody.colors?.length)
      await ProductColor.bulkCreate(
        reqBody.colors.map((color) => ({
          color: color,
          product_id: product.id,
        })),
        {
          transaction: t,
        },
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
          as: 'images',
          attributes: ['id', 'image_url'],
        },
        {
          model: ProductSize,
          as: 'sizes',
          attributes: ['id', 'size'],
        },
        {
          model: ProductColor,
          as: 'colors',
          attributes: ['id', 'color'],
        },
        {
          model: Category,
          as: 'category',
        },
        {
          model: Brand,
          as: 'brand',
        },
        {
          model: User,
          as: 'create_by_admin',
          attributes: ['email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: { exclude: ['user_id'] },
            },
          ],
        },
      ],

      attributes: { exclude: ['category_id', 'brand_id', 'created_by'] },

      // ✅ ALL SORTING HERE
      order: [
        ['id', 'ASC'], // Sort products by id
        // Sort sizes by id
        [{ model: ProductSize, as: 'sizes' }, 'id', 'ASC'],

        // Sort colors by id
        [{ model: ProductColor, as: 'colors' }, 'id', 'ASC'],

        [{ model: ProductImage, as: 'images' }, 'id', 'ASC'],
      ],
    });

    return products;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
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
          attributes: ['id', 'name'],
          as: 'category',
        },
        {
          model: Brand,
          attributes: ['id', 'name'],
          as: 'brand',
        },
        {
          model: ProductSize,
          attributes: ['size'],
          as: 'sizes',
        },
        {
          model: ProductColor,
          attributes: ['color'],
          as: 'colors',
        },
        {
          model: Reviews,
          attributes: ['rating', 'comment'],
          include: [
            {
              model: User,
              attributes: ['id', 'email'],
              include: [
                {
                  model: UserProfile,
                  attributes: ['first_name', 'last_name'],
                  as: 'profile',
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        'title',
        'description',
        'price',
        'discount_percentage',
        'stock',
        'sku',
        'weight',
        'width',
        'height',
        'warranty_infor',
        'shipping_infor',
        'availability_status',
        'return_policy',
        'qr_code_url',
        'barcode_url',
        'thumbnail_url',
        'like_count',
      ],
    });
    if (!product) {
      throw new ApiError('Product not found', 404);
    }
    return product;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};

export const updateProductService = async (productId, req) => {
  const reqBody = req.body;
  const urls = req.cloudinaryUrls || {};
  const t = await sequelize.transaction();
  try {
    const findExist = await Product.findByPk(productId);
    if (!findExist) {
      throw new ApiError('Product update not found', 404);
    }
    await getCategoryService(reqBody.category_id);
    await findBrandById(reqBody.brand_id);

    // Get Cloudinary URLs (use existing if not uploaded)
    const thumbnailUrl = urls.thumbnail?.[0] || findExist.thumbnail_url;
    const barcodeUrl = urls.barcode_url?.[0] || findExist.barcode_url;
    const qrCodeUrl = urls.qr_code_url?.[0] || findExist.qr_code_url;

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

    // Only add new images if provided
    if (urls.product_images?.length) {
      const imagesData = urls.product_images.map((imageUrl) => ({
        image_url: imageUrl,
        product_id: findExist.id,
      }));
      await ProductImage.bulkCreate(imagesData, { transaction: t });
    }

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
      throw new ApiError('Product to Delete not found', 404);
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
        as: 'orderItems', // must match association in models/index.js
        attributes: [],
        required: true, // only products that have at least one matching order item
        include: [
          {
            model: Order,
            as: 'order', // must match OrderItems → Order association (models/index.js)
            attributes: [],
            required: true,
            where: { status: 'PAID' }, // only count items from PAID orders
          },
        ],
      },
      {
        model: ProductImage,
        as: 'images',
        separate: true, // load images in a separate query to avoid GROUP BY issues
      },
    ],
    attributes: [
      'id',
      'title',
      'price',
      'thumbnail_url',
      [fn('COALESCE', fn('SUM', col('orderItems.quantity')), 0), 'total_sold'],
    ],
    group: [col('product_tb.id')],
    order: [[literal('"total_sold"'), 'DESC']],
    limit,
    subQuery: false,
  });

  return popularProducts;
};
