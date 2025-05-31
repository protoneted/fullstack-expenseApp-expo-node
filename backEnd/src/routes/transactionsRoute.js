import express from "express";
import { createTransactionRecord, deleteTransactionByUserId, getTransactionsByUserId, getTransactionSummaryByUserId } from "../controllers/transactinoController.js";

const router = express.Router();

router.get("/transactions/:userId", getTransactionsByUserId);

router.post("/transaction", createTransactionRecord);

router.delete("/transaction/:id", deleteTransactionByUserId);
router.get("/transactions/summary/:userId", getTransactionSummaryByUserId);
export default router;