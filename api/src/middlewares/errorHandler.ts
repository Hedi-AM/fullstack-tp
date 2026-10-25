import type { ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Prisma: record to update/delete does not exist
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    res.status(404).json({ error: "Not found" });
    return;
  }
  // malformed JSON body
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
