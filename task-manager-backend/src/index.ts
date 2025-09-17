// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

export default app;
