import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1]!;
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT secret não configurado" });
  }
  try {
    const decoded: any = jwt.verify(token, jwtSecret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};
