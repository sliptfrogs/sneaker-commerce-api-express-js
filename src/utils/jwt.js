import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ApiError } from "./ApiError.util.js";
config();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      balance: user.balance,
    },
    ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRED_IN,
    },
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRED_IN,
    },
  );
  return { accessToken, refreshToken };
};
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
