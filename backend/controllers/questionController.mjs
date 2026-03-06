import Question from '../models/Question.mjs';
import Quiz from '../models/Quiz.mjs';
import { deleteImage } from '../config/cloudinary.mjs';

// @desc  Add question to quiz
// @route POST /api/questions
export const addQuestion = async (req, res, next) => {
  try {
    const { quizId, questionText, options, correctAnswer, explanation, order } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
    if (!Array.isArray(parsedOptions) || parsedOptions.length !== 4) {
      return res.status(400).json({ success: false, message: 'Exactly 4 options required' });
    }

    const questionData = {
      quizId, questionText, options: parsedOptions,
      correctAnswer: Number(correctAnswer),
      explanation, order: Number(order) || 0,
    };

    if (req.file) {
      questionData.questionImage = { url: req.file.path, publicId: req.file.filename };
    }

    const question = await Question.create(questionData);
    await Quiz.findByIdAndUpdate(quizId, { $inc: { totalQuestions: 1 } });

    res.status(201).json({ success: true, message: 'Question added successfully', question });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all questions for a quiz
// @route GET /api/questions/:quizId
export const getQuestions = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questions = await Question.find({ quizId: req.params.quizId }).sort({ order: 1 });

    // Strip correct answers for non-admins during quiz
    const sanitized = questions.map(q => {
      const obj = q.toObject();
      if (req.user?.role !== 'admin') delete obj.correctAnswer;
      return obj;
    });

    res.json({ success: true, questions: sanitized, total: questions.length });
  } catch (err) {
    next(err);
  }
};

// @desc  Get questions WITH answers (for admin)
// @route GET /api/questions/:quizId/admin
export const getQuestionsAdmin = async (req, res, next) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId }).sort({ order: 1 });
    res.json({ success: true, questions });
  } catch (err) {
    next(err);
  }
};

// @desc  Update question
// @route PUT /api/questions/:id
export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const quiz = await Quiz.findById(question.quizId);
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { questionText, options, correctAnswer, explanation, order } = req.body;
    const updates = {};
    if (questionText) updates.questionText = questionText;
    if (options) updates.options = typeof options === 'string' ? JSON.parse(options) : options;
    if (correctAnswer !== undefined) updates.correctAnswer = Number(correctAnswer);
    if (explanation !== undefined) updates.explanation = explanation;
    if (order !== undefined) updates.order = Number(order);
    if (req.file) {
      if (question.questionImage?.publicId) await deleteImage(question.questionImage.publicId);
      updates.questionImage = { url: req.file.path, publicId: req.file.filename };
    }

    const updated = await Question.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Question updated', question: updated });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete question
// @route DELETE /api/questions/:id
export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const quiz = await Quiz.findById(question.quizId);
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (question.questionImage?.publicId) await deleteImage(question.questionImage.publicId);
    await question.deleteOne();
    await Quiz.findByIdAndUpdate(question.quizId, { $inc: { totalQuestions: -1 } });

    res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    next(err);
  }
};
