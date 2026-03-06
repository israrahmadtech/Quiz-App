import { Router } from 'express';
import { submitAttempt, getLeaderboard, getUserHistory } from '../controllers/attemptController.mjs';
import { protect } from '../middleware/authMiddleware.mjs';

const router = Router();

router.post('/attempt', protect, submitAttempt);
router.get('/leaderboard/:quizId', getLeaderboard);
router.get('/history', protect, getUserHistory);

export default router;
