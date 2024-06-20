import User from "@/models/user";

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    return await User.create({ firstName, lastName, email, password });
  } catch (error: any) {
    throw new Error(`Unable to create user: ${error.message}`);
  }
};
