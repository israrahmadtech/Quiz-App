import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuizzes } from '../hooks/useQuizzes.js';
import { useHistory } from '../hooks/useAttempt.js';
import QuizCard from '../components/common/QuizCard.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { FiBookOpen, FiAward, FiTrendingUp, FiClock, FiArrowRight, FiShield } from 'react-icons/fi';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { data: quizData, isLoading: qLoading } = useQuizzes({ limit: 4 });
  const { data: histData } = useHistory({ limit: 3 });

  const totalAttempts = histData?.history?.length || 0;
  const avgScore = histData?.history?.length
    ? Math.round(histData.history.reduce((a, h) => a + h.percentage, 0) / histData.history.length)
    : 0;

  const stats = [
    { label: 'Quizzes Taken', value: user?.totalQuizzesTaken || 0, icon: <FiBookOpen />, color: 'text-brand-400' },
    { label: 'Total Score', value: user?.totalScore || 0, icon: <FiAward />, color: 'text-yellow-400' },
    { label: 'Avg. Score', value: `${avgScore}%`, icon: <FiTrendingUp />, color: 'text-green-400' },
    { label: 'Recent Activity', value: totalAttempts, icon: <FiClock />, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Ready to test your knowledge today?</p>
        </div>
        {isAdmin && (
          <Link to="/admin" className="btn-primary flex items-center gap-2">
            <FiShield /> Admin Panel
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`text-2xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent quizzes */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold text-white">Latest Quizzes</h2>
          <Link to="/quizzes" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1">
            View all <FiArrowRight />
          </Link>
        </div>
        {qLoading
          ? <div className="flex justify-center py-12"><Spinner /></div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {quizData?.quizzes?.map(q => <QuizCard key={q._id} quiz={q} />)}
            </div>
        }
      </div>

      {/* History preview */}
      {histData?.history?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-display font-bold text-white">Recent Attempts</h2>
            <Link to="/history" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>
          <div className="space-y-3">
            {histData.history.slice(0,3).map(h => (
              <div key={h._id} className="card flex items-center justify-between hover:border-brand-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center text-lg">
                    {h.passed ? '✅' : '❌'}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{h.quizId?.title}</p>
                    <p className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{h.percentage}%</p>
                  <p className="text-xs text-gray-500">{h.correctAnswers}/{h.totalQuestions} correct</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
