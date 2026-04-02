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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;