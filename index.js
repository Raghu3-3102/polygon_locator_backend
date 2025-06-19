import express from "express";
import "dotenv/config";
import connectDB from "./config/DBConfig.js";
import router from "./routes/index.js";
import compression from 'compression';
import cors from "cors";
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize";
import helmet from'helmet';
import { apiLimiter } from "./config/rateLimiter.js";
const app = express();
const PORT = process.env.PORT;

//Turn off Express's x-powered-by header
app.disable("x-powered-by");

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

//Enable xss-clean
app.use(xss());

//Sanitize inputs mongo-sanitize
app.use(mongoSanitize());

// Enable compression
app.use(compression());

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
