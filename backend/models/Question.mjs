import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true,
    },
    questionText: {
      type: String, required: [true, 'Question text is required'], trim: true,
      maxlength: [1000, 'Question cannot exceed 1000 characters'],
    },
    questionImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    options: {
      type: [{ type: String, required: true, trim: true }],
      validate: {
        validator: (arr) => arr.length === 4,
        message: 'Each question must have exactly 4 options',
      },
    },
    correctAnswer: {
      type: Number, required: [true, 'Correct answer index is required'],
      min: 0, max: 3,
    },
    explanation: { type: String, trim: true, maxlength: 500 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
