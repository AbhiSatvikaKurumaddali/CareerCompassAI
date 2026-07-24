export default function ProgressBar({ percent = 0, className = "", showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={className}>
      <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-gradient transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{clamped}% complete</p>}
    </div>
  );
}
