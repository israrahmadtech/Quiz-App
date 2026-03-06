import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext.jsx';
import { useHistory } from '../hooks/useAttempt.js';
import { updateProfile } from '../services/authService.js';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiEdit2, FiAward, FiBookOpen, FiTrendingUp, FiImage } from 'react-icons/fi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { data: histData } = useHistory({ limit: 100 });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const avgScore = histData?.history?.length
    ? Math.round(histData.history.reduce((a,h) => a + h.percentage, 0) / histData.history.length)
    : 0;

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      updateUser(data.user);
      setEditing(false);
      setAvatarFile(null);
      setPreview(null);
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const handleSave = () => {
    const fd = new FormData();
    fd.append('name', name);
    if (avatarFile) fd.append('avatar', avatarFile);
    mutation.mutate(fd);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <h1 className="text-3xl font-display font-bold text-white">My Profile</h1>

      {/* Profile card */}
      <div className="card">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            {(preview || user?.avatar?.url)
              ? <img src={preview || user.avatar.url} alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-600/50" />
              : <div className="w-20 h-20 rounded-2xl bg-brand-600/20 flex items-center justify-center text-brand-400 text-3xl">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
            }
            {editing && (
              <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-brand-500 transition-colors">
                <FiImage className="text-white text-xs" />
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files[0]; if(f){ setAvatarFile(f); setPreview(URL.createObjectURL(f)); }}} />
              </label>
            )}
          </div>

          <div className="flex-1">
            {editing ? (
              <input value={name} onChange={e => setName(e.target.value)}
                className="input-field text-xl font-bold mb-1" placeholder="Your name" />
            ) : (
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            )}
            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
              <FiMail className="text-xs" /> {user?.email}
            </p>
            <p className="text-brand-400 text-xs font-semibold mt-1 uppercase tracking-wider">{user?.role}</p>
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                <button onClick={handleSave} disabled={mutation.isPending} className="btn-primary py-2 px-4 text-sm">
                  {mutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary py-2 px-4 text-sm flex items-center gap-1.5">
                <FiEdit2 /> Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <FiBookOpen />, label: 'Quizzes Taken', value: user?.totalQuizzesTaken || 0, color: 'text-brand-400' },
          { icon: <FiAward />, label: 'Total Score', value: user?.totalScore || 0, color: 'text-yellow-400' },
          { icon: <FiTrendingUp />, label: 'Avg Score', value: `${avgScore}%`, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`text-2xl mb-2 flex justify-center ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Member since */}
      <div className="card flex items-center gap-3">
        <FiUser className="text-brand-400 text-xl" />
        <div>
          <p className="text-gray-400 text-xs">Member since</p>
          <p className="text-white font-medium">{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}
