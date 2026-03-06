import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuizzes.js';
import { useQuestions } from '../hooks/useQuestions.js';
import { useSubmitAttempt } from '../hooks/useAttempt.js';
import QuizTimer from '../components/quiz/QuizTimer.jsx';
import ProgressBar from '../components/quiz/ProgressBar.jsx';
import { PageSpinner } from '../components/common/LoadingSpinner.jsx';
import { HiArrowRight, HiArrowLeft, HiFlag } from 'react-icons/hi';
import toast from 'react-hot-toast';

const LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPlayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quiz } = useQuiz(id);
  const { data: questions, isLoading } = useQuestions(id);
  const { mutateAsync: submitAttempt, isPending: submitting } = useSubmitAttempt();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedLabel }
  const [finished, setFinished] = useState(false);
  const startTimeRef = useRef(Date.now());

  const handleTimeUp = useCallback(() => {
    if (!finished) handleSubmit(true);
  }, [finished, answers]);

  const handleSelect = (questionId, label) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
  };

  const handleSubmit = async (timeUp = false) => {
    if (finished) return;
    setFinished(true);

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const answersArray = questions.map((q) => ({
      questionId:     q._id,
      selectedAnswer: answers[q._id] || null,
    }));

    try {
      const result = await submitAttempt({ quizId: id, answers: answersArray, timeTaken });
      if (timeUp) toast('⏰ Time\'s up! Quiz submitted.', { icon: '⏰' });
      navigate(`/quizzes/${id}/result`, { state: { attempt: result.attempt } });
    } catch {
      setFinished(false);
    }
  };

  if (isLoading || !questions) return <PageSpinner />;

  const question = questions[currentIndex];
  const selected  = answers[question._id];
  const isAnswered = !!selected;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Top bar */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white truncate max-w-xs">{quiz?.title}</p>
          </div>
          <QuizTimer
            totalSeconds={(quiz?.timeLimit || 10) * 60}
            onTimeUp={handleTimeUp}
            paused={finished}
          />
        </div>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      {/* Question card */}
      <div className="card space-y-5 animate-scale-in" key={question._id}>
        {/* Question */}
        <div>
          <p className="text-xs text-slate-500 font-medium mb-3">Question {currentIndex + 1} of {questions.length}</p>
          <h2 className="text-lg font-semibold text-white leading-relaxed">{question.questionText}</h2>
        </div>

        {/* Question image */}
        {question.image?.url && (
          <img src={question.image.url} alt="question" className="w-full rounded-xl max-h-48 object-contain bg-slate-800" />
        )}

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selected === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(question._id, opt.label)}
                disabled={finished}
                className={`option-card w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-600/20 text-white'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isSelected ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {opt.label}
                </span>
                <span className="text-sm">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary text-sm px-4 gap-2 disabled:opacity-30"
          >
            <HiArrowLeft size={15} /> Previous
          </button>

          <div className="flex gap-2">
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className={`btn-primary text-sm px-4 gap-2 ${!isAnswered ? 'opacity-80' : ''}`}
              >
                Next <HiArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting || finished}
                className="btn-primary text-sm px-5 gap-2 bg-emerald-600 hover:bg-emerald-500"
              >
                <HiFlag size={15} />
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {questions.map((q, i) => (
          <button
            key={q._id}
            onClick={() => setCurrentIndex(i)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
              i === currentIndex
                ? 'bg-primary-600 text-white ring-2 ring-primary-400/50'
                : answers[q._id]
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Answered count */}
      <p className="text-center text-xs text-slate-500 mt-3">
        {Object.keys(answers).length} of {questions.length} answered
      </p>
    </div>
  );
}
