// src/__tests__/task.test.ts
import supertest from "supertest";
import app from "../index";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  describe,
  it,
  expect,
  afterEach,
  afterAll,
  beforeAll,
} from "@jest/globals";

const prisma = new PrismaClient();
const request = supertest(app);

describe("Task Endpoints", () => {
  let user1: any;
  let user2: any;
  let token: string;

  beforeAll(async () => {
    user1 = await prisma.user.create({
      data: { username: "user1", password: "password1" },
    });
    user2 = await prisma.user.create({
      data: { username: "user2", password: "password2" },
    });
    token = jwt.sign({ userId: user1.id }, process.env.JWT_SECRET as string);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.task.deleteMany();
  });

  describe("Authorization", () => {
    it("should return 401 Unauthorized if no token is provided", async () => {
      const response = await request.get("/api/tasks");
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task for the authenticated user", async () => {
      const newTask = { title: "Test Task", status: "pending" };
      const response = await request
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("title", "Test Task");
      expect(response.body).toHaveProperty("userId", user1.id);
    });
  });

  describe("GET /api/tasks", () => {
    it("should get all tasks for the authenticated user but not for others", async () => {
      await prisma.task.create({
        data: { title: "User 1 Task", status: "pending", userId: user1.id },
      });
      await prisma.task.create({
        data: { title: "User 2 Task", status: "pending", userId: user2.id },
      });

      const response = await request
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe("User 1 Task");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task owned by the user", async () => {
      const task = await prisma.task.create({
        data: { title: "To Delete", status: "pending", userId: user1.id },
      });

      const response = await request
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it("should return 404 when trying to delete a task owned by another user", async () => {
      const task = await prisma.task.create({
        data: { title: "Other user task", status: "pending", userId: user2.id },
      });

      const response = await request
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
