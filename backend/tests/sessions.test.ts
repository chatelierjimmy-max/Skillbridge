import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/config/prisma";
import { createAndLoginUser } from "./helpers/auth.helper";

describe("Sessions API", () => {
  it("should create a session", async () => {
    const { token } = await createAndLoginUser();

    const skill = await prisma.skill.upsert({
      where: { name: "Node Test" },
      update: {},
      create: {
        name: "Node Test",
        category: "Back-end",
      },
    });

    const groupResponse = await request(app)
      .post("/api/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Node Test Group",
        description: "Session test group",
        level: "BEGINNER",
        skillId: skill.id,
      });

    const groupId = groupResponse.body.groupId;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const response = await request(app)
      .post(`/api/groups/${groupId}/sessions`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Node session",
        description: "Test session",
        startDate: futureDate.toISOString(),
        duration: 90,
        maxParticipants: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body.sessionId).toBeDefined();
  });
});
