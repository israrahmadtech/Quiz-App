import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiImage, FiZap, FiArrowRight } from 'react-icons/fi';
import { registerSchema } from '../utils/schemas.js';
import { registerUser } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  const onSubmit = (data) => {
    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('email', data.email);
    fd.append('password', data.password);
    if (data.avatar?.[0]) fd.append('avatar', data.avatar[0]);
    mutation.mutate(fd);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-white mb-6">
            <span className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center"><FiZap /></span>
            QuizMaster
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">Create account</h1>
          <p className="text-gray-500 mt-2 text-sm">Join thousands of curious minds</p>
        </div>

        <div className="card border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar preview */}
            <div className="flex justify-center mb-2">
              <label className="cursor-pointer group">
                <div className="w-20 h-20 rounded-2xl bg-brand-600/20 border-2 border-dashed border-brand-600/50 flex items-center justify-center overflow-hidden group-hover:border-brand-500 transition-colors">
                  {preview
                    ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    : <FiImage className="text-brand-400 text-2xl" />
                  }
                </div>
                <input type="file" accept="image/*" className="hidden" {...register('avatar')}
                  onChange={e => { if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0])); }} />
                <p className="text-xs text-gray-500 text-center mt-1">Photo (optional)</p>
              </label>
            </div>

            {[
              { name: 'name', label: 'Full Name', type: 'text', icon: <FiUser />, placeholder: 'John Doe' },
              { name: 'email', label: 'Email', type: 'email', icon: <FiMail />, placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', icon: <FiLock />, placeholder: '••••••••' },
              { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: <FiLock />, placeholder: '••••••••' },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{f.icon}</span>
                  <input {...register(f.name)} type={f.type} placeholder={f.placeholder} className="input-field pl-9" />
                </div>
                {errors[f.name] && <p className="text-red-400 text-xs mt-1">{errors[f.name].message}</p>}
              </div>
            ))}

            <button type="submit" disabled={mutation.isPending}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2">
              {mutation.isPending
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</>
                : <>Create Account <FiArrowRight /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
