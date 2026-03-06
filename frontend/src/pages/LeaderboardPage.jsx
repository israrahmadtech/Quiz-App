import { useParams, Link } from 'react-router-dom';
import { useLeaderboard } from '../hooks/useAttempt.js';
import { useQuiz } from '../hooks/useQuizzes.js';
import { PageSpinner } from '../components/common/LoadingSpinner.jsx';
import { formatDuration } from '../utils/helpers.js';
import { HiArrowLeft, HiTrendingUp } from 'react-icons/hi';
import { useState } from 'react';
import Pagination from '../components/common/Pagination.jsx';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const { data: quiz } = useQuiz(id);
  const { data, isLoading } = useLeaderboard(id, { page, limit: 10 });

  const leaderboard = data?.leaderboard || [];
  const total        = data?.total || 0;
  const pages        = Math.ceil(total / 10);

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Link to={`/quizzes/${id}/start`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6">
        <HiArrowLeft size={16} /> Back
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
          <HiTrendingUp size={20} className="text-amber-400" />
        </div>
        <div>
          <h1 className="page-header leading-none">Leaderboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">{quiz?.title}</p>
        </div>
      </div>

      {isLoading ? <PageSpinner /> : leaderboard.length === 0 ? (
        <div className="card text-center py-16 text-slate-500">
          <div className="text-5xl mb-3">🏆</div>
          <p>No attempts yet. Be the first!</p>
          <Link to={`/quizzes/${id}/start`} className="btn-primary mt-4 inline-flex">Take the Quiz</Link>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {page === 1 && leaderboard.length >= 1 && (
            <div className="flex items-end justify-center gap-3 mb-6">
              {[leaderboard[1], leaderboard[0], leaderboard[2]].filter(Boolean).map((entry, i) => {
                const positions = [1, 0, 2];
                const heights   = ['h-24', 'h-32', 'h-20'];
                const idx       = positions[i];
                return (
                  <div key={entry.userId} className={`flex-1 ${heights[i]} card flex flex-col items-center justify-end gap-1 pb-3 ${idx === 0 ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
                    <img src={entry.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=6366f1&color=fff&size=50`} alt={entry.name} className="w-8 h-8 rounded-full object-cover" />
                    <p className="text-lg">{medals[idx]}</p>
                    <p className="text-xs font-semibold text-white truncate max-w-full px-1">{entry.name?.split(' ')[0]}</p>
                    <p className="text-xs text-slate-400">{entry.percentage}%</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full list */}
          <div className="card divide-y divide-slate-800">
            {leaderboard.map((entry) => (
              <div key={entry.userId} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <span className="w-8 text-center font-bold text-slate-500 text-sm">
                  {entry.rank <= 3 && page === 1 ? medals[entry.rank - 1] : `#${entry.rank}`}
                </span>
                <img src={entry.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=6366f1&color=fff&size=50`} alt={entry.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{entry.name}</p>
                  <p className="text-xs text-slate-500">Time: {formatDuration(entry.timeTaken)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{entry.percentage}%</p>
                  <p className="text-xs text-slate-500">Score {entry.score}</p>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
