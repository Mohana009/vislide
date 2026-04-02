import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import type { Session } from "../types/session";

const statusLabel: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  ended: "Ended",
  inactive: "Inactive",
};

const Welcome = () => {
  const [question, setQuestion] = useState("");
const [questions, setQuestions] = useState<string[]>([]);
const handleSubmit = () => {
  if (!question.trim()) return;

  setQuestions((prev) => [...prev, question]);
  console.log("Question submitted:", question);

  setQuestion("");
};
  const location = useLocation();
  const session = location.state as Session | undefined;

  return (
    <div className="page">
      <h2 className="title">Welcome</h2>
      {session ? (
        <div className="message">
          <p>
            <b>Session:</b> {session.title}
          </p>
          <p>
            <b>Code:</b> <code>{session.code}</code>
          </p>
          <p>
            <b>Status:</b>{" "}
            <span className={`badge badge-${session.status}`}>
              {statusLabel[session.status] ?? session.status}
            </span>
          </p>
          <p>
            <b>Participants:</b> {session.participants?.length ?? 0}
          </p>
          {session.status === "ended" && (
            <p className="hint">This class session has ended.</p>
          )}
          <hr />

<h3>Ask a Question</h3>

<input
  className="input"
  placeholder="Type your question..."
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
/>

<button className="btn" onClick={handleSubmit}>
  Submit Question
</button>

<ul>
  {questions.map((q, i) => (
    <li key={i}>{q}</li>
  ))}
</ul>
          <p className="footer-links">
            <Link className="link" to="/join">
              Join another session
            </Link>
          </p>
        </div>
      ) : (
        <p className="error">No session data found. Please join again.</p>
      )}
    </div>
  );
};

export default Welcome;
