import { AddCart, ClearAllCartsByUserIdService, ClearCartByIdService, GetCartItems } from "../services/cart.service.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/ApiResponse.util.js";


export const getCartItems = async(req, res)=>{
    try {
        const cartItems = await GetCartItems(req.user.id);
        sendSuccessResponse(res, cartItems, "Cart items fetched successfully");
    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode || 500);
    }
}
export const addItemToCart = async(req,res)=>{
    try {
        await AddCart(req.user.id, req.body)
         sendSuccessResponse(res, {}, "Item added to cart successfully");
    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode || 500);
    }
}
export const removeItemFromCartById= async(req,res)=>{
    try {
        await ClearCartByIdService(req.params.id, req.user.id);
        sendSuccessResponse(res, {}, `Cart ${req.params.id} removed`);

    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode || 500);
    }
}
export const removeAllItemsFromCartController = async(req,res)=>{
    try {
        await ClearAllCartsByUserIdService(req.user.id);
        sendSuccessResponse(res, {}, "All cart items cleared successfully");
    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode || 500);
    }
}
