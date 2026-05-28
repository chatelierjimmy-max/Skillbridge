import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.routes";
import { env } from "./config/env";
import { globalRateLimiter } from "./middlewares/rateLimit.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(globalRateLimiter);

app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
