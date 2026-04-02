import express from 'express';
import {
    createSession,
    sendTestSessionInvitation,
    joinSession,
    updateSessionStatus,
    getSessionDetails,
    getActiveSession,
    getStudentSessions,
} from '../controllers/session';

const router = express.Router();

// @route   GET /api/sessions/current/active
// @desc    Get active session for current user
router.get('/current/active', getActiveSession);

// @route   GET /api/sessions/student/history
// @desc    Get student session history
router.get('/student/history', getStudentSessions);

// @route   POST /api/sessions/test-email
// @desc    Send a test session invitation email (Teacher)
router.post('/test-email', sendTestSessionInvitation);

// @route   POST /api/sessions
// @desc    Create a session (Teacher)
router.post(
    '/',
    createSession
);

// @route   GET /api/sessions/query-mode
// @desc    Get or create teacher's query session

// @route   POST /api/sessions/join
// @desc    Join a session (Both Student and Teacher)
router.post(
    '/join',
    joinSession
);

// @route   PATCH /api/session/:code/status
// @desc    Update class session status (pause / resume / end)
router.patch('/:code/status', updateSessionStatus);

// @route   GET /api/sessions/:code
// @desc    Get session details
router.get('/:code', getSessionDetails);


export default router;
