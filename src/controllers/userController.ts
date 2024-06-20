import { Request, Response } from "express";
import * as userService from "@/services/userService";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await userService.createUser(
      firstName,
      lastName,
      email,
      password
    );
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
