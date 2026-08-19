import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
  getClientTransactions,
  getTransactionById,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [
    body("clientName").trim().notEmpty().withMessage("Client name is required"),
    body("mobile").trim().notEmpty().withMessage("Mobile number is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("type")
      .isIn(["Credit", "Debit"])
      .withMessage("Transaction type is required"),
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be greater than zero"),
  ],
  addTransaction,
);
router.get("/", getAllTransactions);
router.get("/client/:clientId", getClientTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
