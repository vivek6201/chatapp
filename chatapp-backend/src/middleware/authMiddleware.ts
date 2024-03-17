import { Response, Request, NextFunction } from "express";
import { statusCodes } from "../utils/statusCodes";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ").at(-1);

  if (!token) {
    return res.status(statusCodes.UNAUTHORIZED).json({
      success: false,
      message: "auth token is required",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return;
  }

  const decode:any = jwt.verify(token, secret);

  req.headers.userId = decode.id;
  next()
};
