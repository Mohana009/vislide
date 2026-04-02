import type { Session, SessionStatus, Question } from "../types/session";

const SESSION_API = "http://localhost:5000/api/session";
const QUESTIONS_API = "http://localhost:5000/api/questions";

export const createSession = async (title: string): Promise<Session> => {
  const res = await fetch(SESSION_API, {
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
  const res = await fetch(`${SESSION_API}/join`, {
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
  const res = await fetch(`${SESSION_API}/${encodeURIComponent(normalized)}`);

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
    `${SESSION_API}/${encodeURIComponent(normalized)}/status`,
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

// Send a question from a student
export const sendQuestion = async (
  sessionCode: string,
  text: string,
  studentName: string
): Promise<Question> => {
  const res = await fetch(QUESTIONS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionCode, text, studentName }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to send question");
  }

  return data;
};

// Get all questions for a session
export const getQuestions = async (sessionCode: string): Promise<Question[]> => {
  const res = await fetch(`${QUESTIONS_API}/${sessionCode}`);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch questions");
  }

  return data;
};

// Teacher answers a specific question
export const answerQuestion = async (
  questionId: string,
  answer: string
): Promise<Question> => {
  const res = await fetch(`${QUESTIONS_API}/${questionId}/answer`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answer }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to submit answer");
  }

  return data;
};
