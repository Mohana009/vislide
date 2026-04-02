import { useNavigate } from "react-router-dom";
import { clearAuth } from "../services/auth";

export function AuthNav() {
  const navigate = useNavigate();

  return (
    <div className="auth-nav">
      <button
        type="button"
        className="btn ghost btn-small"
        onClick={() => {
          clearAuth();
          navigate("/", { replace: true });
        }}
      >
        Sign out
      </button>
    </div>
  );
}
