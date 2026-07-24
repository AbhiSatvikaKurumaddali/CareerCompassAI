import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import api from "../api/axios";
import { Compass, TrendingUp, DollarSign, Info } from "lucide-react";

export default function CareerRecommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/careers/recommendations")
      .then((res) => setRecs(res.data.recommendations))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load recommendations."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Career Recommendations">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Ranked by the Career Recommendation Agent based on your skills, interests, and experience.
      </p>

      {loading ? (
        <Loader />
      ) : error ? (
        <GlassCard>
          <p className="text-red-500">{error}</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {recs.map((c, i) => (
            <GlassCard key={c.title} delay={i * 0.05}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white flex-shrink-0">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                    <p className="text-xs text-slate-400">{c.industry}</p>
                  </div>
                </div>
                <span className="badge-pill bg-brand-gradient text-white flex-shrink-0">{c.matchPercentage}% match</span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{c.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <DollarSign size={13} /> ${c.salaryRange.min.toLocaleString()} - ${c.salaryRange.max.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={13} /> {c.growthOutlook}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className={`badge-pill text-[11px] ${
                        c.missingSkills.includes(s)
                          ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                          : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3 flex items-start gap-2">
                <Info size={14} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.explanation.join(" ")}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
