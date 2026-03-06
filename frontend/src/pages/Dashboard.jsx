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
    { label: 'Quizzes Taken', value: user?.totalQuizzesTaken || 0, icon: <FiBookOpen />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Total Score', value: user?.totalScore || 0, icon: <FiAward />, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Avg. Score', value: `${avgScore}%`, icon: <FiTrendingUp />, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Recent Activity', value: totalAttempts, icon: <FiClock />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="absolute right-0 top-0 w-60 h-60 bg-brand-600/10 blur-3xl rounded-full" />
        <div className="relative flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-white">
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>

            <p className="text-gray-400 mt-1 text-sm">
              Ready to challenge your knowledge today?
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 transition px-4 py-2.5 rounded-lg text-sm font-semibold"
            >
              <FiShield />
              Admin Panel
            </Link>
          )}

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

        {stats.map(s => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur p-5 hover:border-brand-500/40 transition group"
          >

            <div className="flex items-center gap-4">

              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${s.bg} ${s.color} text-xl`}>
                {s.icon}
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  {s.value}
                </p>
                <p className="text-xs text-gray-400">
                  {s.label}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>

      {/* Latest Quizzes */}
      <div>

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold text-white">
            Latest Quizzes
          </h2>

          <Link
            to="/quizzes"
            className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1"
          >
            View all <FiArrowRight />
          </Link>

        </div>

        {qLoading ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizData?.quizzes?.map(q => (
              <QuizCard key={q._id} quiz={q} />
            ))}
          </div>

        )}

      </div>

      {/* Recent Attempts */}
      {histData?.history?.length > 0 && (

        <div>

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-bold text-white">
              Recent Attempts
            </h2>

            <Link
              to="/history"
              className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1"
            >
              View all <FiArrowRight />
            </Link>

          </div>

          <div className="space-y-3">

            {histData.history.slice(0, 3).map(h => (

              <div
                key={h._id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:border-brand-500/40 transition"
              >

                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-lg bg-brand-600/15 flex items-center justify-center text-lg">
                    {h.passed ? '✅' : '❌'}
                  </div>

                  <div>
                    <p className="font-medium text-white text-sm">
                      {h.quizId?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <div className="text-right">
                  <p className="font-bold text-white">
                    {h.percentage}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {h.correctAnswers}/{h.totalQuestions} correct
                  </p>
                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}