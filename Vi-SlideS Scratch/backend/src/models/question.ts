import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  sessionCode: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    default: "Anonymous",
  },
  answer: {
    type: String,
    default: null,
  },
  answeredAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
