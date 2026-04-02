import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthNav } from "../components/AuthNav";
import { createSession } from "../services/api";
import type { Session } from "../types/session";

const CreateSession = () => {
  const [title, setTitle] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      setError("");
      const data = await createSession(title);
      setSession(data);
    } catch (_error) {
      setError("Unable to create session");
    }
  };

  return (
    <div className="page">
      <AuthNav />
      <h2 className="title">Create Session</h2>

      <input
        className="input"
        type="text"
        placeholder="Enter session title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="btn" onClick={handleCreate} disabled={!title.trim()}>
        Create
      </button>

      {session && (
        <div className="message">
          <h3>Session created</h3>
          <p>
            <b>Title:</b> {session.title}
          </p>
          <p>
            <b>Code:</b> {session.code}
          </p>
          <div className="btn-row">
            <Link
              className="btn"
              to={`/manage/${encodeURIComponent(session.code)}`}
            >
              Open class dashboard
            </Link>
          </div>
          <p className="hint">
            Share the code with students. Use the dashboard to pause, resume, or
            end the session and see who joined.
          </p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateSession;
