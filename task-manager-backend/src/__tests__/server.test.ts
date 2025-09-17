// src/__tests__/server.test.ts
import supertest from "supertest";
import app from "../index";
import { describe, it, expect } from "@jest/globals";

describe("Server", () => {
  it("should respond with a 200 status code for the root route", async () => {
    const response = await supertest(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Server is running!");
  });
});
