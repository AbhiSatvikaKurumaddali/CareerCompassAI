import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import ScoreRing from "../components/ScoreRing";
import Loader from "../components/Loader";
import api from "../api/axios";
import { FileSearch, Lightbulb } from "lucide-react";

export default function ResumeReview() {
  const [careers, setCareers] = useState([]);
  const [selected, setSelected] = useState("");
  const [review, setReview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/careers/catalog").then((res) => {
      setCareers(res.data.careers);
      if (res.data.careers.length) setSelected(res.data.careers[0].title);
    });
    api.get("/resume/history").then((res) => setHistory(res.data.reviews));
  }, []);

  const runReview = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/resume/review", { targetCareer: selected });
      setReview(res.data.review);
      setHistory((h) => [res.data.review, ...h]);
    } catch (err) {
      setError(err?.response?.data?.message || "Resume review failed. Upload a resume in your Profile first.");
    } finally {
      setLoading(false);
    }
  };

  const scoreRows = review
    ? [
        { label: "ATS Score", value: review.atsScore },
        { label: "Keyword Match", value: review.keywordScore },
        { label: "Formatting", value: review.formattingScore },
        { label: "Grammar", value: review.grammarScore },
        { label: "Project Descriptions", value: review.projectDescriptionScore },
      ]
    : [];

  return (
    <DashboardLayout title="Resume Review">
      <GlassCard className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <select className="input-field flex-1" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {careers.map((c) => <option key={c.title} value={c.title}>{c.title}</option>)}
        </select>
        <button onClick={runReview} disabled={loading} className="btn-primary">
          <FileSearch size={16} /> {loading ? "Reviewing..." : "Run Resume Review"}
        </button>
      </GlassCard>

      {error && <GlassCard className="mb-6"><p className="text-red-500 text-sm">{error}</p></GlassCard>}

      {loading ? (
        <Loader />
      ) : review ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <GlassCard className="flex flex-col items-center justify-center">
            <ScoreRing score={review.overallScore} size={130} strokeWidth={10} label="Overall Score" />
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {scoreRows.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{r.label}</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{r.value}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${r.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-3">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" /> Suggestions
            </h3>
            <ul className="space-y-2">
              {review.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            {review.missingKeywords?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Missing Keywords for {selected}</p>
                <div className="flex flex-wrap gap-1.5">
                  {review.missingKeywords.map((k) => (
                    <span key={k} className="badge-pill bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px]">{k}</span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      ) : (
        <GlassCard><p className="text-sm text-slate-500 text-center py-8">Run a resume review to see your ATS score and suggestions.</p></GlassCard>
      )}

      {history.length > 0 && (
        <GlassCard className="mt-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Review History</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((h) => (
              <div key={h._id} className="flex items-center justify-between text-sm rounded-xl px-3 py-2 bg-slate-50 dark:bg-white/5">
                <span className="text-slate-500 dark:text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</span>
                <span className="font-semibold text-slate-800 dark:text-white">{h.overallScore}/100</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </DashboardLayout>
  );
}
