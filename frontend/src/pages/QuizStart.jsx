import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuizzes.js';
import Spinner from '../components/common/Spinner.jsx';
import { DIFFICULTY_COLORS, CATEGORY_ICONS } from '../utils/constants.js';
import { FiClock, FiList, FiBarChart2, FiPlay, FiArrowLeft, FiAward } from 'react-icons/fi';

export default function QuizStart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuiz(id);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data?.quiz) return <div className="text-center py-20 text-gray-400">Quiz not found</div>;

  const { quiz } = data;
  const diff = DIFFICULTY_COLORS[quiz.difficulty];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in px-4">

      <Link to="/quizzes" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <FiArrowLeft /> Back to quizzes
      </Link>

      <div className="card border-brand-500/20 overflow-hidden">

        {/* HERO */}
        <div className="relative h-56 -mx-6 -mt-6 mb-8 overflow-hidden bg-gradient-to-br from-brand-900/40 to-surface-50">
          {quiz.thumbnail?.url ? (
            <img src={quiz.thumbnail.url} alt={quiz.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">
              {CATEGORY_ICONS[quiz.category] || '📚'}
            </div>
          )}

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* title */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge border ${diff}`}>{quiz.difficulty}</span>
              <span className="badge bg-white/10 text-gray-300 border border-white/20">{quiz.category}</span>
            </div>

            <h1 className="text-3xl font-display font-bold text-white leading-tight">
              {quiz.title}
            </h1>
          </div>
        </div>

        {/* description */}
        <p className="text-gray-400 mb-8 leading-relaxed text-sm">
          {quiz.description}
        </p>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {[
            { icon: <FiList />, label: 'Questions', value: quiz.totalQuestions },
            { icon: <FiClock />, label: 'Time Limit', value: `${quiz.timeLimit} min` },
            { icon: <FiBarChart2 />, label: 'Avg Score', value: quiz.averageScore ? `${quiz.averageScore}%` : 'New' },
          ].map(item => (
            <div key={item.label}
              className="glass-dark rounded-xl p-5 text-center hover:border-brand-500/40 border border-white/5 transition-all">

              <div className="text-brand-400 text-xl mb-2 flex justify-center">
                {item.icon}
              </div>

              <p className="text-white font-bold text-xl">
                {item.value}
              </p>

              <p className="text-gray-500 text-xs mt-1">
                {item.label}
              </p>

            </div>
          ))}
        </div>

        {/* RULES */}
        <div className="glass-dark rounded-xl p-6 mb-10 border border-white/5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiAward className="text-brand-400" /> Quiz Rules
          </h3>

          <ul className="space-y-3 text-sm text-gray-400">
            <li>• Answer all <span className="text-white">{quiz.totalQuestions}</span> questions within <span className="text-white">{quiz.timeLimit} minutes</span></li>
            <li>• You can only submit each quiz once per session</li>
            <li>• Timer starts immediately when you begin</li>
            <li>• Passing score is <span className="text-white">60%</span> or higher</li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <Link to="/quizzes" className="btn-secondary flex-1 text-center py-3">
            Cancel
          </Link>

          <button
            onClick={() => navigate(`/quiz/${id}/play`)}
            className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-lg">
            <FiPlay /> Start Quiz
          </button>
        </div>

      </div>
    </div>
  );
}