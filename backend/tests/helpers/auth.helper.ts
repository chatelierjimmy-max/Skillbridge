import request from "supertest";
import { app } from "../../src/app";

export const createAndLoginUser = async () => {
  const email = `user${Date.now()}${Math.random()}@mail.com`;

  await request(app).post("/api/auth/register").send({
    firstname: "Test",
    lastname: "User",
    email,
    password: "Password123",
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password: "Password123",
  });

  return {
    token: loginResponse.body.accessToken,
    user: loginResponse.body.user,
  };
};
