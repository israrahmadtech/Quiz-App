import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestionsAdmin, useAddQuestion, useDeleteQuestion } from '../../hooks/useQuestions.js';
import { useQuiz } from '../../hooks/useQuizzes.js';
import Spinner from '../../components/common/Spinner.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { FiArrowLeft, FiPlus, FiTrash2, FiImage, FiCheck } from 'react-icons/fi';

const EMPTY_OPTS = ['', '', '', ''];

export default function AdminQuestions() {
  const { id: quizId } = useParams();
  const { data: quizData } = useQuiz(quizId);
  const { data: qData, isLoading } = useQuestionsAdmin(quizId);
  const addMutation = useAddQuestion(quizId);
  const deleteMutation = useDeleteQuestion(quizId);

  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ questionText: '', options: [...EMPTY_OPTS], correctAnswer: 0, explanation: '' });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  const handleSubmit = () => {
    if (!form.questionText.trim()) return;
    if (form.options.some(o => !o.trim())) return;
    const fd = new FormData();
    fd.append('quizId', quizId);
    fd.append('questionText', form.questionText);
    fd.append('options', JSON.stringify(form.options));
    fd.append('correctAnswer', form.correctAnswer);
    fd.append('explanation', form.explanation);
    fd.append('order', (qData?.questions?.length || 0) + 1);
    if (imgFile) fd.append('questionImage', imgFile);
    addMutation.mutate(fd, {
      onSuccess: () => {
        setForm({ questionText: '', options: [...EMPTY_OPTS], correctAnswer: 0, explanation: '' });
        setImgFile(null); setImgPreview(null); setShowForm(false);
      },
    });
  };

  const questions = qData?.questions || [];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link to="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6">
        <FiArrowLeft /> Back to quizzes
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Questions</h1>
          <p className="text-gray-500 text-sm mt-1">{quizData?.quiz?.title} · {questions.length} questions</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Question
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card border-brand-500/30 mb-6 animate-scale-in">
          <h3 className="font-semibold text-white mb-5">New Question</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Question Text *</label>
              <textarea value={form.questionText} onChange={e => setForm(f => ({...f, questionText: e.target.value}))}
                rows={2} className="input-field resize-none" placeholder="Enter question..." />
            </div>

            {/* Image upload */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Question Image (optional)</label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 glass rounded-xl text-gray-400 hover:text-white text-sm transition-colors">
                <FiImage /> {imgPreview ? 'Change image' : 'Upload image'}
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => { const f=e.target.files[0]; if(f){setImgFile(f);setImgPreview(URL.createObjectURL(f));} }} />
              </label>
              {imgPreview && <img src={imgPreview} alt="" className="mt-2 h-24 rounded-xl object-cover" />}
            </div>

            {/* Options */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Options * (select correct answer)</label>
              <div className="space-y-2">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <button type="button" onClick={() => setForm(f => ({...f, correctAnswer: idx}))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                        ${form.correctAnswer === idx ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {form.correctAnswer === idx ? <FiCheck /> : String.fromCharCode(65+idx)}
                    </button>
                    <input value={opt} onChange={e => {
                      const opts = [...form.options]; opts[idx] = e.target.value; setForm(f => ({...f, options: opts}));
                    }} className="input-field" placeholder={`Option ${String.fromCharCode(65+idx)}`} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click a letter button to mark the correct answer</p>
            </div>

            {/* Explanation */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Explanation (optional)</label>
              <input value={form.explanation} onChange={e => setForm(f => ({...f, explanation: e.target.value}))}
                className="input-field" placeholder="Explain the correct answer..." />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSubmit} disabled={addMutation.isPending} className="btn-primary flex-1">
                {addMutation.isPending ? 'Adding...' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions list */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">❓</p>
          <p>No questions yet. Add your first question above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q._id} className="card hover:border-brand-500/20 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-7 h-7 bg-brand-600/20 text-brand-400 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium leading-relaxed">{q.questionText}</p>
                    {q.questionImage?.url && <img src={q.questionImage.url} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
                    <div className="mt-3 space-y-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg
                          ${oIdx === q.correctAnswer ? 'bg-green-500/10 text-green-400' : 'text-gray-500'}`}>
                          <span className="font-bold">{String.fromCharCode(65+oIdx)}.</span> {opt}
                          {oIdx === q.correctAnswer && <FiCheck className="ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => setDeleteTarget(q._id)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all flex-shrink-0">
                  <FiTrash2 className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal title="Delete Question" message="Are you sure you want to delete this question?"
          onConfirm={() => deleteMutation.mutateAsync(deleteTarget).then(() => setDeleteTarget(null))}
          onCancel={() => setDeleteTarget(null)} loading={deleteMutation.isPending} />
      )}
    </div>
  );
}
