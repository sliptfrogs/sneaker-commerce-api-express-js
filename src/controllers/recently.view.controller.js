import { createRecentlyViewedService, getRecentlyViewedService } from "../services/recently.view.service.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/ApiResponse.util.js"

export const createRecentlyViewedController = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id
        await createRecentlyViewedService( userId,productId);
        sendSuccessResponse(res, [], "Created");
    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode, error);
    }
}
export const getRecentlyViewedController = async (req, res) => {
  try {
      const userId = req.user.id
      const recentlyViewed = await getRecentlyViewedService( userId);
      sendSuccessResponse(res, recentlyViewed, "Success");
  } catch (error) {
      sendErrorResponse(res, error.message, error.statusCode, error);
  }
}
