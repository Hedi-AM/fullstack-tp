import { Router } from "express";
import { Appareil } from "../models/appareil.model.js";
import { Room } from "../models/room.model.js";
import { validate } from "../middlewares/validate.js";
import { appareilBody, idParam, listQuery, switchAllBody } from "../schemas/appareil.js";

export const appareilRouter = Router();

async function roomIsValid(room: string | null | undefined): Promise<boolean> {
  if (room === undefined || room === null) {
    return true;
  }
  const found = await Room.exists({ _id: room });
  return found !== null;
}

// READ all, optional filter: GET /api/appareils?status=On
appareilRouter.get("/", validate(listQuery, "query"), async (_req, res) => {
  const filter: { status?: "On" | "Off" } = {};
  if (res.locals.query.status !== undefined) {
    filter.status = res.locals.query.status;
  }
  const list = await Appareil.find(filter).populate("room");
  res.status(200).json(list);
});

// switch all appliances On or Off (must stay before "/:id")
appareilRouter.patch("/switch-all", validate(switchAllBody), async (_req, res) => {
  const result = await Appareil.updateMany({}, { status: res.locals.body.status });
  res.status(200).json({ modified: result.modifiedCount });
});

// READ one
appareilRouter.get("/:id", validate(idParam, "params"), async (_req, res) => {
  const appareil = await Appareil.findById(res.locals.params.id).populate("room");
  if (appareil === null) {
    res.status(404).json({ error: "Appareil not found" });
    return;
  }
  res.status(200).json(appareil);
});

// CREATE
appareilRouter.post("/", validate(appareilBody), async (_req, res) => {
  if (!(await roomIsValid(res.locals.body.room))) {
    res.status(400).json({ error: "Room not found" });
    return;
  }
  const appareil = await Appareil.create(res.locals.body);
  await appareil.populate("room");
  res.status(201).json(appareil);
});

// UPDATE
appareilRouter.put(
  "/:id",
  validate(idParam, "params"),
  validate(appareilBody),
  async (_req, res) => {
    if (!(await roomIsValid(res.locals.body.room))) {
      res.status(400).json({ error: "Room not found" });
      return;
    }
    const appareil = await Appareil.findByIdAndUpdate(res.locals.params.id, res.locals.body, {
      returnDocument: "after",
      runValidators: true,
    }).populate("room");
    if (appareil === null) {
      res.status(404).json({ error: "Appareil not found" });
      return;
    }
    res.status(200).json(appareil);
  }
);

// DELETE
appareilRouter.delete("/:id", validate(idParam, "params"), async (_req, res) => {
  const result = await Appareil.deleteOne({ _id: res.locals.params.id });
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Appareil not found" });
    return;
  }
  res.status(204).end();
});
