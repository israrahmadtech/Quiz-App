import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../../utils/helpers.js';

export default function QuizTimer({ totalSeconds, onTimeUp, paused = false }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused, onTimeUp]);

  const pct    = (remaining / totalSeconds) * 100;
  const radius = 28;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const color =
    pct > 50 ? 'text-emerald-400' :
    pct > 25 ? 'text-amber-400'   :
               'text-red-400 animate-pulse';

  const strokeColor =
    pct > 50 ? '#10b981' :
    pct > 25 ? '#f59e0b' :
               '#ef4444';

  return (
    <div className={`relative flex items-center justify-center w-16 h-16 ${color}`}>
      <svg width="64" height="64" className="absolute">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#1e293b" strokeWidth="4" />
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="timer-ring"
        />
      </svg>
      <span className="text-sm font-bold font-mono z-10">{formatTime(remaining)}</span>
    </div>
  );
}
