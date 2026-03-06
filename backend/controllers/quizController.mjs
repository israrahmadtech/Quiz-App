import Quiz from '../models/Quiz.mjs';
import Question from '../models/Question.mjs';
import Attempt from '../models/Attempt.mjs';
import { deleteImage } from '../config/cloudinary.mjs';

// @desc  Create quiz
// @route POST /api/quizzes
export const createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, timeLimit, tags } = req.body;

    const quizData = {
      title, description, category, difficulty,
      timeLimit: Number(timeLimit),
      createdBy: req.user._id,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    };

    if (req.file) {
      quizData.thumbnail = { url: req.file.path, publicId: req.file.filename };
    }

    const quiz = await Quiz.create(quizData);
    res.status(201).json({ success: true, message: 'Quiz created successfully', quiz });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all quizzes (with filters + pagination)
// @route GET /api/quizzes
export const getQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 9, sortBy = 'createdAt' } = req.query;

    const filter = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (search) filter.$text = { $search: search };

    const sortOptions = {
      createdAt: { createdAt: -1 },
      popularity: { totalAttempts: -1 },
      title: { title: 1 }
    };

    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const total = await Quiz.countDocuments(filter);
    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name avatar')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      quizzes,
      pagination: {
        total, page: Number(page), limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single quiz
// @route GET /api/quizzes/:id
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name avatar');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

// @desc  Update quiz
// @route PUT /api/quizzes/:id
export const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this quiz' });
    }

    const { title, description, category, difficulty, timeLimit, tags, isPublished } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (difficulty) updates.difficulty = difficulty;
    if (timeLimit) updates.timeLimit = Number(timeLimit);
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (isPublished !== undefined) updates.isPublished = isPublished;

    if (req.file) {
      if (quiz.thumbnail?.publicId) await deleteImage(quiz.thumbnail.publicId);
      updates.thumbnail = { url: req.file.path, publicId: req.file.filename };
    }

    const updated = await Quiz.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Quiz updated successfully', quiz: updated });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete quiz
// @route DELETE /api/quizzes/:id
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (quiz.thumbnail?.publicId) await deleteImage(quiz.thumbnail.publicId);
    await Question.deleteMany({ quizId: quiz._id });
    await Attempt.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get admin quizzes
// @route GET /api/quizzes/admin/all
export const getAdminQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (err) {
    next(err);
  }
};

// @desc  Get quiz analytics
// @route GET /api/quizzes/:id/analytics
export const getQuizAnalytics = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const attempts = await Attempt.find({ quizId: req.params.id })
      .populate('userId', 'name avatar')
      .sort({ score: -1, timeTaken: 1 });

    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0
      ? attempts.reduce((a, b) => a + b.percentage, 0) / totalAttempts
      : 0;
    const passRate = totalAttempts > 0
      ? (attempts.filter(a => a.passed).length / totalAttempts) * 100
      : 0;

    res.json({
      success: true,
      analytics: {
        quiz, totalAttempts, avgScore: avgScore.toFixed(1),
        passRate: passRate.toFixed(1),
        recentAttempts: attempts.slice(0, 10),
      },
    });
  } catch (err) {
    next(err);
  }
};
