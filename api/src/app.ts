import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { productsRouter } from "./routes/products.js";
import { categoriesRouter } from "./routes/categories.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

// allowed front-end origins (comma separated, configurable per environment)
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:4200,http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());                       // security headers
app.use(cors({ origin: allowedOrigins })); // allowed front-ends
app.use(morgan("dev"));                  // request log
app.use(express.json());                 // parse JSON bodies

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use(errorHandler); // must come last
