// src/utils/validationSchemas.ts
import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().optional(),
  status: z.enum(["Pending", "Completed"]),
});

export type TaskSchema = z.infer<typeof taskSchema>;
