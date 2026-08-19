import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
];
const envOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const finalAllowedOrigins = [...new Set([...allowedOrigins, ...envOrigins])];
const isDevelopment = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: isDevelopment
      ? true
      : (origin, callback) => {
          if (!origin || finalAllowedOrigins.includes(origin)) {
            callback(null, true);
            return;
          }

          callback(new Error("Not allowed by CORS"));
        },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Sirhindi API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
