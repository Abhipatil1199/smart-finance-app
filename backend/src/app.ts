import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok",  message: "Smart Finance API is running", });
});

app.use('/api/auth', authRoutes);

export default app;
