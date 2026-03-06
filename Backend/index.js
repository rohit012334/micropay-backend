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
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // ✅ image URL access hogi

app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/user", userRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/cards", cardRoutes);

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

}

start().catch((err) => {
  console.error("Start failed:", err);
  process.exit(1);
});
