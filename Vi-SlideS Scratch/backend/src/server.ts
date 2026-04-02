import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";
import sessionRoutes from "./routes/session";
import questionRoutes from "./routes/questionRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});