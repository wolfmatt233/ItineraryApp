import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "./api/routes.js";
import mongoose from "mongoose";

dotenv.config();

export const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Connect to MongoDB & Start Server
async function startServer() {
  try {
    // Connect to database with Mongoose
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[Database] MongoDB Connected with Mongoose");

    // Load routes
    app.use("/api", routes);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`[Server] Server listening on port ${PORT}`);
    });
  } catch (e) {
    console.error("[Database] Error connecting to MongoDB with Mongoose:", e);
  }
}

startServer();
