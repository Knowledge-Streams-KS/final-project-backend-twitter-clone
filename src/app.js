import express from "express";
import "dotenv/config";
import allRoutes from "./routes/routes.js";
import connectDB from "./db/config.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/api", allRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
