import { Link } from 'react-router-dom';
import { FiClock, FiList, FiUsers, FiStar } from 'react-icons/fi';
import { DIFFICULTY_COLORS, CATEGORY_ICONS } from '../../utils/constants.js';

export default function QuizCard({ quiz }) {
  const diffClass = DIFFICULTY_COLORS[quiz.difficulty] || DIFFICULTY_COLORS.Medium;

  return (
    <Link to={`/quiz/${quiz._id}`}
      className="card group hover:border-brand-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/30 block">
      {/* Thumbnail */}
      <div className="relative h-40 -mx-6 -mt-6 mb-5 rounded-t-2xl overflow-hidden bg-gradient-to-br from-brand-900/50 to-surface-50">
        {quiz.thumbnail?.url
          ? <img src={quiz.thumbnail.url} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">
              {CATEGORY_ICONS[quiz.category] || '📚'}
            </div>
        }
        <div className="absolute top-3 left-3">
          <span className={`badge border ${diffClass}`}>{quiz.difficulty}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge bg-black/40 text-white border border-white/10">{quiz.category}</span>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-white text-base mb-2 line-clamp-2 group-hover:text-brand-300 transition-colors">
        {quiz.title}
      </h3>
      <p className="text-gray-500 text-xs mb-4 line-clamp-2">{quiz.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1"><FiList className="text-brand-400" />{quiz.totalQuestions} Qs</span>
        <span className="flex items-center gap-1"><FiClock className="text-brand-400" />{quiz.timeLimit}m</span>
        <span className="flex items-center gap-1"><FiUsers className="text-brand-400" />{quiz.totalAttempts}</span>
        {quiz.averageScore > 0 && <span className="flex items-center gap-1"><FiStar className="text-yellow-400" />{quiz.averageScore}%</span>}
      </div>
    </Link>
  );
}
