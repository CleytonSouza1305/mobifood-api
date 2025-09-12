import { Handler } from "express";
import { HttpError } from "../error/HttpError";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
      isAutorizated?: boolean;
    }
  }
}

export const authMiddleware: Handler = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpError(401, "Authorization header missing");
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      throw new HttpError(401, "No token informed");
    }

    const key = process.env.JWT_SECRET;
    if (!key) {
      throw new HttpError(500, "Secret key not found");
    }

    const decoded = jwt.verify(token, key);

    if (typeof decoded !== "object" || !("id" in decoded)) {
      throw new HttpError(401, "Invalid token");
    }

    const encryptedUser = decoded as JwtPayload & { id: number };

    const user = await User.findById(encryptedUser.id);
    if (!user) {
      throw new HttpError(404, "User not found on db.");
    }

    req.isAutorizated = true;
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
