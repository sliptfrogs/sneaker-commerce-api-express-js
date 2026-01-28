import { Router } from "express";
import { addItemToCart, getCartItems, removeAllItemsFromCartController, removeItemFromCartById } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { CartValidationRequest } from "../middlewares/request/cart.validation.request.js";
import { handleValidationError } from "../middlewares/handleValidationError.middleware.js";

const cartRouter = Router();

cartRouter.get("/",protect, getCartItems);
cartRouter.post('/add',protect,CartValidationRequest,handleValidationError, addItemToCart);
cartRouter.delete('/remove/:cartId',protect, removeItemFromCartById);
cartRouter.delete('/clear',protect, removeAllItemsFromCartController);
export default cartRouter;
