import jwt from "jsonwebtoken";
import authConfig from "../config/auth";
import { promisify } from "util";
import { AUTH_MESSAGES } from "../constants/messages";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: AUTH_MESSAGES.TOKEN_NOT_FOUND });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: AUTH_MESSAGES.TOKEN_INVALID });
  }
};
