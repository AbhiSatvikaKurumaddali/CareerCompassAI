export default function Loader({ fullScreen = false, label = "Loading..." }) {
  const wrapperClass = fullScreen
    ? "min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"
    : "flex items-center justify-center py-12";

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 border-r-accent-500 animate-spin" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
