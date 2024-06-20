import { Router } from "express";
import { revertPayment } from "@controllers/paymentController";
import { verifyToken } from "@middlewares/authMiddleware";
import { checkPaymentOwnership } from "@/middlewares/ownershipMiddleware";

const router = Router();

/**
 * @swagger
 * /pagos/{paymentId}/revertir:
 *   post:
 *     summary: Revert a payment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the payment
 *     responses:
 *       200:
 *         description: Payment reverted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loan:
 *                   $ref: '#/components/schemas/Loan'
 *       404:
 *         description: Payment or loan not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:paymentId/revertir",
  verifyToken,
  checkPaymentOwnership,
  revertPayment
);

export default router;
