import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuizzes.js';
import { useQuestions } from '../hooks/useQuestions.js';
import { useSubmitAttempt } from '../hooks/useAttempt.js';
import Spinner from '../components/common/Spinner.jsx';
import { formatTime } from '../utils/constants.js';
import { FiClock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quizData } = useQuiz(id);
  const { data: qData, isLoading } = useQuestions(id);
  const submitMutation = useSubmitAttempt();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());

  const quiz = quizData?.quiz;
  const questions = qData?.questions || [];

  useEffect(() => {
    if (quiz && !started) {
      setTimeLeft(quiz.timeLimit * 60);
      setStarted(true);
      startTimeRef.current = Date.now();
    }
  }, [quiz, started]);

  const handleSubmit = useCallback(async (finalAnswers) => {
    if (submitted) return;
    setSubmitted(true);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      const result = await submitMutation.mutateAsync({ quizId: id, answers: finalAnswers, timeTaken });
      navigate(`/quiz/${id}/result`, { state: { attempt: result.attempt } });
    } catch {
      toast.error('Failed to submit quiz');
      setSubmitted(false);
    }
  }, [submitted, id, submitMutation, navigate]);

  useEffect(() => {
    if (!started || submitted || timeLeft === 0) return;
    if (timeLeft <= 0) { handleSubmit(answers); return; }

    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { clearInterval(t); handleSubmit(answers); return 0; }
      return p - 1;
    }), 1000);

    return () => clearInterval(t);

  }, [started, submitted, timeLeft, answers, handleSubmit]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!questions.length) return <div className="text-center py-20 text-gray-400">No questions available</div>;

  const q = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const isUrgent = timeLeft < 60;

  const handleSelect = (idx) => {
    if (!selected && selected !== 0) setSelected(idx);
  };

  const handleNext = () => {

    const timeTaken = Math.round((Date.now() - questionStartRef.current) / 1000);

    const newAnswers = [...answers, {
      selectedAnswer: selected ?? -1,
      timeTaken
    }];

    setAnswers(newAnswers);
    setSelected(null);
    questionStartRef.current = Date.now();

    if (currentIndex + 1 >= questions.length) {
      handleSubmit(newAnswers);
    } else {
      setCurrentIndex(i => i + 1);
    }

  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in px-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div className="glass-dark px-4 py-2 rounded-xl">
          <p className="text-gray-400 text-xs">Question</p>
          <p className="text-white font-bold font-mono text-lg">
            {currentIndex + 1} / {questions.length}
          </p>
        </div>

        <div className={`flex items-center gap-2 px-5 py-2 rounded-xl font-mono font-bold text-lg border
${isUrgent
            ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
            : 'glass border-white/10 text-white'
          }`}>

          <FiClock className={isUrgent ? 'text-red-400' : 'text-brand-400'} />
          {formatTime(timeLeft)}

        </div>

      </div>

      {/* PROGRESS */}
      <div className="mb-10">

        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="h-2 bg-white/5 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-brand-600 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

      {/* QUESTION CARD */}
      <div
        className="card border-brand-500/20 mb-6 animate-scale-in"
        key={currentIndex}
      >

        {q.questionImage?.url && (
          <div className="h-44 -mx-6 -mt-6 mb-6 rounded-t-2xl overflow-hidden">
            <img
              src={q.questionImage.url}
              alt="question"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h2 className="text-xl font-semibold text-white leading-relaxed mb-8">
          {q.questionText}
        </h2>

        <div className="space-y-4">

          {q.options?.map((opt, idx) => {

            const isSelected = selected === idx;

            return (

              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full flex items-start gap-3 px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-200
${isSelected
                    ? 'bg-brand-600/30 border-brand-500 text-white shadow-lg shadow-brand-900/40'
                    : 'glass border-white/10 text-gray-300 hover:border-brand-500/50 hover:bg-brand-600/10 hover:text-white'
                  }`}>

                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
${isSelected
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/10 text-gray-400'
                    }`}>

                  {String.fromCharCode(65 + idx)}

                </span>

                <span className="flex-1 text-left">
                  {opt}
                </span>

              </button>

            );

          })}

        </div>

      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-3">

        {selected === null && selected !== 0 && (

          <div className="flex items-center gap-2 text-yellow-400/70 text-xs flex-1">
            <FiAlertCircle />
            Select an answer or skip
          </div>

        )}

        <button
          onClick={handleNext}
          disabled={submitMutation.isPending}
          className="btn-primary px-8 py-3 ml-auto flex items-center gap-2 disabled:opacity-50 text-base"
        >

          {submitMutation.isPending
            ? <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
            : currentIndex + 1 === questions.length
              ? 'Submit Quiz'
              : 'Next →'}

        </button>

      </div>

    </div>
  );
}