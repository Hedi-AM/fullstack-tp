import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3001);
const uri = process.env.MONGODB_URI;

if (uri === undefined) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

try {
  await mongoose.connect(uri);
  console.log("MongoDB connection successful!");
  app.listen(port, () => console.log(`Server listening on port ${port}...`));
} catch (error) {
  console.error("MongoDB connection failed!", error);
  process.exit(1);
}
