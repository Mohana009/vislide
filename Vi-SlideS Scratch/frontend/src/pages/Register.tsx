import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  register,
  setAuth,
  getStoredUser,
  redirectPathForRole,
} from "../services/auth";
import type { UserRole } from "../types/user";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      const { user, token } = await register(
        name.trim(),
        email.trim(),
        password,
        role
      );
      setAuth(token, user);
      navigate(redirectPathForRole(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2 className="title">Create account</h2>
      <p className="hint">Register as a teacher or student. Your role is stored on your account.</p>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          autoComplete="name"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <fieldset className="role-fieldset">
          <legend className="role-legend">Role</legend>
          <label className="role-option">
            <input
              type="radio"
              name="reg-role"
              checked={role === "teacher"}
              onChange={() => setRole("teacher")}
            />
            Teacher
          </label>
          <label className="role-option">
            <input
              type="radio"
              name="reg-role"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            Student
          </label>
        </fieldset>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="footer-links">
        <Link className="link" to="/">
          Already have an account? Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
