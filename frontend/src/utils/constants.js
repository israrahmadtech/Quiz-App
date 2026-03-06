export const CATEGORIES = [
  'All', 'Technology', 'Science', 'Mathematics', 'History',
  'Geography', 'Sports', 'Entertainment', 'Literature', 'General Knowledge', 'Other',
];

export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const DIFFICULTY_COLORS = {
  Easy:   'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Hard:   'bg-red-500/20 text-red-400 border-red-500/30',
};

export const CATEGORY_ICONS = {
  Technology: '💻', Science: '🔬', Mathematics: '📐', History: '📜',
  Geography: '🌍', Sports: '⚽', Entertainment: '🎬', Literature: '📚',
  'General Knowledge': '🧠', Other: '✨',
};

export const TIME_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};
