import { Router } from "express";
import {
  createWishlistController,
  destroyWishlistController,
  getWishListController,
} from "../controllers/wishlist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { wishlistValidation } from "../middlewares/request/validate.wishlist.request.js";
import { handleValidationError } from "../middlewares/handleValidationError.middleware.js";

const wishlistRouter = Router();
wishlistRouter.post(
  "/",
  protect,
  wishlistValidation,
  handleValidationError,
  createWishlistController,
);
wishlistRouter.get("/", protect, getWishListController);
wishlistRouter.delete(
  "/",
  protect,
  wishlistValidation,
  handleValidationError,
  destroyWishlistController,
);
export default wishlistRouter;
