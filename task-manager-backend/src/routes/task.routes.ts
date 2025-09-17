// src/routes/task.routes.ts
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller";

const router = Router();

router.use(authenticateToken);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
