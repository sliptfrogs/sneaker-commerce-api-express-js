import {
  CreateCheckoutService,
  GetUserOrderService,
  PayUserOrderService,
} from '../services/order.service.js';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../utils/ApiResponse.util.js';

export const createCheckoutController = async (req, res) => {
  try {
    await CreateCheckoutService(req);
    sendSuccessResponse(res, 'Product Checkouted');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};
export const getAllCheckoutsController = async (req, res) => {
  try {
    const checkouts = await GetUserOrderService(req.user.id);
    sendSuccessResponse(res, checkouts, 'All User checkouts');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};

export const payUserOrderController = async (req, res) => {
  try {
    const order = await PayUserOrderService(
      req.user.id,
      req.body.orderId,
      req.body.card_number,
    );
    sendSuccessResponse(res, order, 'Done');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};
