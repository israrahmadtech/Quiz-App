import { Link } from 'react-router-dom';
import { FiClock, FiList, FiUsers, FiStar } from 'react-icons/fi';
import { DIFFICULTY_COLORS, CATEGORY_ICONS } from '../../utils/constants.js';

export default function QuizCard({ quiz }) {
  const diffClass = DIFFICULTY_COLORS[quiz.difficulty] || DIFFICULTY_COLORS.Medium;

  return (
    <Link
      to={`/quiz/${quiz._id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/20"
    >

      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">

        {quiz.thumbnail?.url ? (
          <img
            src={quiz.thumbnail.url}
            alt={quiz.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-brand-900/40 to-slate-900">
            {CATEGORY_ICONS[quiz.category] || '📚'}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Difficulty */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2.5 py-1 rounded-md backdrop-blur bg-black/40 border ${diffClass}`}>
            {quiz.difficulty}
          </span>
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className="text-xs px-2.5 py-1 rounded-md backdrop-blur bg-black/40 text-white border border-white/10">
            {quiz.category}
          </span>
        </div>

      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="font-semibold text-white text-base mb-2 line-clamp-2 group-hover:text-brand-300 transition-colors">
          {quiz.title}
        </h3>

        <p className="text-gray-400 text-xs mb-4 line-clamp-2">
          {quiz.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-xs">

          <div className="flex items-center gap-1 text-gray-400 bg-white/5 rounded-md px-2 py-1">
            <FiList className="text-brand-400" />
            {quiz.totalQuestions}
          </div>

          <div className="flex items-center gap-1 text-gray-400 bg-white/5 rounded-md px-2 py-1">
            <FiClock className="text-brand-400" />
            {quiz.timeLimit}m
          </div>

          <div className="flex items-center gap-1 text-gray-400 bg-white/5 rounded-md px-2 py-1">
            <FiUsers className="text-brand-400" />
            {quiz.totalAttempts}
          </div>

          {quiz.averageScore > 0 && (
            <div className="flex items-center gap-1 text-gray-400 bg-white/5 rounded-md px-2 py-1">
              <FiStar className="text-yellow-400" />
              {quiz.averageScore}%
            </div>
          )}

        </div>

      </div>

    </Link>
  );
}