export default function ProgressBar({ current, total }) {
  const pct = Math.round(((current) / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Question {current} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="progress-bar-inner h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
