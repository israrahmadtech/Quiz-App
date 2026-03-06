import { useState } from 'react';
import { useQuizzes } from '../hooks/useQuizzes.js';
import QuizCard from '../components/common/QuizCard.jsx';
import Spinner from '../components/common/Spinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { CATEGORIES, DIFFICULTIES } from '../utils/constants.js';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function QuizList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [page, setPage] = useState(1);

  const params = { page, limit: 9, search: search || undefined,
    category: category !== 'All' ? category : undefined,
    difficulty: difficulty !== 'All' ? difficulty : undefined };

  const { data, isLoading, isError } = useQuizzes(params);

  const handleFilter = (setter) => (v) => { setter(v); setPage(1); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Explore Quizzes</h1>
        <p className="text-gray-500 text-sm mt-1">Find the perfect challenge for you</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input value={search} onChange={e => handleFilter(setSearch)(e.target.value)}
            placeholder="Search quizzes..." className="input-field pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={category} onChange={e => handleFilter(setCategory)(e.target.value)}
            className="input-field w-auto pr-8 cursor-pointer">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={difficulty} onChange={e => handleFilter(setDifficulty)(e.target.value)}
            className="input-field w-auto pr-8 cursor-pointer">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(category !== 'All' || difficulty !== 'All') && (
        <div className="flex items-center gap-2 text-sm">
          <FiFilter className="text-gray-500" />
          {category !== 'All' && <span className="badge bg-brand-600/20 text-brand-400 border border-brand-500/30">{category}</span>}
          {difficulty !== 'All' && <span className="badge bg-brand-600/20 text-brand-400 border border-brand-500/30">{difficulty}</span>}
          <button onClick={() => { setCategory('All'); setDifficulty('All'); }} className="text-gray-500 hover:text-white text-xs">Clear</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : isError ? (
        <EmptyState icon="⚠️" title="Failed to load quizzes" description="Please try again later." />
      ) : data?.quizzes?.length === 0 ? (
        <EmptyState icon="🔍" title="No quizzes found" description="Try different search terms or filters." />
      ) : (
        <>
          <p className="text-gray-500 text-sm">{data.pagination.total} quizzes found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.quizzes.map(q => <QuizCard key={q._id} quiz={q} />)}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => p - 1)} disabled={!data.pagination.hasPrevPage}
                className="btn-secondary p-2 disabled:opacity-30"><FiChevronLeft /></button>
              {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-brand-600 text-white' : 'btn-secondary'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={!data.pagination.hasNextPage}
                className="btn-secondary p-2 disabled:opacity-30"><FiChevronRight /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
