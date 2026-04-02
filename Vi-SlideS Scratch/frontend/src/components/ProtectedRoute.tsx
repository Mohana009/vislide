import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getStoredUser, getToken, redirectPathForRole } from "../services/auth";
import type { UserRole } from "../types/user";

type Props = {
  role: UserRole;
  children: ReactNode;
};

export function ProtectedRoute({ role, children }: Props) {
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={redirectPathForRole(user.role)} replace />;
  }

  return <>{children}</>;
}
