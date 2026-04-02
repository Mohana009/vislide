import express from "express";
import Question from "../models/question";

const router = express.Router();

// POST - Student submits a question
router.post("/", async (req, res) => {
  try {
    const { sessionCode, text, studentName } = req.body;

    const newQuestion = new Question({
      sessionCode,
      text,
      studentName: studentName || "Anonymous",
    });

    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: "Error saving question" });
  }
});

// GET - Fetch all questions for a session
router.get("/:code", async (req, res) => {
  try {
    const questions = await Question.find({
      sessionCode: req.params.code,
    }).sort({ createdAt: 1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// PATCH - Teacher answers a question
router.patch("/:id/answer", async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer || !String(answer).trim()) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { answer: String(answer).trim(), answeredAt: new Date() },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.json(question);
  } catch (err) {
    return res.status(500).json({ message: "Error answering question" });
  }
});

export default router;
