export type UserRole = "teacher" | "student";

export interface AuthUser {
  _id: string;
  name?: string;
  email?: string;
  role: UserRole;
}
