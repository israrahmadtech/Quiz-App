import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCreateQuiz, useUpdateQuiz, useQuiz } from '../../hooks/useQuizzes.js';
import { quizSchema } from '../../utils/schemas.js';
import { CATEGORIES, DIFFICULTIES, TIME_OPTIONS } from '../../utils/constants.js';
import Spinner from '../../components/common/Spinner.jsx';
import { FiArrowLeft, FiImage } from 'react-icons/fi';

export default function AdminQuizForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [thumbPreview, setThumbPreview] = useState(null);

  const { data: existing, isLoading } = useQuiz(id);
  const createMutation = useCreateQuiz();
  const updateMutation = useUpdateQuiz();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(quizSchema),
    defaultValues: { difficulty: 'Medium', timeLimit: 10 },
  });

  useEffect(() => {
    if (isEdit && existing?.quiz) {
      const q = existing.quiz;
      reset({ title: q.title, description: q.description, category: q.category,
               difficulty: q.difficulty, timeLimit: q.timeLimit });
      if (q.thumbnail?.url) setThumbPreview(q.thumbnail.url);
    }
  }, [existing, isEdit, reset]);

  const onSubmit = (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v); });
    if (data.thumbnail?.[0]) fd.append('thumbnail', data.thumbnail[0]);

    if (isEdit) {
      updateMutation.mutate({ id, formData: fd }, {
        onSuccess: () => navigate('/admin'),
      });
    } else {
      createMutation.mutate(fd, {
        onSuccess: (res) => navigate(`/admin/quiz/${res.quiz._id}/questions`),
      });
    }
  };

  if (isEdit && isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6">
        <FiArrowLeft /> Back to quizzes
      </Link>

      <h1 className="text-3xl font-display font-bold text-white mb-8">
        {isEdit ? 'Edit Quiz' : 'Create New Quiz'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-5">
          {/* Thumbnail */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
              Thumbnail Image
            </label>
            <label className="cursor-pointer block">
              <div className={`h-40 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors
                ${thumbPreview ? 'border-brand-500/30' : 'border-white/10 hover:border-brand-500/50 bg-white/2'}`}>
                {thumbPreview
                  ? <img src={thumbPreview} alt="thumbnail" className="w-full h-full object-cover" />
                  : <div className="text-center text-gray-500">
                      <FiImage className="text-3xl mx-auto mb-2" />
                      <p className="text-sm">Click to upload thumbnail</p>
                    </div>
                }
              </div>
              <input type="file" accept="image/*" className="hidden" {...register('thumbnail')}
                onChange={e => { if (e.target.files[0]) setThumbPreview(URL.createObjectURL(e.target.files[0])); }} />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Title *</label>
            <input {...register('title')} className="input-field" placeholder="Enter quiz title" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Description *</label>
            <textarea {...register('description')} rows={3} className="input-field resize-none"
              placeholder="Describe the quiz..." />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Row: Category + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Category *</label>
              <select {...register('category')} className="input-field cursor-pointer">
                <option value="">Select category</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Difficulty *</label>
              <select {...register('difficulty')} className="input-field cursor-pointer">
                {DIFFICULTIES.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Time limit */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Time Limit (minutes) *
            </label>
            <select {...register('timeLimit')} className="input-field cursor-pointer">
              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t} minutes</option>)}
            </select>
            {errors.timeLimit && <p className="text-red-400 text-xs mt-1">{errors.timeLimit.message}</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/admin" className="btn-secondary flex-1 text-center py-3">Cancel</Link>
          <button type="submit" disabled={isPending} className="btn-primary flex-1 py-3">
            {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Create & Add Questions'}
          </button>
        </div>
      </form>
    </div>
  );
}
