import express from "express";
import Question from "../models/Question";

const router = express.Router();

// POST
router.post("/", async (req, res) => {
  try {
    const { sessionCode, text, studentName } = req.body;

    const newQuestion = new Question({
      sessionCode,
      text,
      studentName,
    });

    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: "Error saving question" });
  }
});

// GET
router.get("/:code", async (req, res) => {
  try {
    const questions = await Question.find({
      sessionCode: req.params.code,
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

export default router;