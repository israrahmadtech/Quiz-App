import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String, required: [true, 'Quiz title is required'], trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String, required: [true, 'Description is required'], trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    thumbnail: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    category: {
      type: String, required: [true, 'Category is required'],
      enum: ['Technology','Science','Mathematics','History','Geography',
             'Sports','Entertainment','Literature','General Knowledge','Other'],
    },
    difficulty: {
      type: String, required: true,
      enum: ['Easy', 'Medium', 'Hard'], default: 'Medium',
    },
    timeLimit: {
      type: Number, required: [true, 'Time limit is required'],
      min: [1, 'Time limit must be at least 1 minute'],
      max: [120, 'Time limit cannot exceed 120 minutes'],
    },
    totalQuestions: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true },
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

quizSchema.index({ category: 1, difficulty: 1 });
quizSchema.index({ title: 'text', description: 'text' });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
