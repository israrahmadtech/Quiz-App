import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { PageSpinner } from '../../components/common/LoadingSpinner.jsx';
import { HiClipboardList, HiUsers, HiPlusCircle, HiCog } from 'react-icons/hi';

export default function AdminDashboard() {
  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => api.get('/quizzes', { params: { limit: 100 } }).then((r) => r.data),
  });

  const totalAttempts = quizzesData?.quizzes?.reduce((s, q) => s + q.totalAttempts, 0) || 0;

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Admin Overview</h1>
          <p className="text-slate-400 mt-1">Manage your quiz platform</p>
        </div>
        <Link to="/admin/quizzes/new" className="btn-primary gap-2">
          <HiPlusCircle size={18} /> New Quiz
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: HiClipboardList, label: 'Total Quizzes',  value: quizzesData?.pagination?.total || 0, color: 'text-primary-400', bg: 'bg-primary-600/15' },
          { icon: HiUsers,         label: 'Total Attempts', value: totalAttempts,                        color: 'text-emerald-400',  bg: 'bg-emerald-500/15' },
          { icon: HiCog,           label: 'Published',      value: quizzesData?.quizzes?.filter((q) => q.isPublished).length || 0, color: 'text-amber-400', bg: 'bg-amber-500/15' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/quizzes" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center">
            <HiClipboardList size={22} className="text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Manage Quizzes</p>
            <p className="text-sm text-slate-500">Edit, delete, add questions</p>
          </div>
        </Link>
        <Link to="/admin/quizzes/new" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <HiPlusCircle size={22} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Create New Quiz</p>
            <p className="text-sm text-slate-500">Add quiz with questions</p>
          </div>
        </Link>
      </div>

      {/* Recent quizzes table */}
      <div className="card">
        <h2 className="section-title mb-4">All Quizzes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-2 text-slate-500 font-medium">Quiz</th>
                <th className="text-left py-2 text-slate-500 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left py-2 text-slate-500 font-medium">Difficulty</th>
                <th className="text-left py-2 text-slate-500 font-medium hidden md:table-cell">Questions</th>
                <th className="text-left py-2 text-slate-500 font-medium hidden md:table-cell">Attempts</th>
                <th className="text-right py-2 text-slate-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {quizzesData?.quizzes?.map((quiz) => (
                <tr key={quiz._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-white truncate max-w-xs">{quiz.title}</p>
                  </td>
                  <td className="py-3 text-slate-400 hidden sm:table-cell">{quiz.category}</td>
                  <td className="py-3">
                    <span className={`badge ${quiz.difficulty === 'Easy' ? 'badge-easy' : quiz.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 hidden md:table-cell">{quiz.totalQuestions}</td>
                  <td className="py-3 text-slate-400 hidden md:table-cell">{quiz.totalAttempts}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/quizzes/${quiz._id}/questions`} className="text-xs text-primary-400 hover:text-primary-300">Questions</Link>
                      <Link to={`/admin/quizzes/${quiz._id}/edit`} className="text-xs text-amber-400 hover:text-amber-300">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
