import Attempt from '../models/Attempt.mjs';
import Quiz from '../models/Quiz.mjs';
import Question from '../models/Question.mjs';
import User from '../models/User.mjs';

// @desc  Submit quiz attempt
// @route POST /api/attempt
export const submitAttempt = async (req, res, next) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questions = await Question.find({ quizId }).sort({ order: 1 });
    if (!questions.length) {
      return res.status(400).json({ success: false, message: 'Quiz has no questions' });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedAnswers = 0;

    const processedAnswers = questions.map((q, idx) => {
      const userAnswer = answers[idx];
      const selectedAnswer = userAnswer?.selectedAnswer ?? -1;
      const isCorrect = selectedAnswer === q.correctAnswer;

      if (selectedAnswer === -1) skippedAnswers++;
      else if (isCorrect) correctAnswers++;
      else wrongAnswers++;

      return {
        questionId: q._id,
        selectedAnswer,
        isCorrect,
        timeTaken: userAnswer?.timeTaken || 0,
      };
    });

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = percentage >= 60;

    const attempt = await Attempt.create({
      userId: req.user._id, quizId, answers: processedAnswers,
      score, totalQuestions: questions.length,
      correctAnswers, wrongAnswers, skippedAnswers,
      percentage, timeTaken: Number(timeTaken), passed,
    });

    // Update quiz stats
    const allAttempts = await Attempt.find({ quizId });
    const avgScore = allAttempts.reduce((a, b) => a + b.percentage, 0) / allAttempts.length;
    await Quiz.findByIdAndUpdate(quizId, {
      totalAttempts: allAttempts.length,
      averageScore: Math.round(avgScore),
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalQuizzesTaken: 1, totalScore: score },
    });

    // Return attempt WITH correct answers for result page
    const populated = await Attempt.findById(attempt._id)
      .populate('quizId', 'title category difficulty')
      .lean();

    // Attach question details with correct answers
    const questionDetails = questions.map((q, idx) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      questionImage: q.questionImage,
      userAnswer: processedAnswers[idx].selectedAnswer,
      isCorrect: processedAnswers[idx].isCorrect,
      explanation: q.explanation,
    }));

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      attempt: { ...populated, questionDetails },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get leaderboard for a quiz
// @route GET /api/leaderboard/:quizId
export const getLeaderboard = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { limit = 20 } = req.query;

    const quiz = await Quiz.findById(quizId).select('title category difficulty');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Best attempt per user (highest score, then lowest time)
    const leaderboard = await Attempt.aggregate([
      { $match: { quizId: quiz._id } },
      { $sort: { score: -1, timeTaken: 1 } },
      { $group: { _id: '$userId', bestAttempt: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$bestAttempt' } },
      { $sort: { score: -1, timeTaken: 1 } },
      { $limit: Number(limit) },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1, score: 1, percentage: 1, timeTaken: 1, correctAnswers: 1,
          totalQuestions: 1, completedAt: 1,
          'user._id': 1, 'user.name': 1, 'user.avatar': 1,
        },
      },
    ]);

    res.json({ success: true, quiz, leaderboard });
  } catch (err) {
    next(err);
  }
};

// @desc  Get user quiz history
// @route GET /api/history
export const getUserHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Attempt.countDocuments({ userId: req.user._id });

    const history = await Attempt.find({ userId: req.user._id })
      .populate('quizId', 'title category difficulty thumbnail')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true, history,
      pagination: {
        total, page: Number(page), limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};
