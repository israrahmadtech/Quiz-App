import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminQuizzes, useDeleteQuiz } from '../../hooks/useQuizzes.js';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { DIFFICULTY_COLORS, CATEGORY_ICONS } from '../../utils/constants.js';
import { FiPlus, FiEdit2, FiTrash2, FiList, FiEye, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminQuizzes() {
  const { data, isLoading } = useAdminQuizzes();
  const deleteMutation = useDeleteQuiz();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Manage Quizzes</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.quizzes?.length || 0} quizzes created</p>
        </div>
        <Link to="/admin/quiz/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> New Quiz
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !data?.quizzes?.length ? (
        <EmptyState icon="📝" title="No quizzes yet" description="Create your first quiz to get started."
          action={<Link to="/admin/quiz/new" className="btn-primary">Create Quiz</Link>} />
      ) : (
        <div className="space-y-4">
          {data.quizzes.map(quiz => (
            <div key={quiz._id} className="card hover:border-brand-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-600/20 flex-shrink-0">
                  {quiz.thumbnail?.url
                    ? <img src={quiz.thumbnail.url} alt={quiz.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">
                        {CATEGORY_ICONS[quiz.category] || '📚'}
                      </div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-sm">{quiz.title}</h3>
                    <span className={`badge border text-xs ${DIFFICULTY_COLORS[quiz.difficulty]}`}>{quiz.difficulty}</span>
                    {!quiz.isPublished && <span className="badge bg-gray-600/20 text-gray-400 border-gray-600/30">Draft</span>}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-3">
                    <span>{quiz.category}</span>
                    <span>·</span>
                    <span>{quiz.totalQuestions} questions</span>
                    <span>·</span>
                    <span>{quiz.totalAttempts} attempts</span>
                    <span>·</span>
                    <span>{quiz.timeLimit} min</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/quiz/${quiz._id}`} title="Preview"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <FiEye className="text-sm" />
                  </Link>
                  <Link to={`/admin/quiz/${quiz._id}/questions`} title="Questions"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-brand-600/20 flex items-center justify-center text-gray-400 hover:text-brand-400 transition-all">
                    <FiList className="text-sm" />
                  </Link>
                  <Link to={`/admin/quiz/${quiz._id}/edit`} title="Edit"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-brand-600/20 flex items-center justify-center text-gray-400 hover:text-brand-400 transition-all">
                    <FiEdit2 className="text-sm" />
                  </Link>
                  <button onClick={() => setDeleteTarget(quiz._id)} title="Delete"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Quiz"
          message="This will permanently delete the quiz and all its questions. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
