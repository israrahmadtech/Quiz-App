import { useParams, Link } from 'react-router-dom';
import { useLeaderboard } from '../hooks/useAttempt.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/common/Spinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatDuration } from '../utils/constants.js';
import { FiArrowLeft, FiAward, FiClock, FiUser } from 'react-icons/fi';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, isLoading } = useLeaderboard(id);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in px-4">

      <Link to={`/quiz/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6">
        <FiArrowLeft /> Back
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-yellow-500/20 rounded-xl flex items-center justify-center">
          <FiAward className="text-yellow-400 text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Leaderboard</h1>
          {data?.quiz && <p className="text-gray-500 text-sm">{data.quiz.title}</p>}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !data?.leaderboard?.length ? (
        <EmptyState icon="🏆" title="No attempts yet" description="Be the first to complete this quiz!" />
      ) : (

        <div className="space-y-4">

          {data.leaderboard.map((entry, idx) => {

            const isCurrentUser = entry.user._id === user?._id;
            const isTop3 = idx < 3;

            return (

              <div
                key={entry._id}
                className={`card flex items-center gap-4 transition-all duration-200 hover:scale-[1.01]
${isCurrentUser ? 'border-brand-500/40 bg-brand-600/10 shadow-lg shadow-brand-900/20' : 'hover:border-white/20'}
${isTop3 ? 'border-yellow-500/20 bg-yellow-500/5' : ''}
`}
              >

                {/* Rank */}
                <div className="w-12 text-center flex-shrink-0">
                  {isTop3 ? (
                    <span className="text-3xl">{MEDAL[idx]}</span>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 mx-auto">
                      #{idx + 1}
                    </div>
                  )}
                </div>

                {/* Avatar */}
                {entry.user.avatar?.url ? (
                  <img
                    src={entry.user.avatar.url}
                    alt={entry.user.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-600/30 flex items-center justify-center text-brand-400 flex-shrink-0">
                    <FiUser />
                  </div>
                )}

                {/* Name */}
                <div className="flex-1 min-w-0">

                  <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-brand-300' : 'text-white'}`}>
                    {entry.user.name} {isCurrentUser && <span className="text-xs text-brand-400">(You)</span>}
                  </p>

                  <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                    <FiClock className="text-xs" /> {formatDuration(entry.timeTaken)}
                  </p>

                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">

                  <div className={`px-3 py-1 rounded-lg text-sm font-bold
${isTop3 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/5 text-white'}
`}>
                    {entry.percentage}%
                  </div>

                  <p className="text-gray-500 text-xs mt-1">
                    {entry.correctAnswers}/{entry.totalQuestions}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}