import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../hooks/useAttempt.js';
import { PageSpinner } from '../components/common/LoadingSpinner.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { formatDate, formatDuration, scoreGrade, difficultyColor, categoryIcons } from '../utils/helpers.js';
import { HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useHistory({ page, limit: 10 });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Quiz History</h1>
        <p className="text-slate-400 mt-1">All your past attempts</p>
      </div>

      {isLoading ? <PageSpinner /> : data?.history?.length === 0 ? (
        <div className="card text-center py-20 text-slate-500">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-lg font-medium text-slate-300">No history yet</p>
          <Link to="/quizzes" className="btn-primary mt-4 inline-flex">Browse Quizzes</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data?.history?.map((attempt) => {
              const grade = scoreGrade(attempt.percentage);
              const quiz  = attempt.quizId;
              return (
                <div key={attempt._id} className="card-hover flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                    {quiz?.thumbnail?.url
                      ? <img src={quiz.thumbnail.url} className="w-full h-full object-cover" alt={quiz.title} />
                      : <div className="w-full h-full flex items-center justify-center text-xl">{categoryIcons[quiz?.category] || '📝'}</div>}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white text-sm truncate">{quiz?.title || 'Deleted Quiz'}</p>
                      {quiz?.difficulty && <span className={`badge ${difficultyColor[quiz.difficulty]} text-xs`}>{quiz.difficulty}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><HiClock size={12} /> {formatDate(attempt.completedAt)}</span>
                      <span className="flex items-center gap-1"><HiCheckCircle size={12} className="text-emerald-500" /> {attempt.correctAnswers}</span>
                      <span className="flex items-center gap-1"><HiXCircle size={12} className="text-red-500" /> {attempt.wrongAnswers}</span>
                      <span>⏱ {formatDuration(attempt.timeTaken)}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xl font-bold ${grade.color}`}>{attempt.percentage}%</p>
                    <p className="text-xs text-slate-600">{attempt.score}/{attempt.totalQuestions}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            page={page}
            pages={data?.pagination?.pages || 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
