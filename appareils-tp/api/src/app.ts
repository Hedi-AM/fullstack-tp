import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import fs from "node:fs";
import { appareilRouter } from "./routes/appareil.route.js";
import { roomRouter } from "./routes/room.route.js";

export const app = express();

const origins = (process.env.CORS_ORIGINS ?? "http://localhost:4200")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: origins }));
app.use(express.json()); // without this, req.body is undefined on POST / PUT

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/appareils", appareilRouter);
app.use("/api/rooms", roomRouter);

// B.3 (optional): serve the built Angular site if it exists in api/public/browser
const publicDir = path.join(import.meta.dirname, "../public/browser");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

// central error handler (must stay last)
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
