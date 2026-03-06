import { Router } from 'express';
import { body } from 'express-validator';
import {
  createQuiz, getQuizzes, getQuizById, updateQuiz, deleteQuiz,
  getAdminQuizzes, getQuizAnalytics,
} from '../controllers/quizController.mjs';
import { protect, adminOnly } from '../middleware/authMiddleware.mjs';
import { validate } from '../middleware/validateMiddleware.mjs';
import { uploadQuiz } from '../config/cloudinary.mjs';

const router = Router();

const quizValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty'),
  body('timeLimit').isInt({ min: 1, max: 120 }).withMessage('Time limit must be 1-120 minutes'),
];

router.get('/', getQuizzes);
router.get('/admin/all', protect, adminOnly, getAdminQuizzes);
router.get('/:id', getQuizById);
router.get('/:id/analytics', protect, adminOnly, getQuizAnalytics);

router.post('/', protect, adminOnly, uploadQuiz.single('thumbnail'), quizValidation, validate, createQuiz);
router.put('/:id', protect, adminOnly, uploadQuiz.single('thumbnail'), updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);

export default router;
