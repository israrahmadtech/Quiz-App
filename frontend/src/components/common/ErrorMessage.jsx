import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <HiExclamationCircle size={32} className="text-red-400" />
      </div>
      <div>
        <p className="text-white font-semibold text-lg">Oops!</p>
        <p className="text-slate-400 text-sm mt-1">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm gap-2">
          <HiRefresh size={16} /> Try Again
        </button>
      )}
    </div>
  );
}
