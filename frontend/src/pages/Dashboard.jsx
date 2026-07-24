import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import ScoreRing from "../components/ScoreRing";
import ProgressBar from "../components/ProgressBar";
import Loader from "../components/Loader";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Compass,
  BarChart3,
  Map,
  FileText,
  MessagesSquare,
  Briefcase,
  ArrowRight,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/progress/dashboard")
      .then((res) => setData(res.data.dashboard))
      .catch(() => setError("Couldn't load your dashboard right now."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="Dashboard"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title={`Welcome back, ${user?.name?.split(" ")[0] || "there"} 👋`}>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Top stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-2">
        <GlassCard className="flex items-center gap-4">
          <ScoreRing score={data?.careerReadinessScore || 0} size={72} strokeWidth={6} />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Career Readiness</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {data?.careerReadinessScore || 0}/100
            </p>
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Recommended Career</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {data?.recommendedCareer?.title || "Complete your profile"}
          </p>
          {data?.recommendedCareer && (
            <p className="text-xs text-primary-600 dark:text-primary-300 mt-1">
              {data.recommendedCareer.matchPercentage}% match
            </p>
          )}
        </GlassCard>

        <GlassCard delay={0.1}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Skill Gap</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {data?.skillGapPercentage != null ? `${data.skillGapPercentage}%` : "—"}
          </p>
          <p className="text-xs text-slate-400 mt-1">for recommended career</p>
        </GlassCard>

        <GlassCard delay={0.15}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Roadmap Progress</p>
          <ProgressBar percent={data?.roadmapProgressPercent || 0} />
        </GlassCard>
      </div>

      {/* Second row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        <GlassCard delay={0.05}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Resume Score</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {data?.resumeScore != null ? `${data.resumeScore}/100` : "Not reviewed"}
          </p>
          <Link to="/resume" className="text-xs text-primary-600 dark:text-primary-300 hover:underline flex items-center gap-1 mt-2">
            Review resume <ArrowRight size={12} />
          </Link>
        </GlassCard>

        <GlassCard delay={0.1}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Interview Score</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {data?.interviewScore != null ? `${data.interviewScore}/10` : "Not attempted"}
          </p>
          <Link to="/interview" className="text-xs text-primary-600 dark:text-primary-300 hover:underline flex items-center gap-1 mt-2">
            Practice interview <ArrowRight size={12} />
          </Link>
        </GlassCard>

        <GlassCard delay={0.15}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Job Matches</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{data?.jobMatches?.length || 0} found</p>
          <Link to="/jobs" className="text-xs text-primary-600 dark:text-primary-300 hover:underline flex items-center gap-1 mt-2">
            View matches <ArrowRight size={12} />
          </Link>
        </GlassCard>
      </div>

      {/* Today's tasks + Job matches */}
      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        <GlassCard delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Today's Learning Tasks</h3>
            <Map size={18} className="text-primary-500" />
          </div>
          {data?.todaysTasks?.length ? (
            <ul className="space-y-2">
              {data.todaysTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-primary-400 flex-shrink-0" />
                  {t.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No active roadmap yet. Generate one to get started.</p>
          )}
          <Link to="/roadmap" className="btn-secondary mt-4 w-full text-sm">
            Go to Roadmap
          </Link>
        </GlassCard>

        <GlassCard delay={0.15}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Top Job Matches</h3>
            <Briefcase size={18} className="text-primary-500" />
          </div>
          {data?.jobMatches?.length ? (
            <ul className="space-y-3">
              {data.jobMatches.map((j, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{j.role}</p>
                    <p className="text-xs text-slate-400">{j.company}</p>
                  </div>
                  <span className="badge-pill bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300">
                    {j.matchScore}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Complete your profile to see job matches.</p>
          )}
          <Link to="/jobs" className="btn-secondary mt-4 w-full text-sm">
            View All Jobs
          </Link>
        </GlassCard>
      </div>

      {/* Badges */}
      {data?.badges?.length > 0 && (
        <GlassCard delay={0.2} className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-accent-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Achievement Badges</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.badges.map((b) => (
              <span
                key={b.name}
                title={b.description}
                className="badge-pill bg-brand-gradient text-white"
              >
                <Award size={12} /> {b.name}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {[
          { to: "/careers", icon: Compass, label: "Explore Careers" },
          { to: "/skill-gap", icon: BarChart3, label: "Analyze Skill Gap" },
          { to: "/resume", icon: FileText, label: "Improve Resume" },
        ].map((q) => (
          <Link key={q.to} to={q.to}>
            <GlassCard className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <q.icon size={18} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{q.label}</span>
              <ArrowRight size={16} className="ml-auto text-slate-400" />
            </GlassCard>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
