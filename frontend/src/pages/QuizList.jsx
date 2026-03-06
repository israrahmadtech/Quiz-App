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

  const params = {
    page, limit: 9, search: search || undefined,
    category: category !== 'All' ? category : undefined,
    difficulty: difficulty !== 'All' ? difficulty : undefined
  };

  const { data, isLoading, isError } = useQuizzes(params);

  const handleFilter = (setter) => (v) => { setter(v); setPage(1) };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Explore Quizzes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Find the perfect challenge for you
          </p>
        </div>

        {data && (
          <p className="text-sm text-gray-500">
            <span className="text-white font-semibold">{data.pagination.total}</span> quizzes available
          </p>
        )}
      </div>


      {/* Search + Filters */}
      <div className="card flex flex-col md:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            value={search}
            onChange={e => handleFilter(setSearch)(e.target.value)}
            placeholder="Search quizzes..."
            className="input-field pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">

          <select
            value={category}
            onChange={e => handleFilter(setCategory)(e.target.value)}
            className="input-field w-auto pr-8 cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={e => handleFilter(setDifficulty)(e.target.value)}
            className="input-field w-auto pr-8 cursor-pointer"
          >
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

        </div>
      </div>


      {/* Active filters */}
      {(category !== 'All' || difficulty !== 'All') && (
        <div className="flex items-center flex-wrap gap-2 text-sm">

          <div className="flex items-center gap-1 text-gray-500">
            <FiFilter />
            <span>Active filters:</span>
          </div>

          {category !== 'All' && (
            <span className="px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs">
              {category}
            </span>
          )}

          {difficulty !== 'All' && (
            <span className="px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs">
              {difficulty}
            </span>
          )}

          <button
            onClick={() => {
              setCategory('All')
              setDifficulty('All')
            }}
            className="text-xs text-gray-500 hover:text-white transition-colors ml-2"
          >
            Clear
          </button>

        </div>
      )}


      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Failed to load quizzes"
          description="Please try again later."
        />
      ) : data?.quizzes?.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No quizzes found"
          description="Try different search terms or filters."
        />
      ) : (
        <>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.quizzes.map(q => (
              <QuizCard key={q._id} quiz={q} />
            ))}
          </div>


          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">

              <button
                onClick={() => setPage(p => p - 1)}
                disabled={!data.pagination.hasPrevPage}
                className="btn-secondary p-2 disabled:opacity-30"
              >
                <FiChevronLeft />
              </button>

              {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
${p === page
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'btn-secondary'
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!data.pagination.hasNextPage}
                className="btn-secondary p-2 disabled:opacity-30"
              >
                <FiChevronRight />
              </button>

            </div>
          )}

        </>
      )}

    </div>
  );
}