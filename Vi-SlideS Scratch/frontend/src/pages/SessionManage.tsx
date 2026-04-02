import { useCallback, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthNav } from "../components/AuthNav";
import { getSession, patchSessionStatus, getQuestions, answerQuestion } from "../services/api";
import type { Session, Question } from "../types/session";

const SessionManage = () => {
  const { code } = useParams<{ code: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Questions state — properly typed as Question[]
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (!code) return;
    setError("");
    setLoading(true);
    try {
      const data = await getSession(code);
      setSession(data);
    } catch (e) {
      setSession(null);
      setError(e instanceof Error ? e.message : "Could not load session");
    } finally {
      setLoading(false);
    }
  }, [code]);

  // Fetch questions and keep polling every 3 seconds
  const fetchQuestions = useCallback(async () => {
    if (!code) return;
    try {
      const data = await getQuestions(code);
      setQuestions(data);
    } catch {
      // Silently ignore polling errors
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void fetchQuestions();
    intervalRef.current = setInterval(() => {
      void fetchQuestions();
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchQuestions]);

  // Keep current index in bounds when questions list changes
  useEffect(() => {
    if (index >= questions.length && questions.length > 0) {
      setIndex(questions.length - 1);
    }
  }, [questions.length]);

  const onStatus = async (status: "active" | "paused" | "ended") => {
    if (!code) return;
    try {
      setActionLoading(true);
      setError("");
      const updated = await patchSessionStatus(code, status);
      setSession(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const currentQuestion = questions.length > 0 ? questions[index] : null;

  const handleAnswer = async () => {
    if (!currentQuestion || !answerText.trim()) return;
    setAnswerLoading(true);
    setAnswerError("");
    try {
      const updated = await answerQuestion(currentQuestion._id, answerText.trim());
      setQuestions((prev) =>
        prev.map((q) => (q._id === updated._id ? updated : q))
      );
      setAnswerText("");
    } catch (e) {
      setAnswerError(e instanceof Error ? e.message : "Failed to submit answer");
    } finally {
      setAnswerLoading(false);
    }
  };

  if (!code) {
    return (
      <div className="page page-wide">
        <AuthNav />
        <p className="error">Missing session code.</p>
        <Link className="link" to="/create">
          Create a session
        </Link>
      </div>
    );
  }

  return (
    <div className="page page-wide">
      <AuthNav />
      <h2 className="title">Class session</h2>

      {loading && <p className="message">Loading…</p>}

      {!loading && error && !session && (
        <p className="error">{error}</p>
      )}

      {session && (
        <>
          <div className="session-header">
            <div>
              <p className="session-title">{session.title}</p>
              <p className="session-code">
                Code: <code>{session.code}</code>
              </p>
            </div>
            <span className={`badge badge-${session.status}`}>
              {session.status}
            </span>
          </div>

          <div className="btn-row">
            {session.status !== "ended" && (
              <>
                {session.status === "paused" ? (
                  <button
                    type="button"
                    className="btn"
                    disabled={actionLoading}
                    onClick={() => void onStatus("active")}
                  >
                    Resume
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn secondary"
                    disabled={actionLoading}
                    onClick={() => void onStatus("paused")}
                  >
                    Pause
                  </button>
                )}
                <button
                  type="button"
                  className="btn danger"
                  disabled={actionLoading}
                  onClick={() => void onStatus("ended")}
                >
                  End session
                </button>
              </>
            )}
            <button
              type="button"
              className="btn ghost"
              disabled={actionLoading}
              onClick={() => void load()}
            >
              Refresh
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <hr />

          {/* ─── SLIDES / QUESTIONS VIEW ─────────────────────────────── */}
          <h3 className="subheading">
            Student Questions ({questions.length})
          </h3>

          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
              color: "#fff",
              marginTop: "20px",
              padding: "32px",
              borderRadius: "8px",
            }}
          >
            {currentQuestion ? (
              <>
                {/* Student info */}
                <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "8px" }}>
                  Asked by {currentQuestion.studentName}
                </p>

                {/* Question text */}
                <h1 style={{ fontSize: "2rem", textAlign: "center", color: "#fff", margin: 0 }}>
                  {currentQuestion.text}
                </h1>

                {/* Answer status */}
                {currentQuestion.answer ? (
                  <div
                    style={{
                      marginTop: "20px",
                      backgroundColor: "#166534",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      maxWidth: "600px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ margin: 0, color: "#fff", fontWeight: 600 }}>
                      Answered: {currentQuestion.answer}
                    </p>
                  </div>
                ) : (
                  /* Answer input — only shown when not yet answered */
                  <div
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  >
                    <input
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        border: "none",
                        fontSize: "1rem",
                        color: "#000",
                      }}
                      placeholder="Type your answer..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      disabled={answerLoading}
                    />
                    <button
                      style={{
                        padding: "10px 24px",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                      onClick={handleAnswer}
                      disabled={answerLoading || !answerText.trim()}
                    >
                      {answerLoading ? "Submitting..." : "Submit Answer"}
                    </button>
                    {answerError && (
                      <p style={{ color: "#fca5a5", margin: 0 }}>{answerError}</p>
                    )}
                  </div>
                )}

                {/* Prev / Next navigation */}
                <div style={{ marginTop: "28px", display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => { setIndex(index - 1); setAnswerText(""); setAnswerError(""); }}
                    disabled={index === 0}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "6px",
                      cursor: index === 0 ? "not-allowed" : "pointer",
                      opacity: index === 0 ? 0.4 : 1,
                    }}
                  >
                    ← Prev
                  </button>
                  <span style={{ color: "#aaa", lineHeight: "36px" }}>
                    {index + 1} / {questions.length}
                  </span>
                  <button
                    onClick={() => { setIndex(index + 1); setAnswerText(""); setAnswerError(""); }}
                    disabled={index === questions.length - 1}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "6px",
                      cursor: index === questions.length - 1 ? "not-allowed" : "pointer",
                      opacity: index === questions.length - 1 ? 0.4 : 1,
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: "#aaa", fontSize: "1.2rem" }}>
                No questions yet — waiting for students to ask...
              </p>
            )}
          </div>

          {/* ─── PARTICIPANTS ─────────────────────────────────────────── */}
          <h3 className="subheading" style={{ marginTop: "32px" }}>
            Participants ({(session.participants ?? []).length})
          </h3>
          {(session.participants ?? []).length === 0 ? (
            <p className="hint">No one has joined yet. Share the code with students.</p>
          ) : (
            <ul className="participant-list">
              {(session.participants ?? []).map((p) => (
                <li key={p._id}>
                  <span className="participant-name">{p.displayName}</span>
                  <span className="participant-time">
                    {new Date(p.joinedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {!loading && !session && (
        <button type="button" className="btn" onClick={() => void load()}>
          Retry
        </button>
      )}

      <p className="footer-links">
        <Link className="link" to="/create">
          New session
        </Link>
      </p>
    </div>
  );
};

export default SessionManage;
