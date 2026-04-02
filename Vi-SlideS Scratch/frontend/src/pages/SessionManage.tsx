import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthNav } from "../components/AuthNav";
import { getSession, patchSessionStatus } from "../services/api";
import type { Session } from "../types/session";

const SessionManage = () => {
  const { code } = useParams<{ code: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
const [index, setIndex] = useState(0);

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
useEffect(() => {
  void load();
}, [load]);
useEffect(() => {
  const fetchQuestions = async () => {
    try {
      if (!code) return;

      const res = await fetch(
        `http://localhost:5000/api/questions/${code}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      console.log("QUESTIONS FROM BACKEND:", data); // 👈 IMPORTANT

      setQuestions(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  fetchQuestions();
}, [code]);


useEffect(() => {
  console.log(session);
}, [session]);

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
                <hr />

<h3 className="subheading">Slides View</h3>

<div
  style={{
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    color: "#fff",
    marginTop: "20px",
  }}
>
  <h1 style={{ fontSize: "2rem", textAlign: "center", color: "#fff" }}>
    {questions.length ? questions[index] : "No questions yet"}
  </h1>

  <div style={{ marginTop: "20px" }}>
    <button
      onClick={() => setIndex(index - 1)}
      disabled={index === 0}
    >
      Prev
    </button>

    <button
      onClick={() => setIndex(index + 1)}
      disabled={index === questions.length - 1}
      style={{ marginLeft: "10px" }}
    >
      Next
    </button>
  </div>
</div>
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

          <h3 className="subheading">
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
