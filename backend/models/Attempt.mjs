import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true,
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedAnswer: { type: Number, default: -1 },
        isCorrect: { type: Boolean, default: false },
        timeTaken: { type: Number, default: 0 },
      },
    ],
    score: { type: Number, required: true, default: 0 },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    skippedAnswers: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    timeTaken: { type: Number, required: true, default: 0 },
    completedAt: { type: Date, default: Date.now },
    passed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

attemptSchema.index({ userId: 1, quizId: 1 });
attemptSchema.index({ quizId: 1, score: -1, timeTaken: 1 });

const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;
