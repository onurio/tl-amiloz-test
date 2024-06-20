import { Router } from "express";
import { applyPayment } from "@controllers/paymentController";
import { verifyToken } from "@middlewares/authMiddleware";
import { checkLoanOwnership } from "@/middlewares/ownershipMiddleware";

const router = Router();

/**
 * @swagger
 * /prestamos/{loanId}/pagos:
 *   post:
 *     summary: Apply a payment to a loan
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the loan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount of the payment
 *     responses:
 *       201:
 *         description: Payment applied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loan:
 *                   $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Loan not found
 */
router.post("/:loanId/pagos", verifyToken, checkLoanOwnership, applyPayment);

export default router;
