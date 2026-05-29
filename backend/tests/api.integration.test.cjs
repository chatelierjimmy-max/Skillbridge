process.env.NODE_ENV = "test";

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { app } = require("../dist/app");
const { prisma } = require("../dist/config/prisma");
const { connectMongoDB } = require("../dist/config/mongodb");
const { env } = require("../dist/config/env");

const api = request(app);
const password = "Password123";
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const users = {};
const tokens = {};
let reactSkill;
let groupId;
let sessionId;
let messageId;

const auth = (token) => ({ Authorization: `Bearer ${token}` });

async function ensureReactSkill() {
  return prisma.skill.upsert({
    where: { name: "React" },
    update: { category: "Front-end" },
    create: { name: "React", category: "Front-end" },
  });
}

async function registerUser(key, data = {}) {
  const body = {
    firstname: data.firstname ?? key,
    lastname: data.lastname ?? "Tester",
    email: `skillbridge.${runId}.${key}@test.local`,
    password,
  };

  const response = await api
    .post("/api/auth/register")
    .send(body)
    .expect(201);

  expect(response.body).toEqual({
    message: "Compte créé avec succès",
  });

  return body;
}

async function loginUser(key, email) {
  const response = await api
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200);

  expect(response.body.accessToken).toEqual(expect.any(String));
  users[key] = response.body.user;
  tokens[key] = response.body.accessToken;

  return response.body;
}

async function cleanup() {
  const userIds = Object.values(users)
    .map((user) => user?.id)
    .filter(Boolean);

  if (mongoose.connection.readyState === 1 && userIds.length > 0) {
    const db = mongoose.connection.db;

    await Promise.all([
      db.collection("messages").deleteMany({
        $or: [{ userId: { $in: userIds } }, { groupId }],
      }),
      db.collection("notifications").deleteMany({
        userId: { $in: userIds },
      }),
      db.collection("activitylogs").deleteMany({
        userId: { $in: userIds },
      }),
      db.collection("securitylogs").deleteMany({
        userId: { $in: userIds },
      }),
    ]);
  }

  if (userIds.length > 0) {
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }
}

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectMongoDB();
  }

  reactSkill = await ensureReactSkill();

  const admin = await registerUser("admin", {
    firstname: "Admin",
    lastname: "Integration",
  });
  const owner = await registerUser("owner", {
    firstname: "Owner",
    lastname: "Integration",
  });
  const learner = await registerUser("learner", {
    firstname: "Sarah",
    lastname: "Durand",
  });
  const member = await registerUser("member", {
    firstname: "Member",
    lastname: "Integration",
  });

  await loginUser("admin", admin.email);
  await prisma.user.update({
    where: { id: users.admin.id },
    data: { role: "ADMIN" },
  });
  await loginUser("admin", admin.email);

  await loginUser("owner", owner.email);
  await loginUser("learner", learner.email);
  await loginUser("member", member.email);
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

