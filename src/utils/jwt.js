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
      email: user.email,
      role: user.role,
    },
    ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRED_IN,
    },
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRED_IN,
    },
  );
  return { accessToken, refreshToken };
};
export const generateAccessToken = (user)=>{
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRED_IN,
    },
  );

  return { accessToken };

}
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};
export const verifyRefreshToken = (token)=>{
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
}
