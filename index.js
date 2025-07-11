import express from "express";
import "dotenv/config";
// server.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env at app start

import connectDB from "./config/DBConfig.js";
import router from "./routes/index.js";
import cors from "cors";
import helmet from'helmet';
import { apiLimiter } from "./config/rateLimiter.js";
const app = express();
const PORT = process.env.PORT;




//trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json({ limit:'10mb' }));

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true, limit:'50mb' }));

// Rate limiting
app.use(`/api/v1`, apiLimiter);

// Welcome message
app.get(`/api/v1`, (req, res) => {
  res.status(200).json({ message: "Api is running Great" });
});

// API routes
app.use(`/api/v1`, router);

const StartServer = async () => {
  try {
    await connectDB();
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error starting server:", error.message);
  }
};

StartServer();
