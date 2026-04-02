import Session, { ISession } from "../models/Session";
import { Request, Response } from "express";
import { AuthRequest } from "../types/express";

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const normalizeCode = (value: unknown) => String(value ?? "").trim().toUpperCase();

export const createSession = async (_req: AuthRequest, res: Response) => {
  try {
    const { title } = _req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Session title is required" });
    }

    let code = generateCode();
    while (await Session.findOne({ code })) {
      code = generateCode();
    }

    const startedAt = new Date();
    const session = await Session.create({
      title: title.trim(),
      code,
      startedAt,
      participants: [],
    });

    return res.status(201).json(session);
  } catch (_error) {
    return res.status(500).json({ message: "Error creating session" });
  }
};

export const joinSession = async (req: Request, res: Response) => {
  try {
    const { code, displayName } = req.body;
    const normalizedCode = normalizeCode(code);
    const name = String(displayName ?? "").trim();

    if (!normalizedCode) {
      return res.status(400).json({ message: "Session code is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Display name is required" });
    }

    const session = await Session.findOne({ code: normalizedCode });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "ended") {
      return res.status(403).json({ message: "This session has ended" });
    }

    session.participants.push({ displayName: name, joinedAt: new Date() });
    await session.save();

    return res.json(session);
  } catch (_error) {
    return res.status(500).json({ message: "Error joining session" });
  }
};

export const updateSessionStatus = async (req: Request, res: Response) => {
  try {
    const code = normalizeCode(req.params.code);
    const { status } = req.body as { status?: string };

    const allowed = ["active", "paused", "ended"] as const;
    if (!status || !allowed.includes(status as (typeof allowed)[number])) {
      return res.status(400).json({
        message: "Invalid status. Use active, paused, or ended.",
      });
    }

    const session = await Session.findOne({ code });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "ended") {
      return res.status(400).json({ message: "Session has already ended" });
    }

    session.status = status as ISession["status"];
    if (status === "ended") {
      session.endedAt = new Date();
    }
    if (status === "active" && !session.startedAt) {
      session.startedAt = new Date();
    }

    await session.save();
    return res.json(session);
  } catch (_error) {
    return res.status(500).json({ message: "Error updating session" });
  }
};

export const getSessionDetails = async (req: Request, res: Response) => {
  try {
    const code = normalizeCode(req.params.code);
    const session = await Session.findOne({ code });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.json(session);
  } catch (_error) {
    return res.status(500).json({ message: "Error fetching session details" });
  }
};

export const sendTestSessionInvitation = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getActiveSession = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getStudentSessions = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};
