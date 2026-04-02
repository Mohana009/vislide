export type SessionStatus = "active" | "inactive" | "ended" | "paused";

export interface Participant {
  _id: string;
  displayName: string;
  joinedAt: string;
}

export interface Session {
  _id: string;
  title: string;
  code: string;
  status: SessionStatus;
  participants: Participant[];
  startedAt?: string;
  endedAt?: string;
}
