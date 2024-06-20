import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error("AUTH_SECRET is not defined");
}

interface RequestWithUserId extends Request {
  userId?: string;
}

export const verifyToken = (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], authSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    next();
  });
};
