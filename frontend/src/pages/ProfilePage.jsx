import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { HiPencil, HiPhotograph, HiUser, HiMail, HiShieldCheck, HiCalendar, HiStar } from 'react-icons/hi';
import { formatDate } from '../utils/helpers.js';
import { Spinner } from '../components/common/LoadingSpinner.jsx';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [name, setName] = useState(user?.name || '');
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      if (file) fd.append('avatar', file);
      const { data } = await api.put('/auth/update', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditing(false);
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const avgScore = user?.totalQuizzesTaken > 0
    ? Math.round(user.totalScore / user.totalQuizzesTaken)
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="page-header">Profile</h1>

      {/* Avatar + name */}
      <div className="card flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={preview || user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=6366f1&color=fff&size=200`}
            alt={user?.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-700"
          />
          {editing && (
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
              <HiPhotograph size={15} className="text-white" />
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        <div className="flex-1 w-full text-center sm:text-left">
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="input-label">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(false); setPreview(null); setFile(null); setName(user?.name); }} className="btn-secondary text-sm flex-1">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex-1">
                  {saving ? <><Spinner size="sm" /> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <span className={`badge text-xs ${user?.role === 'admin' ? 'bg-violet-500/15 text-violet-400' : 'bg-primary-500/15 text-primary-400'}`}>{user?.role}</span>
              </div>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <button onClick={() => setEditing(true)} className="btn-secondary text-xs mt-3 gap-1.5 px-3 py-1.5">
                <HiPencil size={13} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: HiStar,       label: 'Quizzes Taken', value: user?.totalQuizzesTaken || 0 },
          { icon: HiShieldCheck, label: 'Total Score',   value: user?.totalScore || 0 },
          { icon: HiCalendar,   label: 'Avg Score',      value: avgScore },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card text-center">
            <Icon size={20} className="text-primary-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div className="card space-y-4">
        <h2 className="section-title">Account Info</h2>
        {[
          { icon: HiUser,     label: 'Full Name',    value: user?.name },
          { icon: HiMail,     label: 'Email',        value: user?.email },
          { icon: HiShieldCheck, label: 'Role',      value: user?.role },
          { icon: HiCalendar, label: 'Member Since', value: formatDate(user?.createdAt) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
              <Icon size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm text-white font-medium capitalize">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
