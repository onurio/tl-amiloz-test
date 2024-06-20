import { createLoan } from "@/controllers/loanController";
import { createUserOffers } from "@/controllers/offerController";
import { createUser } from "@/controllers/userController";
import { verifyToken } from "@/middlewares/authMiddleware";
import { checkOfferOwnership } from "@/middlewares/ownershipMiddleware";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
router.post("/", createUser);

/**
 * @swagger
 * /usuarios/{userId}/ofertas:
 *   post:
 *     summary: Create loan offers for a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offers:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Offer'
 *     responses:
 *       201:
 *         description: Offers created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Offer'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.post("/:userId/ofertas", verifyToken, createUserOffers);

/**
 * @swagger
 * /usuarios/{userId}/prestamos:
 *   post:
 *     summary: Create a loan based on a selected offer
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - offerId
 *             properties:
 *               offerId:
 *                 type: integer
 *                 description: ID of the selected offer
 *     responses:
 *       201:
 *         description: Loan created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User or Offer not found
 */
router.post("/:userId/prestamos", verifyToken, checkOfferOwnership, createLoan);

export default router;
