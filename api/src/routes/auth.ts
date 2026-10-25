import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { loginBody, registerBody } from "../schemas/auth.js";
import * as service from "../services/authService.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerBody), async (_req, res) => {
  res.status(201).json(await service.register(res.locals.body));
});

authRouter.post("/login", validate(loginBody), async (_req, res) => {
  res.json(await service.login(res.locals.body));
});
