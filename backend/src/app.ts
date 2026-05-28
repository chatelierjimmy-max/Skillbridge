import cors = require("cors");
import express = require("express");

const helmet = require("helmet") as typeof import("helmet").default;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "SkillBridge API" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export = app;