describe("SkillBridge backend API", () => {
  test("GET /api/health confirme que l'API tourne", async () => {
    const response = await api.get("/api/health").expect(200);

    expect(response.body).toEqual({
      status: "ok",
      message: "SkillBridge API is running",
    });
  });

  test("auth: login admin et /api/auth/me retournent l'utilisateur connecte", async () => {
    const response = await api
      .get("/api/auth/me")
      .set(auth(tokens.admin))
      .expect(200);

    expect(response.body).toMatchObject({
      id: users.admin.id,
      email: users.admin.email,
      role: "ADMIN",
      status: "ACTIVE",
    });
  });

  test("profil, competences et recherche retournent un apprenant React a Paris", async () => {
    await api
      .put("/api/users/me/profile")
      .set(auth(tokens.learner))
      .send({
        bio: "Je débute React et Node.js",
        level: "BEGINNER",
        availability: "Soirs",
        location: "Paris",
      })
      .expect(200);

    await api
      .post("/api/users/me/skills")
      .set(auth(tokens.learner))
      .send({
        skillId: reactSkill.id,
        level: "BEGINNER",
      })
      .expect(201);

    const skillsResponse = await api
      .get("/api/users/me/skills")
      .set(auth(tokens.learner))
      .expect(200);

    expect(skillsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: reactSkill.id,
          name: "React",
          category: "Front-end",
          level: "BEGINNER",
        }),
      ]),
    );

    const searchResponse = await api
      .get("/api/users/search")
      .query({
        skill: "React",
        level: "BEGINNER",
        city: "Paris",
        page: 1,
        limit: 10,
      })
      .set(auth(tokens.owner))
      .expect(200);

    expect(searchResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: users.learner.id,
          firstname: "Sarah",
          lastname: "Durand",
          profile: expect.objectContaining({
            level: "BEGINNER",
            location: "Paris",
          }),
          skills: expect.arrayContaining([
            expect.objectContaining({
              id: reactSkill.id,
              name: "React",
              level: "BEGINNER",
            }),
          ]),
        }),
      ]),
    );
  });

  test("groupes, sessions, messages et notifications suivent le parcours principal", async () => {
    const groupResponse = await api
      .post("/api/groups")
      .set(auth(tokens.owner))
      .send({
        name: `React débutants ${runId}`,
        description: "Groupe d'entraide pour progresser sur React.",
        level: "BEGINNER",
        skillId: reactSkill.id,
      })
      .expect(201);

    expect(groupResponse.body.message).toBe("Groupe créé");
    groupId = groupResponse.body.groupId;
    expect(groupId).toEqual(expect.any(Number));

    await api
      .post(`/api/groups/${groupId}/join`)
      .set(auth(tokens.member))
      .expect(200);

    const memberNotificationsAfterJoin = await api
      .get("/api/notifications")
      .set(auth(tokens.member))
      .expect(200);

    expect(memberNotificationsAfterJoin.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "GROUP_JOINED",
          isRead: false,
        }),
      ]),
    );

    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionResponse = await api
      .post(`/api/groups/${groupId}/sessions`)
      .set(auth(tokens.owner))
      .send({
        title: "Introduction aux hooks React",
        description: "Découverte de useState et useEffect",
        startDate: startDate.toISOString(),
        duration: 90,
        maxParticipants: 8,
      })
      .expect(201);

    expect(sessionResponse.body.message).toBe("Session créée");
    sessionId = sessionResponse.body.sessionId;

    const sessionsResponse = await api
      .get(`/api/groups/${groupId}/sessions`)
      .set(auth(tokens.member))
      .expect(200);

    expect(sessionsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: sessionId,
          title: "Introduction aux hooks React",
        }),
      ]),
    );

    const notificationsAfterSession = await api
      .get("/api/notifications")
      .set(auth(tokens.member))
      .expect(200);

    expect(notificationsAfterSession.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "SESSION_CREATED",
          title: "Nouvelle session",
          isRead: false,
        }),
      ]),
    );

    const notificationId = notificationsAfterSession.body[0]._id;
    await api
      .patch(`/api/notifications/${notificationId}/read`)
      .set(auth(tokens.member))
      .expect(200);

    await api
      .post(`/api/sessions/${sessionId}/book`)
      .set(auth(tokens.member))
      .expect(200);

    const mySessionsResponse = await api
      .get("/api/users/me/sessions")
      .set(auth(tokens.member))
      .expect(200);

    expect(mySessionsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: sessionId,
          bookingStatus: "REGISTERED",
        }),
      ]),
    );

    await api
      .delete(`/api/sessions/${sessionId}/book`)
      .set(auth(tokens.member))
      .expect(200);

    const messageResponse = await api
      .post(`/api/groups/${groupId}/messages`)
      .set(auth(tokens.member))
      .send({
        content: "Salut, quelqu’un veut travailler React Router ce soir ?",
      })
      .expect(201);

    expect(messageResponse.body).toMatchObject({
      message: "Message envoyé",
      data: {
        groupId,
        userId: users.member.id,
        content: "Salut, quelqu’un veut travailler React Router ce soir ?",
      },
    });

    messageId = messageResponse.body.data.id;

    const messagesResponse = await api
      .get(`/api/groups/${groupId}/messages`)
      .set(auth(tokens.member))
      .expect(200);

    expect(messagesResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.anything(),
          groupId,
          userId: users.member.id,
          content: "Salut, quelqu’un veut travailler React Router ce soir ?",
        }),
      ]),
    );

    await api
      .delete(`/api/messages/${messageId}`)
      .set(auth(tokens.member))
      .expect(200);
  });

  test("admin: liste, desactive, reactive et consulte les logs", async () => {
    const usersResponse = await api
      .get("/api/admin/users")
      .set(auth(tokens.admin))
      .expect(200);

    expect(usersResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: users.admin.id,
          role: "ADMIN",
        }),
        expect.objectContaining({
          id: users.learner.id,
          role: "USER",
          status: "ACTIVE",
        }),
      ]),
    );

    const disableResponse = await api
      .patch(`/api/admin/users/${users.learner.id}/disable`)
      .set(auth(tokens.admin))
      .expect(200);

    expect(disableResponse.body).toMatchObject({
      message: "Utilisateur désactivé",
      user: {
        id: users.learner.id,
        role: "USER",
        status: "DISABLED",
      },
    });

    const enableResponse = await api
      .patch(`/api/admin/users/${users.learner.id}/enable`)
      .set(auth(tokens.admin))
      .expect(200);

    expect(enableResponse.body).toMatchObject({
      message: "Utilisateur réactivé",
      user: {
        id: users.learner.id,
        role: "USER",
        status: "ACTIVE",
      },
    });

    const activityLogsResponse = await api
      .get("/api/admin/logs/activity")
      .set(auth(tokens.admin))
      .expect(200);

    expect(activityLogsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: "DISABLE_USER" }),
        expect.objectContaining({ action: "ENABLE_USER" }),
        expect.objectContaining({ action: "SEND_MESSAGE" }),
      ]),
    );

    const securityLogsResponse = await api
      .get("/api/admin/logs/security")
      .set(auth(tokens.admin))
      .expect(200);

    expect(securityLogsResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ event: "ACCOUNT_DISABLED" }),
        expect.objectContaining({ event: "LOGIN_SUCCESS" }),
      ]),
    );
  });

  test("admin: un vieux token qui pretend etre ADMIN est refuse si la base dit USER", async () => {
    const fakeOldAdminToken = jwt.sign(
      { userId: users.owner.id, role: "ADMIN" },
      env.jwtSecret,
      { expiresIn: "1h" },
    );

    await api
      .get("/api/admin/users")
      .set(auth(fakeOldAdminToken))
      .expect(403);
  });
});
