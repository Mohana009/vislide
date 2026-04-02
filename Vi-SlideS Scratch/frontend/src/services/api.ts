import type { Session, SessionStatus } from "../types/session";

const API = "http://localhost:5000/api/session";

export const createSession = async (title: string): Promise<Session> => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error("Unable to create session");
  }

  return res.json();
};

export const joinSession = async (
  code: string,
  displayName: string
): Promise<Session> => {
  const res = await fetch(`${API}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, displayName }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Unable to join session");
  }

  return data;
};

export const getSession = async (code: string): Promise<Session> => {
  const normalized = code.trim().toUpperCase();
  const res = await fetch(`${API}/${encodeURIComponent(normalized)}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Session not found");
  }

  return data;
};

export const patchSessionStatus = async (
  code: string,
  status: Extract<SessionStatus, "active" | "paused" | "ended">
): Promise<Session> => {
  const normalized = code.trim().toUpperCase();
  const res = await fetch(
    `${API}/${encodeURIComponent(normalized)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Unable to update session");
  }

  return data;
};
export const sendQuestion = async (code: string, question: string) => {
  const res = await fetch(`http://localhost:5000/api/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  sessionCode: code,
  text: question,
})
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to send question");
  }

  return data;
};

