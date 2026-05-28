import { app } from "./app";
import { env } from "./config/env";
import { connectMongoDB } from "./config/mongodb";

const startServer = async (): Promise<void> => {
  await connectMongoDB();

  app.listen(Number(env.port), () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
