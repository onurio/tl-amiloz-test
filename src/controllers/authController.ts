import { Request, Response } from "express";
import { authenticateUser } from "@services/authService";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authenticateUser(email, password);
    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
