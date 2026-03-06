import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiZap, FiArrowRight } from 'react-icons/fi';
import { loginSchema } from '../utils/schemas.js';
import { loginUser } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-white mb-6">
            <span className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <FiZap />
            </span>
            QuizMaster
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">Welcome back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to continue your journey</p>
        </div>

        <div className="card border-white/10">
          <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className="input-field pl-9" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                <input {...register('password')} type="password" placeholder="••••••••"
                  className="input-field pl-9" />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {mutation.isPending ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : (<>Sign In <FiArrowRight /></>)}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
