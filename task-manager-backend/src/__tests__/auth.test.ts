// src/__tests__/auth.test.ts
import supertest from "supertest";
import app from "../index";
import { PrismaClient } from "@prisma/client";
import { describe, it, expect, afterEach, afterAll } from "@jest/globals";

const prisma = new PrismaClient();
const request = supertest(app);

describe("Auth Endpoints", () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        username: "testuser1",
        password: "password123",
      };

      const response = await request.post("/api/auth/register").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User created successfully"
      );
      expect(response.body).toHaveProperty("userId");
    });

    it("should return a 409 conflict error if the username already exists", async () => {
      await prisma.user.create({
        data: {
          username: "existinguser",
          password: "password123",
        },
      });

      const response = await request
        .post("/api/auth/register")
        .send({ username: "existinguser", password: "newpassword" });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("message", "Username already taken");
    });

    it("should return a 400 bad request error if password is missing", async () => {
      const response = await request
        .post("/api/auth/register")
        .send({ username: "newuser" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Username and password are required"
      );
    });
  });
});
