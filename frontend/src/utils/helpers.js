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

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));

export const formatRelative = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60)   return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return formatDate(date);
};

export const difficultyColor = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
};

export const categoryIcons = {
  Technology:       '💻',
  Science:          '🔬',
  Mathematics:      '🔢',
  History:          '📜',
  Geography:        '🌍',
  Sports:           '⚽',
  Entertainment:    '🎬',
  Literature:       '📚',
  'General Knowledge': '🧠',
  Other:            '📌',
};

export const scoreGrade = (pct) => {
  if (pct >= 90) return { label: 'Outstanding!', color: 'text-emerald-400', emoji: '🏆' };
  if (pct >= 75) return { label: 'Great Job!',   color: 'text-primary-400', emoji: '🌟' };
  if (pct >= 60) return { label: 'Good Work!',   color: 'text-amber-400',   emoji: '👍' };
  if (pct >= 40) return { label: 'Keep Trying!', color: 'text-orange-400',  emoji: '💪' };
  return           { label: 'Need Practice',     color: 'text-red-400',     emoji: '📚' };
};
