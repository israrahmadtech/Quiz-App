import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { scoreGrade, formatDuration } from '../utils/helpers.js';
import { HiCheckCircle, HiXCircle, HiMinusCircle, HiArrowRight, HiTrendingUp } from 'react-icons/hi';

export default function QuizResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state?.attempt;

  if (!attempt) {
    navigate(`/quizzes/${id}/start`);
    return null;
  }

  const grade = scoreGrade(attempt.percentage);

  return (
    <div className="max-w-2xl mx-auto animate-bounce-in">
      {/* Score hero */}
      <div className="card text-center mb-6 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700">
        <div className="text-6xl mb-3">{grade.emoji}</div>
        <h1 className="text-2xl font-bold text-white mb-1">{grade.label}</h1>
        <div className={`text-6xl font-bold ${grade.color} my-4`}>{attempt.percentage}%</div>
        <p className="text-slate-400">Score: {attempt.score} / {attempt.totalQuestions}</p>

        {/* Circular progress */}
        <div className="flex justify-center my-6">
          <div className="relative w-32 h-32">
            <svg width="128" height="128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle
                cx="64" cy="64" r="56"
                fill="none"
                stroke={attempt.percentage >= 75 ? '#10b981' : attempt.percentage >= 50 ? '#6366f1' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - attempt.percentage / 100)}`}
                transform="rotate(-90 64 64)"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${grade.color}`}>{attempt.percentage}%</span>
              <span className="text-xs text-slate-500">Score</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <HiCheckCircle size={22} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-emerald-400">{attempt.correctAnswers}</p>
            <p className="text-xs text-slate-500">Correct</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <HiXCircle size={22} className="text-red-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-400">{attempt.wrongAnswers}</p>
            <p className="text-xs text-slate-500">Wrong</p>
          </div>
          <div className="bg-slate-500/10 border border-slate-500/20 rounded-xl p-3">
            <HiMinusCircle size={22} className="text-slate-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-400">{attempt.skippedAnswers}</p>
            <p className="text-xs text-slate-500">Skipped</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">Time taken: {formatDuration(attempt.timeTaken)}</p>
      </div>

      {/* Answer review */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Answer Review</h2>
        <div className="space-y-4">
          {attempt.questions?.map((q, i) => {
            const ans = attempt.answers?.find((a) => String(a.questionId) === String(q._id));
            const isCorrect = ans?.isCorrect;
            const selected  = ans?.selectedAnswer;
            const skipped   = !selected;

            return (
              <div key={q._id} className={`p-4 rounded-xl border ${
                skipped   ? 'border-slate-700 bg-slate-800/30' :
                isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' :
                            'border-red-500/30 bg-red-500/5'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {skipped   ? <HiMinusCircle size={18} className="text-slate-500" /> :
                     isCorrect ? <HiCheckCircle size={18} className="text-emerald-400" /> :
                                 <HiXCircle size={18} className="text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium mb-2">
                      <span className="text-slate-500 mr-2">Q{i + 1}.</span>{q.questionText}
                    </p>
                    {!skipped && !isCorrect && (
                      <p className="text-xs text-red-400 mb-1">Your answer: {selected} — {q.options.find((o) => o.label === selected)?.text}</p>
                    )}
                    <p className="text-xs text-emerald-400">
                      ✓ Correct: {q.correctAnswer} — {q.options.find((o) => o.label === q.correctAnswer)?.text}
                    </p>
                    {q.explanation && <p className="text-xs text-slate-500 mt-1.5 italic">{q.explanation}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/quizzes" className="btn-secondary flex-1 justify-center">Browse More</Link>
        <Link to={`/quizzes/${id}/leaderboard`} className="btn-primary flex-1 gap-2">
          Leaderboard <HiTrendingUp size={16} />
        </Link>
      </div>
      <div className="text-center mt-3">
        <button onClick={() => navigate(`/quizzes/${id}/start`)} className="text-sm text-slate-500 hover:text-primary-400">
          Try Again →
        </button>
      </div>
    </div>
  );
}
