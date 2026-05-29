import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/config/prisma";
import { createAndLoginUser } from "./helpers/auth.helper";

describe("Groups API", () => {
  it("should create a group", async () => {
    const { token } = await createAndLoginUser();

    const skill = await prisma.skill.upsert({
      where: { name: "React Test" },
      update: {},
      create: {
        name: "React Test",
        category: "Front-end",
      },
    });

    const response = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "React Test Group",
        description: "Test group",
        level: "BEGINNER",
        skillId: skill.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.groupId).toBeDefined();
  });

  it("should list groups", async () => {
    const { token } = await createAndLoginUser();

    const response = await request(app)
      .get("/api/groups")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
