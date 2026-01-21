import { body } from "express-validator";

export const productValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be string"),
  body("category_id")
    .notEmpty()
    .withMessage("Category id is missing")
    .toInt()
    .isInt()
    .withMessage("Category ID must be number"),
  body("brand_id")
    .notEmpty()
    .withMessage("Brand id is missing")
    .toInt()
    .isInt()
    .withMessage("Brand ID must be number"),
  body("price")
    .notEmpty()
    .withMessage("Price is missing")
    .toFloat()
    .isFloat()
    .withMessage("Price must be float/decimal"),
  body("discount_percentage")
    .optional()
    .toFloat()
    .isFloat()
    .withMessage("Discount Percentage must be float/decimal"),
  body("rating")
    .optional()
    .toInt()
    .isInt()
    .withMessage("Rating must be number(integer)"),
  body("stock")
    .optional()
    .toInt()
    .isInt()
    .withMessage("Stock must be number(integer)"),
  body("sku").optional().isString().withMessage("SKU must be String"),
  body("weight")
    .optional()
    .toFloat()
    .isFloat()
    .withMessage("Weight must be decimal"),
  body("height")
    .optional()
    .toInt()
    .isInt()
    .withMessage("Height must be number(integer)"),
  body("warranty_information")
    .optional()
    .isString()
    .withMessage("Warranty Information must be String"),
  body("shipping_information")
    .optional()
    .isString()
    .withMessage("Shipping Information must be String"),
  body("availability")
    .optional()
    .isIn(["IN_STOCK", "OUT_OF_STOCK", "PREORDER"])
    .withMessage("Invalid Availability"),
  body("return_policy")
    .optional()
    .isString()
    .withMessage("Return Policy must be String"),
  //   body('qr_code_url').optional().isString().withMessage('Qr Code Url must be String'),

  body("thumbnail").custom((value, { req }) => {
    if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
      throw new Error("Thumbnail image is required");
    }
    if (!req.files.thumbnail[0].mimetype.startsWith("image/")) {
      throw new Error("Thumbnail must be an image");
    }
    return true;
  }),

  body("barcode_url").custom((value, { req }) => {
    if (!req.files || !req.files.barcode_url || !req.files.barcode_url[0]) {
      throw new Error("Barcode Image is required");
    }
    if (!req.files.barcode_url[0].mimetype.startsWith("image/")) {
      throw new Error("Barcode must be an image");
    }
    return true;
  }),

  body("qr_code_url").custom((value, { req }) => {
    if (!req.files || !req.files.qr_code_url || !req.files.qr_code_url[0]) {
      throw new Error("QR code image is required");
    }
    if (!req.files.qr_code_url[0].mimetype.startsWith("image/")) {
      throw new Error("QR CODE must be an image");
    }
    return true;
  }),

  body("product_images").custom((value, { req }) => {
    if (
      !req.files ||
      !req.files.product_images ||
      !req.files.product_images.length > 0
    ) {
      throw new Error("Product images is required atleast one image");
    }
    if (!req.files.qr_code_url[0].mimetype.startsWith("image/")) {
      throw new Error("Product must be an image");
    }
    return true;
  }),
];
export const productUpdateValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be string"),
  body("category_id")
    .notEmpty()
    .withMessage("Category id is missing")
    .toInt()
    .isInt()
    .withMessage("Category ID must be number"),
  body("brand_id")
    .notEmpty()
    .withMessage("Brand id is missing")
    .toInt()
    .isInt()
    .withMessage("Brand ID must be number"),
  body("price")
    .notEmpty()
    .withMessage("Price is missing")
    .toFloat()
    .isFloat()
    .withMessage("Price must be float/decimal"),
  body("discount_percentage")
    .optional()
    .toFloat()
    .isFloat()
    .withMessage("Discount Percentage must be float/decimal"),
  body("rating")
    .optional()
    .toInt()
    .isInt()
    .withMessage("Rating must be number(integer)"),
  body("stock")
    .optional()
    .toInt()
    .isInt()
    .withMessage("Stock must be number(integer)"),
  body("sku").optional().isString().withMessage("SKU must be String"),
  body("weight")
    .optional()
    .toFloat()
    .isFloat()
    .withMessage("Weight must be decimal"),
  body("height")
    .optional()
    .toInt()
    .isInt()
    .withMessage("Height must be number(integer)"),
  body("warranty_information")
    .optional()
    .isString()
    .withMessage("Warranty Information must be String"),
  body("shipping_information")
    .optional()
    .isString()
    .withMessage("Shipping Information must be String"),
  body("availability")
    .optional()
    .isIn(["IN_STOCK", "OUT_OF_STOCK", "PREORDER"])
    .withMessage("Invalid Availability"),
  body("return_policy")
    .optional()
    .isString()
    .withMessage("Return Policy must be String"),
  //   body('qr_code_url').optional().isString().withMessage('Qr Code Url must be String'),

  body("thumbnail").custom((value, { req }) => {
    if (!req.files || !req.files.thumbnail || !req.files.thumbnail[0]) {
      throw new Error("Thumbnail image is required");
    }
    if (!req.files.thumbnail[0].mimetype.startsWith("image/")) {
      throw new Error("Thumbnail must be an image");
    }
    return true;
  }),

  body("barcode_url").custom((value, { req }) => {
    if (!req.files || !req.files.barcode_url || !req.files.barcode_url[0]) {
      throw new Error("Barcode Image is required");
    }
    if (!req.files.barcode_url[0].mimetype.startsWith("image/")) {
      throw new Error("Barcode must be an image");
    }
    return true;
  }),

  body("qr_code_url").custom((value, { req }) => {
    if (!req.files || !req.files.qr_code_url || !req.files.qr_code_url[0]) {
      throw new Error("QR code image is required");
    }
    if (!req.files.qr_code_url[0].mimetype.startsWith("image/")) {
      throw new Error("QR CODE must be an image");
    }
    return true;
  }),

  body("product_images").custom((value, { req }) => {
    if (
      !req.files ||
      !req.files.product_images ||
      !req.files.product_images.length > 0
    ) {
      throw new Error("Product images is required atleast one image");
    }
    if (!req.files.qr_code_url[0].mimetype.startsWith("image/")) {
      throw new Error("Product must be an image");
    }
    return true;
  }),
];

