import User from "@/models/user";
import { hashPassword } from "./authService";

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const hashedPassword = await hashPassword(password);
    return await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  } catch (error: any) {
    throw new Error(`Unable to create user: ${error.message}`);
  }
};
