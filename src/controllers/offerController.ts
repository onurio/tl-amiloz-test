import { Request, Response } from "express";
import { createOffers } from "@services/offerService";

export const createUserOffers = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const offers = req.body.offers;

    if (!Array.isArray(offers) || offers.length < 2) {
      return res.status(400).json({ error: "At least 2 offers are required" });
    }

    const createdOffers = await createOffers(userId, offers);
    res.status(201).json(createdOffers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
