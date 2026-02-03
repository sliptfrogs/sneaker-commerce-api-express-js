import { User } from "../models/user.model.js";
import { UserProfile } from "../models/user.profile.model.js";
import {
  authLoginService,
  authRegisterService,
} from "../services/auth.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/ApiResponse.util.js";
import {
  generateAccessToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

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
    sendSuccessResponse(res, user, "Logged", []);
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500, error);
  }
};
export const refreshTokenController = async (req, res) => {
  try {
    // const accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }

    const tokens = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });
    const user = await User.findByPk(decoded.id,{
      include: [
        {
          model: UserProfile,
          as: 'profile',
          attributes: ['first_name', 'last_name']
        }
      ]
    })
    sendSuccessResponse(res, {user, tokens}, "Token refreshed", []);
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500, error);
  }
};
