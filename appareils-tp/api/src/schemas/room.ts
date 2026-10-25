import { z } from "zod";

export const roomBody = z.object({
  name: z.string().trim().min(2).max(40),
});
