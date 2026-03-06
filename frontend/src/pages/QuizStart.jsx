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
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to="/quizzes" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <FiArrowLeft /> Back to quizzes
      </Link>

      <div className="card border-brand-500/20">
        {/* Thumbnail */}
        <div className="h-48 -mx-6 -mt-6 mb-6 rounded-t-2xl overflow-hidden bg-gradient-to-br from-brand-900/50 to-surface-50">
          {quiz.thumbnail?.url
            ? <img src={quiz.thumbnail.url} alt={quiz.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-7xl">
                {CATEGORY_ICONS[quiz.category] || '📚'}
              </div>
          }
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`badge border ${diff}`}>{quiz.difficulty}</span>
          <span className="badge bg-white/5 text-gray-400 border border-white/10">{quiz.category}</span>
        </div>

        <h1 className="text-3xl font-display font-bold text-white mb-3">{quiz.title}</h1>
        <p className="text-gray-400 mb-6 leading-relaxed">{quiz.description}</p>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <FiList />, label: 'Questions', value: quiz.totalQuestions },
            { icon: <FiClock />, label: 'Time Limit', value: `${quiz.timeLimit} min` },
            { icon: <FiBarChart2 />, label: 'Avg Score', value: quiz.averageScore ? `${quiz.averageScore}%` : 'New' },
          ].map(item => (
            <div key={item.label} className="glass-dark rounded-xl p-4 text-center">
              <div className="text-brand-400 text-lg mb-1 flex justify-center">{item.icon}</div>
              <p className="text-white font-bold text-lg">{item.value}</p>
              <p className="text-gray-500 text-xs">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="glass-dark rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><FiAward className="text-brand-400" /> Quiz Rules</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Answer all {quiz.totalQuestions} questions within {quiz.timeLimit} minutes</li>
            <li>• You can only submit each quiz once per session</li>
            <li>• Timer starts immediately when you begin</li>
            <li>• Passing score is 60% or higher</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Link to="/quizzes" className="btn-secondary flex-1 text-center py-3">Cancel</Link>
          <button onClick={() => navigate(`/quiz/${id}/play`)}
            className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
            <FiPlay /> Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
