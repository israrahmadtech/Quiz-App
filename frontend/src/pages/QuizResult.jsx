import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { FiAward, FiCheck, FiX, FiClock, FiBarChart2, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { formatDuration } from '../utils/constants.js';

export default function QuizResult() {
  const { id } = useParams();
  const { state } = useLocation();
  const attempt = state?.attempt;

  if (!attempt) return <Navigate to={`/quiz/${id}`} replace />;

  const { correctAnswers, wrongAnswers, skippedAnswers, percentage, timeTaken, score, totalQuestions, passed, questionDetails, quizId } = attempt;
  const isPassing = passed || percentage >= 60;

  const circleR = 54;
  const circumference = 2 * Math.PI * circleR;
  const dash = (percentage / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8 px-4">

      {/* RESULT HERO */}
      <div className={`card text-center border-2 relative overflow-hidden ${isPassing ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
        <div className="absolute inset-0 opacity-20 blur-2xl pointer-events-none
  bg-gradient-to-br from-green-500/20 via-transparent to-transparent"/>

        <div className="text-5xl mb-3">{isPassing ? '🏆' : '💪'}</div>

        <h1 className="text-3xl font-display font-bold text-white mb-1">
          {isPassing ? 'Well Done!' : 'Keep Practicing!'}
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          {quizId?.title}
        </p>

        {/* SCORE CIRCLE */}
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40">

            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={circleR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />

              <circle
                cx="60"
                cy="60"
                r={circleR}
                fill="none"
                stroke={isPassing ? '#22c55e' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold text-white">{percentage}%</span>
              <span className="text-xs text-gray-400 mt-1">Score</span>
            </div>

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">

          {[
            { icon: <FiBarChart2 />, label: 'Score', value: `${score}/${totalQuestions}`, color: 'text-brand-400' },
            { icon: <FiCheck />, label: 'Correct', value: correctAnswers, color: 'text-green-400' },
            { icon: <FiX />, label: 'Wrong', value: wrongAnswers, color: 'text-red-400' },
            { icon: <FiClock />, label: 'Time', value: formatDuration(timeTaken), color: 'text-yellow-400' }
          ].map(s => (
            <div key={s.label} className="glass-dark rounded-xl p-4 text-center border border-white/5 hover:border-brand-500/30 transition-all">

              <div className={`text-xl mb-2 flex justify-center ${s.color}`}>
                {s.icon}
              </div>

              <p className="text-white font-bold text-lg">
                {s.value}
              </p>

              <p className="text-gray-500 text-xs">
                {s.label}
              </p>

            </div>
          ))}

        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">

        <Link
          to={`/quiz/${id}/leaderboard`}
          className="btn-secondary flex-1 py-3 text-center flex items-center justify-center gap-2"
        >
          <FiAward /> Leaderboard
        </Link>

        <Link
          to="/quizzes"
          className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
        >
          More Quizzes <FiArrowRight />
        </Link>

      </div>

      {/* REVIEW SECTION */}
      {questionDetails?.length > 0 && (
        <div>

          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-brand-400" /> Review Answers
          </h2>

          <div className="space-y-5">

            {questionDetails.map((q, idx) => (

              <div
                key={q._id}
                className={`card border transition-all
${q.isCorrect
                    ? 'border-green-500/20'
                    : q.userAnswer === -1
                      ? 'border-gray-600/20'
                      : 'border-red-500/20'
                  }`}
              >

                <div className="flex items-start gap-3 mb-4">

                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
${q.isCorrect
                      ? 'bg-green-500/20 text-green-400'
                      : q.userAnswer === -1
                        ? 'bg-gray-600/20 text-gray-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                    {idx + 1}
                  </span>

                  <p className="text-white text-sm font-medium leading-relaxed">
                    {q.questionText}
                  </p>

                </div>

                <div className="space-y-2 pl-11">

                  {q.options.map((opt, oIdx) => {

                    const isCorrect = oIdx === q.correctAnswer;
                    const isUser = oIdx === q.userAnswer;

                    let cls = 'glass border-white/5 text-gray-400';

                    if (isCorrect) cls = 'bg-green-500/10 border-green-500/40 text-green-300';
                    else if (isUser && !q.isCorrect) cls = 'bg-red-500/10 border-red-500/40 text-red-300';

                    return (

                      <div
                        key={oIdx}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs ${cls}`}
                      >

                        <span className="font-bold">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>

                        <span className="flex-1">
                          {opt}
                        </span>

                        {isCorrect && <FiCheck className="ml-auto text-green-400" />}
                        {isUser && !q.isCorrect && <FiX className="ml-auto text-red-400" />}

                      </div>

                    );

                  })}

                </div>

                {q.explanation && (
                  <div className="mt-4 pl-11">
                    <div className="p-3 bg-brand-600/10 rounded-lg border border-brand-500/20">
                      <p className="text-brand-300 text-xs">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                )}

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}