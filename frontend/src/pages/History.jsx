import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../hooks/useAttempt.js';
import Spinner from '../components/common/Spinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatDuration, DIFFICULTY_COLORS, CATEGORY_ICONS } from '../utils/constants.js';
import { FiClock, FiCheck, FiX, FiChevronLeft, FiChevronRight, FiBarChart2 } from 'react-icons/fi';

export default function History() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useHistory({ page, limit: 8 });

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-white mb-2">Quiz History</h1>
      <p className="text-gray-500 text-sm mb-8">All your past attempts</p>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !data?.history?.length ? (
        <EmptyState icon="📋" title="No history yet"
          description="Complete your first quiz to see your history."
          action={<Link to="/quizzes" className="btn-primary">Browse Quizzes</Link>} />
      ) : (
        <>
          <div className="space-y-4">
            {data.history.map(h => (
              <div key={h._id} className="card hover:border-brand-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {CATEGORY_ICONS[h.quizId?.category] || '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-white text-sm">{h.quizId?.title || 'Deleted Quiz'}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {h.quizId?.difficulty && (
                            <span className={`badge border text-xs ${DIFFICULTY_COLORS[h.quizId.difficulty]}`}>
                              {h.quizId.difficulty}
                            </span>
                          )}
                          <span className="text-gray-500 text-xs">{new Date(h.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-2xl font-display font-bold ${h.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {h.percentage}%
                        </p>
                        <p className="text-xs text-gray-500">{h.passed ? 'Passed' : 'Failed'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><FiBarChart2 className="text-brand-400" />{h.score}/{h.totalQuestions} pts</span>
                      <span className="flex items-center gap-1"><FiCheck className="text-green-400" />{h.correctAnswers} correct</span>
                      <span className="flex items-center gap-1"><FiX className="text-red-400" />{h.wrongAnswers} wrong</span>
                      <span className="flex items-center gap-1"><FiClock className="text-yellow-400" />{formatDuration(h.timeTaken)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => p-1)} disabled={!data.pagination.hasPrevPage || page === 1}
                className="btn-secondary p-2 disabled:opacity-30"><FiChevronLeft /></button>
              <span className="text-gray-400 text-sm">Page {page} of {data.pagination.totalPages}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page >= data.pagination.totalPages}
                className="btn-secondary p-2 disabled:opacity-30"><FiChevronRight /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
