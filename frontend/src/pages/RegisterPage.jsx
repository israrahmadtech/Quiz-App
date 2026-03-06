import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerSchema } from '../utils/validationSchemas.js';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiPhotograph } from 'react-icons/hi';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '../components/common/LoadingSpinner.jsx';

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('avatar', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append('name', data.name);
      fd.append('email', data.email);
      fd.append('password', data.password);
      if (data.avatar) fd.append('avatar', data.avatar);

      const user = await authRegister(fd);
      toast.success(`Welcome, ${user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-950">
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-2xl text-white">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-xl">⚡</div>
            QuizMaster
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Create your account</h1>
          <p className="text-slate-500">Join thousands of quiz enthusiasts</p>
        </div>

        <div className="card border-slate-800">
          {/* Avatar picker */}
          <div className="flex justify-center mb-6">
            <button type="button" onClick={() => fileRef.current?.click()} className="group relative">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 group-hover:border-primary-500 overflow-hidden transition-colors flex items-center justify-center">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <HiPhotograph size={28} className="text-slate-500 group-hover:text-primary-400" />}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs">+</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
          <p className="text-xs text-slate-600 text-center -mt-3 mb-5">Click to upload profile picture (optional)</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input type="text" placeholder="John Doe" className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`} {...register('name')} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input type="email" placeholder="you@example.com" className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`} {...register('email')} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`} {...register('password')} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <HiEyeOff size={17} /> : <HiEye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                <input type={showPw ? 'text' : 'password'} placeholder="Repeat password" className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`} {...register('confirmPassword')} />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 mt-2">
              {isSubmitting ? <><Spinner size="sm" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
