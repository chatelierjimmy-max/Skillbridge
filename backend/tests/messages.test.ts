import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/config/prisma";
import { createAndLoginUser } from "./helpers/auth.helper";

describe("Messages API", () => {
  it("should create and list messages", async () => {
    const { token } = await createAndLoginUser();

    const skill = await prisma.skill.upsert({
      where: { name: "Mongo Test" },
      update: {},
      create: {
        name: "Mongo Test",
        category: "Database",
      },
    });

    const groupResponse = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Mongo Test Group",
        description: "Message test group",
        level: "BEGINNER",
        skillId: skill.id,
      });

    const groupId = groupResponse.body.groupId;

    const createMessageResponse = await request(app)
      .post(`/api/groups/${groupId}/messages`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Hello MongoDB",
      });

    expect(createMessageResponse.status).toBe(201);

    const listResponse = await request(app)
      .get(`/api/groups/${groupId}/messages`)
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.length).toBeGreaterThan(0);
  });
});
