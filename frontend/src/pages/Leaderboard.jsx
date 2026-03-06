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
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to={`/quiz/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6">
        <FiArrowLeft /> Back
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
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
        <div className="space-y-3">
          {data.leaderboard.map((entry, idx) => {
            const isCurrentUser = entry.user._id === user?._id;
            return (
              <div key={entry._id}
                className={`card flex items-center gap-4 transition-all ${isCurrentUser ? 'border-brand-500/40 bg-brand-600/10' : 'hover:border-white/20'}`}>
                {/* Rank */}
                <div className="w-10 text-center flex-shrink-0">
                  {idx < 3
                    ? <span className="text-2xl">{MEDAL[idx]}</span>
                    : <span className="text-gray-400 font-bold font-mono text-sm">#{idx + 1}</span>
                  }
                </div>

                {/* Avatar */}
                {entry.user.avatar?.url
                  ? <img src={entry.user.avatar.url} alt={entry.user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0" />
                  : <div className="w-10 h-10 rounded-full bg-brand-600/30 flex items-center justify-center text-brand-400 flex-shrink-0">
                      <FiUser />
                    </div>
                }

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-brand-300' : 'text-white'}`}>
                    {entry.user.name} {isCurrentUser && '(You)'}
                  </p>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <FiClock className="text-xs" /> {formatDuration(entry.timeTaken)}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white">{entry.percentage}%</p>
                  <p className="text-gray-500 text-xs">{entry.correctAnswers}/{entry.totalQuestions}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
