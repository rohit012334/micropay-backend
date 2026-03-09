import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./src/config/env.js";
import { prisma } from "./src/config/prismaClient.js";
import authRoutes from "./src/routes/auth.routes.js";
import kycRoutes from "./src/routes/kyc.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import businessProfileRoutes from "./src/routes/businessProfile.routes.js";
import beneficiaryRoutes from "./src/routes/beneficiary.routes.js";
import cardRoutes from "./src/routes/card.routes.js";
import walletRoutes from "./src/routes/wallet.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { cleanupExpiredKeys, cleanupOldOtps, cleanupOldSessions } from "./src/jobs/cleanup.jobs.js";

const app = express();

app.use(helmet());

// ✅ CORS config
const allowedOrigins = [
  ...(env.clientUrl ? env.clientUrl.split(",").map((u) => u.trim()).filter(Boolean) : []),
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS blocked origin:", origin); // ← Railway logs mein dikhega
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/user", userRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/staff", staffRoutes);

app.use(errorHandler);

async function start() {
  try {
    await prisma.$connect();
    console.log("DB connected");
  } catch (e) {
    console.error("DB connection failed:", e.message);
    process.exit(1);
  }

  app.get("/", (req, res) => {
    res.status(200).json({ status: "Everything is fine Lets Go" });
  });

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
    console.log("Keep this terminal open. Press Ctrl+C to stop.");
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${env.port} is already in use. Stop the other process or use a different PORT.`);
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });

  // Background Jobs
  setInterval(cleanupExpiredKeys, 6 * 60 * 60 * 1000); // Every 6 hours
  setInterval(cleanupOldOtps, 12 * 60 * 60 * 1000); // Every 12 hours
  setInterval(cleanupOldSessions, 24 * 60 * 60 * 1000); // Every 24 hours

  // Initial cleanup on start
  cleanupExpiredKeys();
  cleanupOldOtps();
  cleanupOldSessions();

}

start().catch((err) => {
  console.error("Start failed:", err);
  process.exit(1);
});
