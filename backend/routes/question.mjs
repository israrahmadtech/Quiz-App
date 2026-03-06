import { Router } from 'express';
import {
  addQuestion, getQuestions, getQuestionsAdmin,
  updateQuestion, deleteQuestion,
} from '../controllers/questionController.mjs';
import { protect, adminOnly } from '../middleware/authMiddleware.mjs';
import { uploadQuestion } from '../config/cloudinary.mjs';

const router = Router();

router.post('/', protect, adminOnly, uploadQuestion.single('questionImage'), addQuestion);
router.get('/:quizId', protect, getQuestions);
router.get('/:quizId/admin', protect, adminOnly, getQuestionsAdmin);
router.put('/:id', protect, adminOnly, uploadQuestion.single('questionImage'), updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

export default router;
