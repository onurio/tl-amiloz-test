import Offer from "@models/offer";
import User from "@models/user";
import { AggregateError } from "sequelize";

export const createOffers = async (
  userId: number,
  offers: { amount: number; term: number; interestRate: number }[]
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (offers.length < 2) {
    throw new Error("At least 2 offers are required");
  }

  try {
    const createdOffers = await Offer.bulkCreate(
      offers.map((offer) => ({
        ...offer,
        userId,
      })),
      { validate: true }
    );
    return createdOffers;
  } catch (error: AggregateError | any) {
    if (error instanceof AggregateError) {
      throw new Error(error.errors.map((error) => error.message).join(", "));
    }
    throw new Error(`Unable to create offers: ${error.message}`);
  }
};
