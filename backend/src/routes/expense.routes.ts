import { Router } from "express";

import {
  createExpenseController,
  getExpensesController,
  getExpenseController,
  updateExpenseController,
  deleteExpenseController,
} from "../controllers/expense.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createExpenseController);

router.get("/", getExpensesController);

router.get("/:id", getExpenseController);

router.put("/:id", updateExpenseController);

router.delete("/:id", deleteExpenseController);

export default router;
