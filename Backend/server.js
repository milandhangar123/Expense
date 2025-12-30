import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration - supports both local and deployed frontend
const clientOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  // backend/public domain (if you test direct browser requests)
  "https://expense-eo6k.onrender.com",
];
const allowedOrigins = Array.from(new Set([...clientOrigins, ...defaultOrigins]));

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) only in development
    if (!origin) {
      if (process.env.NODE_ENV === "production") {
        return callback(new Error("Not allowed by CORS"));
      }
      return callback(null, true);
    }
    // Debug logging: show incoming origin and allowed list to help diagnose Render/Vercel issues
    try {
      console.log("CORS check - incoming origin:", origin);
      console.log("CORS allowed origins:", allowedOrigins);
      console.log("CORS CLIENT_ORIGIN env:", process.env.CLIENT_ORIGIN);
    } catch (logErr) {
      // ignore logging errors
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // return an informative error so Render logs show why requests are blocked
      const err = new Error(`Not allowed by CORS - origin ${origin} not in allowed origins`);
      console.error(err.message);
      callback(err);
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// simple health route
app.get("/", (req, res) => res.send("Personal Finance Tracker API"));

// required env checks
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not set. Set process.env.JWT_SECRET and restart.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not set. Set process.env.MONGO_URI and restart.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  });

// graceful handlers (optional)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
