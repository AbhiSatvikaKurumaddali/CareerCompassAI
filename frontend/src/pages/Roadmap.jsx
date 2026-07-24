import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import ProgressBar from "../components/ProgressBar";
import api from "../api/axios";
import { Map, Wand2, CheckSquare, Square, Award, BookOpen } from "lucide-react";

export default function Roadmap() {
  const [careers, setCareers] = useState([]);
  const [selected, setSelected] = useState("");
  const [weeks, setWeeks] = useState(8);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    api.get("/careers/catalog").then((res) => {
      setCareers(res.data.careers);
      if (res.data.careers.length) setSelected(res.data.careers[0].title);
    });
    api.get("/roadmap").then((res) => {
      setRoadmap(res.data.roadmap);
      setLoading(false);
    });
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.post("/roadmap/generate", { targetCareer: selected, durationWeeks: Number(weeks) });
      setRoadmap(res.data.roadmap);
      setActiveWeek(1);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to generate roadmap.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleTask = async (taskId) => {
    const res = await api.patch(`/roadmap/${roadmap._id}/task/${taskId}`);
    setRoadmap(res.data.roadmap);
  };

  if (loading) return <DashboardLayout title="Learning Roadmap"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Learning Roadmap">
      <GlassCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <select className="input-field flex-1" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {careers.map((c) => <option key={c.title} value={c.title}>{c.title}</option>)}
          </select>
          <select className="input-field sm:w-40" value={weeks} onChange={(e) => setWeeks(e.target.value)}>
            {[4, 6, 8, 12].map((w) => <option key={w} value={w}>{w} weeks</option>)}
          </select>
          <button onClick={generate} disabled={generating} className="btn-primary">
            <Wand2 size={16} /> {generating ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
      </GlassCard>

      {!roadmap ? (
        <GlassCard>
          <p className="text-sm text-slate-500 text-center py-8">
            No active roadmap yet. Choose a target career above and generate one.
          </p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Map size={18} className="text-primary-500" /> {roadmap.targetCareer} — {roadmap.durationWeeks} Week Plan
                </h3>
              </div>
              <span className="badge-pill bg-brand-gradient text-white">{roadmap.progressPercent}% done</span>
            </div>
            <ProgressBar percent={roadmap.progressPercent} showLabel={false} />

            {roadmap.certifications?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <Award size={13} /> Recommended Certifications
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.certifications.map((c) => (
                    <span key={c} className="badge-pill bg-accent-500/10 text-accent-600 dark:text-accent-400 text-[11px]">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {roadmap.recommendedProjects?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <BookOpen size={13} /> Recommended Projects
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  {roadmap.recommendedProjects.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
            )}
          </GlassCard>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Week tabs */}
            <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {roadmap.weeks.map((w) => {
                const total = w.tasks.length;
                const done = w.tasks.filter((t) => t.completed).length;
                return (
                  <button
                    key={w.weekNumber}
                    onClick={() => setActiveWeek(w.weekNumber)}
                    className={`flex-shrink-0 text-left rounded-xl px-4 py-3 text-sm transition-colors ${
                      activeWeek === w.weekNumber
                        ? "bg-brand-gradient text-white"
                        : "glass-card text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-semibold">Week {w.weekNumber}</p>
                    <p className={`text-xs ${activeWeek === w.weekNumber ? "text-white/80" : "text-slate-400"}`}>{done}/{total} done</p>
                  </button>
                );
              })}
            </div>

            {/* Active week tasks */}
            <GlassCard className="lg:col-span-3">
              {roadmap.weeks
                .filter((w) => w.weekNumber === activeWeek)
                .map((w) => (
                  <div key={w.weekNumber}>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">{w.focus}</h4>
                    <div className="space-y-2">
                      {w.tasks.map((t) => (
                        <button
                          key={t._id}
                          onClick={() => toggleTask(t._id)}
                          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          {t.completed ? (
                            <CheckSquare size={18} className="text-primary-500 flex-shrink-0" />
                          ) : (
                            <Square size={18} className="text-slate-300 flex-shrink-0" />
                          )}
                          <span className={`text-sm flex-1 ${t.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200"}`}>
                            {t.title}
                          </span>
                          <span className="badge-pill bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] capitalize">
                            {t.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </GlassCard>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
