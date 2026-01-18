import {
  authLoginService,
  authRegisterService,
} from "../services/auth.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/ApiResponse.util.js";

export const authRegisterController = async (req, res) => {
  try {
    await authRegisterService(req.body);
    sendSuccessResponse(res, [], "User created", []);
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500);
  }
};
export const authLoginController = async (req, res) => {
  try {
    const user = await authLoginService(req.body);
    sendSuccessResponse(res, user, 'Logged', [])
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500, error);
  }
};
