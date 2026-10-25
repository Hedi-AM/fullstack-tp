import { z } from "zod";

export const registerBody = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginBody = registerBody;
