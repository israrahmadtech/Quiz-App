import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) {
        arr.push(i);
      } else if (arr[arr.length - 1] !== '...') {
        arr.push('...');
      }
    }
    return arr;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronLeft size={18} />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="px-2 text-slate-600">···</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
              p === page
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronRight size={18} />
      </button>
    </div>
  );
}
