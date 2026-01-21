import { Router } from "express";
import {
  createProductController,
  destroyProductController,
  getProductController,
  getProductsController,
  getProductsViaCategoryController,
  updateProductController,
} from "../controllers/product.controller.js";
import {
  productUpdateValidation,
  productValidation,
} from "../middlewares/request/product.validate.request.js";
import { handleValidationError } from "../middlewares/handleValidationError.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const productRoute = Router();

productRoute.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  uploadImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "barcode_url", maxCount: 1 },
    { name: "qr_code_url", maxCount: 1 },
    { name: "product_images", maxCount: 5 },
  ]),
  productValidation,
  handleValidationError,
  createProductController,
);

productRoute.get("/", getProductsController);
// productRoute.get('/category/:id',getProductsViaCategoryController)
productRoute.get("/:id", getProductController);
productRoute.patch(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  uploadImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "barcode_url", maxCount: 1 },
    { name: "qr_code_url", maxCount: 1 },
    { name: "product_images", maxCount: 5 },
  ]),
  productUpdateValidation,
  handleValidationError,
  updateProductController,
);
productRoute.delete("/:id", destroyProductController);

export default productRoute;
