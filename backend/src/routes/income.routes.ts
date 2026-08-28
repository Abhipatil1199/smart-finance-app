import { Router } from "express";

import {
  createIncomeController,
  getIncomesController,
  getIncomeController,
  updateIncomeController,
  deleteIncomeController,
} from "../controllers/income.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createIncomeController);

router.get("/", getIncomesController);

router.get("/:id", getIncomeController);

router.put("/:id", updateIncomeController);

router.delete("/:id", deleteIncomeController);

export default router;
