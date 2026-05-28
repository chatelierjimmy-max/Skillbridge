import dotenv = require("dotenv");
import app = require("./app");
import connectMongoDB = require("./config/mongodb");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
