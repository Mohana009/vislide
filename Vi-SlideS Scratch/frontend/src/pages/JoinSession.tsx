import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthNav } from "../components/AuthNav";
import { joinSession } from "../services/api";

const JoinSession = () => {
  const [code, setCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await joinSession(code, displayName);

      // Store displayName so the Welcome page can use it when submitting questions
      localStorage.setItem("displayName", displayName.trim());

      navigate("/welcome", { state: data });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to join");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = code.trim() && displayName.trim();

  return (
    <div className="page">
      <AuthNav />
      <h2 className="title">Join Session</h2>
      <p className="hint">Enter the code from your teacher and your name.</p>

      <input
        className="input"
        placeholder="Session code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        autoCapitalize="characters"
      />

      <input
        className="input"
        placeholder="Your display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <button
        className="btn"
        onClick={handleJoin}
        disabled={loading || !canSubmit}
      >
        {loading ? "Joining..." : "Join"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default JoinSession;
