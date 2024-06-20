import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@models/user";

const authSecret = process.env.AUTH_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION || "24h";

if (!authSecret) {
  throw new Error("AUTH_SECRET is not defined");
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user.id }, authSecret, {
    expiresIn: tokenExpiration,
  });
  return { user, token };
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
