import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiZap, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { loginSchema } from '../utils/schemas.js';
import { loginUser } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 font-bold text-2xl text-white">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg">
              <FiZap />
            </div>
            QuizMaster
          </Link>

          <h1 className="text-3xl font-bold text-white mt-6">Welcome back</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Sign in to continue your quiz journey
          </p>
        </div>

        {/* Card */}
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-slate-700/40 to-slate-800/20">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-7 border border-slate-800">

            <form
              onSubmit={handleSubmit(d => mutation.mutate(d))}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Email
                </label>

                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white outline-none transition`}
                  />
                </div>

                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    {...register('password')}
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-700'} focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white outline-none transition`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 mt-2 rounded-lg font-semibold bg-gradient-to-r from-brand-500 to-violet-500 hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <FiArrowRight />
                  </>
                )}
              </button>

            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-brand-400 hover:text-brand-300 font-semibold"
              >
                Sign up free
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}