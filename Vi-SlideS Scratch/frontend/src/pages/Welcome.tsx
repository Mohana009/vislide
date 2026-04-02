import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { Session, Question } from "../types/session";
import { sendQuestion, getQuestions } from "../services/api";

const statusLabel: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  ended: "Ended",
  inactive: "Inactive",
};

const Welcome = () => {
  const location = useLocation();
  const session = location.state as Session | undefined;

  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const studentName = localStorage.getItem("displayName") || "Anonymous";

  // Poll for questions every 3 seconds so the student sees answers as they come in
  const fetchQuestions = async () => {
    if (!session?.code) return;
    try {
      const data = await getQuestions(session.code);
      // Only keep questions submitted by this student
      const mine = data.filter((q) => q.studentName === studentName);
      setQuestions(mine);
    } catch {
      // Silently ignore polling errors
    }
  };

  useEffect(() => {
    void fetchQuestions();
    intervalRef.current = setInterval(() => {
      void fetchQuestions();
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session?.code]);

  const handleSubmit = async () => {
    if (!questionText.trim() || !session?.code) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const saved = await sendQuestion(session.code, questionText.trim(), studentName);
      setQuestions((prev) => [...prev, saved]);
      setQuestionText("");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to send question");
    } finally {
      setSubmitting(false);
    }
  };

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
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            disabled={submitting || session.status === "ended"}
          />

          <button
            className="btn"
            onClick={handleSubmit}
            disabled={submitting || !questionText.trim() || session.status === "ended"}
          >
            {submitting ? "Sending..." : "Submit Question"}
          </button>

          {submitError && <p className="error">{submitError}</p>}

          {questions.length > 0 && (
            <>
              <h3 style={{ marginTop: "24px" }}>Your Questions</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {questions.map((q) => (
                  <li
                    key={q._id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      marginBottom: "12px",
                      backgroundColor: q.answer ? "#f0fdf4" : "#fafafa",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 600 }}>{q.text}</p>
                    {q.answer ? (
                      <p style={{ margin: "8px 0 0", color: "#166534" }}>
                        <b>Answer:</b> {q.answer}
                      </p>
                    ) : (
                      <p style={{ margin: "8px 0 0", color: "#888", fontStyle: "italic" }}>
                        Not answered yet
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

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
