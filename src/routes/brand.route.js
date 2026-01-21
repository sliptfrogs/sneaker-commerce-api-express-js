import { Router } from "express";
import {
  getAllBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { BrandRequestValidation } from "../middlewares/request/brand.validation.request.js";
import { handleValidationError } from "../middlewares/handleValidationError.middleware.js";

const brandRouter = Router();

// Get All Brands
brandRouter.get("/",protect,authorizeRoles("ADMIN"), getAllBrands);

// Get One
brandRouter.get("/:id",protect,authorizeRoles("ADMIN"), getBrandById);

// CREATE
brandRouter.post("/",protect,authorizeRoles("ADMIN"),BrandRequestValidation,handleValidationError, createBrand);

// UPDATE
brandRouter.put("/:id",protect,authorizeRoles("ADMIN"),BrandRequestValidation,handleValidationError, updateBrand);

// DELETE
brandRouter.delete("/:id",protect,authorizeRoles("ADMIN"), deleteBrand);

export default brandRouter;
