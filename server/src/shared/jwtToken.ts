import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { User } from "../domain/user.js";

export const verifyToken = (token: string): {userId: string} => {
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    return decoded as { userId: string };
  } catch (error) {
    throw new Error("Invalid token");
  }
};