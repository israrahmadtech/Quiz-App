import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuizzes.js';
import { useQuestions } from '../hooks/useQuestions.js';
import { PageSpinner } from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { difficultyColor, categoryIcons } from '../utils/helpers.js';
import { HiClock, HiQuestionMarkCircle, HiPlay, HiArrowLeft, HiTrendingUp } from 'react-icons/hi';

export default function QuizStartPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quiz, isLoading, isError } = useQuiz(id);
  const { data: questions } = useQuestions(id);

  if (isLoading) return <PageSpinner />;
  if (isError || !quiz) return <ErrorMessage message="Quiz not found" />;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Link to="/quizzes" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <HiArrowLeft size={16} /> Back to Quizzes
      </Link>

      {/* Thumbnail */}
      {quiz.thumbnail?.url && (
        <div className="rounded-2xl overflow-hidden h-52 mb-6">
          <img src={quiz.thumbnail.url} alt={quiz.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="card space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{categoryIcons[quiz.category]}</span>
            <span className="text-sm text-slate-500">{quiz.category}</span>
            <span className={`badge ${difficultyColor[quiz.difficulty]} ml-auto`}>{quiz.difficulty}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          <p className="text-slate-400 mt-2 leading-relaxed">{quiz.description}</p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: HiQuestionMarkCircle, label: 'Questions', value: quiz.totalQuestions },
            { icon: HiClock,              label: 'Time Limit', value: `${quiz.timeLimit}m` },
            { icon: HiTrendingUp,         label: 'Attempts',   value: quiz.totalAttempts },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-slate-800/50 rounded-xl p-3 text-center">
              <Icon size={20} className="text-primary-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-400">Before you start:</p>
          <ul className="text-xs text-slate-400 space-y-1.5">
            <li>• You have <span className="text-white font-medium">{quiz.timeLimit} minutes</span> to complete all {quiz.totalQuestions} questions.</li>
            <li>• Each question has <span className="text-white font-medium">one correct answer</span>.</li>
            <li>• You can skip questions and come back to them.</li>
            <li>• Timer keeps running — no pausing!</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/quizzes" className="btn-secondary flex-1 justify-center">Cancel</Link>
          <button
            onClick={() => navigate(`/quizzes/${id}/play`)}
            disabled={!questions?.length}
            className="btn-primary flex-1 gap-2"
          >
            <HiPlay size={18} />
            {questions?.length ? 'Start Quiz' : 'Loading...'}
          </button>
        </div>
      </div>

      {/* Leaderboard link */}
      <div className="text-center mt-4">
        <Link to={`/quizzes/${id}/leaderboard`} className="text-sm text-slate-500 hover:text-primary-400 transition-colors">
          View Leaderboard →
        </Link>
      </div>
    </div>
  );
}
