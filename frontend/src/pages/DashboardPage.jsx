import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuizzes } from '../hooks/useQuizzes.js';
import { useHistory } from '../hooks/useAttempt.js';
import { HiClipboardList, HiClock, HiStar, HiTrendingUp, HiArrowRight } from 'react-icons/hi';
import QuizCard from '../components/quiz/QuizCard.jsx';
import { SkeletonList } from '../components/common/LoadingSpinner.jsx';
import { formatDate, scoreGrade } from '../utils/helpers.js';

const StatCard = ({ icon: Icon, label, value, sub, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-600/15 text-primary-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    amber:   'bg-amber-500/15 text-amber-400',
    violet:  'bg-violet-500/15 text-violet-400',
  };
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: quizzesData, isLoading: loadingQuizzes } = useQuizzes({ limit: 3 });
  const { data: historyData, isLoading: loadingHistory } = useHistory({ limit: 5 });

  const avgScore = user?.totalQuizzesTaken > 0
    ? Math.round(user.totalScore / user.totalQuizzesTaken)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="page-header">
          Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">Ready to challenge yourself today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiClipboardList} label="Quizzes Taken"  value={user?.totalQuizzesTaken || 0} color="primary" />
        <StatCard icon={HiStar}          label="Total Score"    value={user?.totalScore || 0}        color="amber" />
        <StatCard icon={HiTrendingUp}    label="Average Score"  value={avgScore}                     color="emerald" />
        <StatCard icon={HiClock}         label="Member Since"   value={formatDate(user?.createdAt)}  color="violet" />
      </div>

      {/* Recent quizzes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">New Quizzes</h2>
          <Link to="/quizzes" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
            Browse all <HiArrowRight size={15} />
          </Link>
        </div>
        {loadingQuizzes
          ? <SkeletonList count={3} />
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzesData?.quizzes?.map((q) => <QuizCard key={q._id} quiz={q} />)}
            </div>
        }
      </section>

      {/* Recent history */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Activity</h2>
          <Link to="/history" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
            Full history <HiArrowRight size={15} />
          </Link>
        </div>
        {loadingHistory ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : historyData?.history?.length === 0 ? (
          <div className="card text-center py-10 text-slate-500">
            No quizzes taken yet. <Link to="/quizzes" className="text-primary-400 hover:underline">Start one!</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {historyData?.history?.map((attempt) => {
              const grade = scoreGrade(attempt.percentage);
              return (
                <div key={attempt._id} className="card flex items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                    {attempt.quizId?.thumbnail?.url
                      ? <img src={attempt.quizId.thumbnail.url} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">📝</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{attempt.quizId?.title || 'Unknown Quiz'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(attempt.completedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${grade.color}`}>{attempt.percentage}%</p>
                    <p className="text-xs text-slate-600">{attempt.score}/{attempt.totalQuestions}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
