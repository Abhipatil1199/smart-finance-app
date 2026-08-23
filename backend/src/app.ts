import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Smart Finance API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
