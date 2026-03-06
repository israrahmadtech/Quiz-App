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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">

      {/* background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo + Title */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 font-bold text-2xl text-white">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-lg">
              ⚡
            </div>
            QuizMaster
          </Link>

          <h1 className="text-3xl font-bold text-white mt-6">Create your account</h1>
          <p className="text-slate-400 mt-1">Join thousands of quiz enthusiasts</p>
        </div>

        {/* Card */}
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-slate-700/40 to-slate-800/20">

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-7 border border-slate-800">

            {/* Avatar Picker */}
            <div className="flex justify-center mb-7">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative"
              >
                <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 group-hover:border-primary-500 overflow-hidden flex items-center justify-center transition">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <HiPhotograph size={30} className="text-slate-500 group-hover:text-primary-400" />
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm shadow-lg">
                  +
                </div>
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <p className="text-xs text-center text-slate-500 mb-6">
              Upload profile picture (optional)
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Full Name</label>

                <div className="relative">
                  <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white outline-none transition`}
                    {...register('name')}
                  />
                </div>

                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Email Address</label>

                <div className="relative">
                  <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white outline-none transition`}
                    {...register('email')}
                  />
                </div>

                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Password</label>

                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    className={`w-full bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-700'} focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white outline-none transition`}
                    {...register('password')}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPw ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>

                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Confirm Password</label>

                <div className="relative">
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Repeat password"
                    className={`w-full bg-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg pl-10 py-2.5 text-sm text-white outline-none transition`}
                    {...register('confirmPassword')}
                  />
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 rounded-lg font-semibold bg-gradient-to-r from-primary-500 to-violet-500 hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" /> Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}