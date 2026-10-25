import { Router } from "express";
import { Appareil } from "../models/appareil.model.js";
import { validate } from "../middlewares/validate.js";
import { appareilBody, idParam, switchAllBody } from "../schemas/appareil.js";

export const appareilRouter = Router();

// READ all
appareilRouter.get("/", async (_req, res) => {
  const list = await Appareil.find();
  res.status(200).json(list);
});

// EXERCISE: switch all appliances On or Off
appareilRouter.patch("/switch-all", validate(switchAllBody), async (_req, res) => {
  const result = await Appareil.updateMany({}, { status: res.locals.body.status });
  res.status(200).json({ modified: result.modifiedCount });
});

// READ one
appareilRouter.get("/:id", validate(idParam, "params"), async (_req, res) => {
  const appareil = await Appareil.findById(res.locals.params.id);
  if (appareil === null) {
    res.status(404).json({ error: "Appareil not found" });
    return;
  }
  res.status(200).json(appareil);
});

// CREATE
appareilRouter.post("/", validate(appareilBody), async (_req, res) => {
  const appareil = await Appareil.create(res.locals.body);
  res.status(201).json(appareil);
});

// UPDATE
appareilRouter.put(
  "/:id",
  validate(idParam, "params"),
  validate(appareilBody),
  async (_req, res) => {
    const appareil = await Appareil.findByIdAndUpdate(res.locals.params.id, res.locals.body, {
      returnDocument: "after",
      runValidators: true,
    });
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
