import { Link } from 'react-router-dom';
import { HiClock, HiQuestionMarkCircle, HiUsers } from 'react-icons/hi';
import { difficultyColor, categoryIcons } from '../../utils/helpers.js';

export default function QuizCard({ quiz }) {
  return (
    <div className="card-hover group flex flex-col overflow-hidden animate-fade-in">
      {/* Thumbnail */}
      <div className="relative -mx-6 -mt-6 mb-4 overflow-hidden h-40">
        {quiz.thumbnail?.url ? (
          <img
            src={quiz.thumbnail.url}
            alt={quiz.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-900 to-slate-800 flex items-center justify-center">
            <span className="text-5xl">{categoryIcons[quiz.category] || '📝'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <span className={`absolute top-3 right-3 badge ${difficultyColor[quiz.difficulty]}`}>
          {quiz.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">{categoryIcons[quiz.category]}</span>
          <span className="text-xs text-slate-500 font-medium">{quiz.category}</span>
        </div>

        <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-primary-300 transition-colors">
          {quiz.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">{quiz.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <HiQuestionMarkCircle size={13} /> {quiz.totalQuestions} questions
          </span>
          <span className="flex items-center gap-1">
            <HiClock size={13} /> {quiz.timeLimit}m
          </span>
          <span className="flex items-center gap-1">
            <HiUsers size={13} /> {quiz.totalAttempts}
          </span>
        </div>

        <Link
          to={`/quizzes/${quiz._id}/start`}
          className="btn-primary w-full text-sm"
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
}
