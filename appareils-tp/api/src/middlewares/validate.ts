import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

type Source = "body" | "params" | "query";

export const validate =
  (schema: ZodType, source: Source = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (result.success === false) {
      res.status(400).json({ error: "Validation failed", details: result.error.issues });
      return;
    }
    res.locals[source] = result.data;
    next();
  };
