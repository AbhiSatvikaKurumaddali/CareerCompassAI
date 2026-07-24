import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import ProgressBar from "../components/ProgressBar";
import api from "../api/axios";
import { Search, Clock, AlertOctagon } from "lucide-react";

const priorityColor = {
  High: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300",
  Medium: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
  Low: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300",
};

export default function SkillGap() {
  const [careers, setCareers] = useState([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/careers/catalog").then((res) => {
      setCareers(res.data.careers);
      if (res.data.careers.length) setSelected(res.data.careers[0].title);
    });
  }, []);

  const analyze = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/skill-gap", { params: { career: selected } });
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to analyze skill gap.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selected) analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <DashboardLayout title="Skill Gap Analysis">
      <GlassCard className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <select
          className="input-field flex-1"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {careers.map((c) => (
            <option key={c.title} value={c.title}>{c.title}</option>
          ))}
        </select>
        <button onClick={analyze} className="btn-primary">
          <Search size={16} /> Analyze
        </button>
      </GlassCard>

      {loading ? (
        <Loader />
      ) : error ? (
        <GlassCard><p className="text-red-500">{error}</p></GlassCard>
      ) : result ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="lg:col-span-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Overview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Target: <strong>{result.targetCareer}</strong></p>
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-1">Readiness</p>
              <ProgressBar percent={result.readinessPercentage} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-white/5 py-3">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{result.currentSkills.length}</p>
                <p className="text-xs text-slate-400">Skills you have</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-white/5 py-3">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{result.missingSkills.length}</p>
                <p className="text-xs text-slate-400">Skills missing</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock size={14} /> Est. {result.totalEstimatedWeeks} weeks to close the gap
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertOctagon size={18} className="text-amber-500" /> Missing Skills
            </h3>
            {result.missingSkills.length === 0 ? (
              <p className="text-sm text-slate-500">You already have all required skills for this career. 🎉</p>
            ) : (
              <div className="space-y-2">
                {result.missingSkills.map((m) => (
                  <div key={m.skill} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3">
                    <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{m.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className={`badge-pill text-[11px] ${priorityColor[m.priority]}`}>{m.priority}</span>
                      <span className="text-xs text-slate-400">~{m.estimatedWeeks}w</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
