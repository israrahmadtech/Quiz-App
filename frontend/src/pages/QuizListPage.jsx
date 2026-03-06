import { useState } from 'react';
import { useQuizzes } from '../hooks/useQuizzes.js';
import QuizCard from '../components/quiz/QuizCard.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { SkeletonList } from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { HiSearch, HiFilter } from 'react-icons/hi';

const CATEGORIES = ['All', 'Technology', 'Science', 'Mathematics', 'History', 'Geography', 'Sports', 'Entertainment', 'Literature', 'General Knowledge', 'Other'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function QuizListPage() {
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory]     = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data, isLoading, isError, refetch } = useQuizzes({
    page, limit: 9,
    ...(search     && { search }),
    ...(category   && category !== 'All'   && { category }),
    ...(difficulty && difficulty !== 'All' && { difficulty }),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setPage(1);
  };

  const handleDifficulty = (diff) => {
    setDifficulty(diff === 'All' ? '' : diff);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-header">Browse Quizzes</h1>
        <p className="text-slate-400 mt-1">{data?.pagination?.total ?? '...'} quizzes available</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-5">Search</button>
      </form>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><HiFilter size={13}/> Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (cat === 'All' && !category) || cat === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Difficulty</p>
          <div className="flex gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (diff === 'All' && !difficulty) || diff === difficulty
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <SkeletonList count={9} />
      ) : isError ? (
        <ErrorMessage message="Failed to load quizzes" onRetry={refetch} />
      ) : data?.quizzes?.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-lg font-medium text-slate-300">No quizzes found</p>
          <p className="text-sm mt-1">Try different filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.quizzes.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)}
        </div>
      )}

      <Pagination
        page={page}
        pages={data?.pagination?.pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
