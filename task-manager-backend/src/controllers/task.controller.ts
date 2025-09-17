// src/controllers/task.controller.ts
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// Controller to create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user?.userId;

    if (!title || !status) {
      return res.status(400).json({ message: "Title and status are required" });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId: userId!,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller to get all tasks for the logged-in user
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller to update an existing task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id || !req.user?.userId) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;
    const { title, description, status } = req.body;

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const result = await prisma.task.updateMany({
      where: {
        id: taskId,
        userId: userId,
      },
      data: {
        title,
        description,
        status,
      },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or user not authorized" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller to delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.params.id || !req.user?.userId) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user?.userId;

    const result = await prisma.task.deleteMany({
      where: {
        id: taskId,
        userId: userId,
      },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or user not authorized" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
