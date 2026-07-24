import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import api from "../api/axios";
import { Briefcase, MapPin, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";

export default function JobRecommendations() {
  const [jobs, setJobs] = useState([]);
  const [savedRoles, setSavedRoles] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/jobs/recommendations")
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load job recommendations."))
      .finally(() => setLoading(false));
  }, []);

  const saveJob = async (job) => {
    await api.post("/jobs/save", job);
    setSavedRoles((prev) => new Set(prev).add(job.role + job.company));
  };

  return (
    <DashboardLayout title="Job Recommendations">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Matched by the Job Recommendation Agent based on your current skills.
      </p>

      {loading ? (
        <Loader />
      ) : error ? (
        <GlassCard><p className="text-red-500">{error}</p></GlassCard>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((j, i) => {
            const key = j.role + j.company;
            const saved = savedRoles.has(key);
            return (
              <GlassCard key={i} delay={i * 0.05}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white flex-shrink-0">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{j.role}</h3>
                      <p className="text-xs text-slate-400">{j.company}</p>
                    </div>
                  </div>
                  <span className="badge-pill bg-brand-gradient text-white flex-shrink-0">{j.matchScore}% match</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={13} /> {j.location}</span>
                  {j.salaryRange && <span>{j.salaryRange}</span>}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {j.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className={`badge-pill text-[11px] ${
                          j.matchedSkills.includes(s)
                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                            : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={j.applyLink} target="_blank" rel="noreferrer" className="btn-primary flex-1 !py-2 text-sm">
                    Apply <ExternalLink size={14} />
                  </a>
                  <button onClick={() => saveJob(j)} className="btn-secondary !py-2 !px-3" disabled={saved}>
                    {saved ? <BookmarkCheck size={16} className="text-primary-500" /> : <Bookmark size={16} />}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
