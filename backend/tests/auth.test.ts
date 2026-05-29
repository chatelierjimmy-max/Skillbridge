import request from "supertest";
import { app } from "../src/app";

describe("Auth API", () => {
  const email = `test${Date.now()}@mail.com`;

  it("should register a user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstname: "Test",
      lastname: "User",
      email,
      password: "Password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Compte créé avec succès");
  });

  it("should login a user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "Password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.email).toBe(email);
  });

  it("should reject invalid login", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });
});
