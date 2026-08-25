import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Smart Finance API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
