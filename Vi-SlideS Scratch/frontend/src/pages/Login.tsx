import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  setAuth,
  getStoredUser,
  redirectPathForRole,
} from "../services/auth";
import type { UserRole } from "../types/user";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      navigate(redirectPathForRole(user.role), { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user, token } = await login(email.trim(), password, role);
      setAuth(token, user);
      navigate(redirectPathForRole(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2 className="title">Sign in</h2>
      <p className="hint">Enter your credentials and choose your role for this session.</p>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <fieldset className="role-fieldset">
          <legend className="role-legend">Role</legend>
          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role === "teacher"}
              onChange={() => setRole("teacher")}
            />
            Teacher
          </label>
          <label className="role-option">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            Student
          </label>
        </fieldset>

        <button
          className="btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="footer-links">
        <Link className="link" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
