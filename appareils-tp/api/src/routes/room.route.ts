import { Router } from "express";
import { Room } from "../models/room.model.js";
import { Appareil } from "../models/appareil.model.js";
import { validate } from "../middlewares/validate.js";
import { idParam } from "../schemas/appareil.js";
import { roomBody } from "../schemas/room.js";

export const roomRouter = Router();

// READ all
roomRouter.get("/", async (_req, res) => {
  const rooms = await Room.find().sort({ name: 1 });
  res.status(200).json(rooms);
});

// CREATE
roomRouter.post("/", validate(roomBody), async (_req, res) => {
  const room = await Room.create(res.locals.body);
  res.status(201).json(room);
});

// DELETE (appliances of this room are kept, their room becomes null)
roomRouter.delete("/:id", validate(idParam, "params"), async (_req, res) => {
  const result = await Room.deleteOne({ _id: res.locals.params.id });
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  await Appareil.updateMany({ room: res.locals.params.id }, { room: null });
  res.status(204).end();
});
