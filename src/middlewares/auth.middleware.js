import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token provided" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or Exired token" });
  }
  // console.log('user-decode-tokens', decoded);

  req.user = decoded;

  next();
};
export const protectRefreshToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token provided" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyRefreshToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or Exired refresh token" });
  }
  // console.log('user-decode-tokens', decoded);
  req.refreshToken = token;
  next();
};
