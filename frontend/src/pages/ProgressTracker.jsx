import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import ScoreRing from "../components/ScoreRing";
import ProgressBar from "../components/ProgressBar";
import Loader from "../components/Loader";
import api from "../api/axios";
import { Award, TrendingUp } from "lucide-react";

export default function ProgressTracker() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/progress").then((res) => setProgress(res.data.progress)).finally(() => setLoading(false));
  }, []);

  if (loading || !progress) return <DashboardLayout title="Progress Tracker"><Loader /></DashboardLayout>;

  const resumeChartData = progress.resumeScoreTrend.map((r, i) => ({
    name: `#${i + 1}`,
    score: r.score,
  }));
  const interviewChartData = progress.interviewScoreTrend.map((r, i) => ({
    name: `#${i + 1}`,
    score: r.score,
  }));

  return (
    <DashboardLayout title="Progress Tracker">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <GlassCard className="flex flex-col items-center">
          <ScoreRing score={progress.careerReadinessScore} size={90} strokeWidth={7} label="Career Readiness" />
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Roadmap Progress</p>
          <ProgressBar percent={progress.roadmapProgressPercent} />
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Skills Learned</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{progress.skillsLearnedCount}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Badges Earned</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{progress.badges.length}</p>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" /> Resume Score Trend
          </h3>
          {resumeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={resumeChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#5b5cf5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 py-16 text-center">No resume reviews yet.</p>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-accent-500" /> Interview Score Trend
          </h3>
          {interviewChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={interviewChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#a267fb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 py-16 text-center">No interview sessions yet.</p>
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award size={18} className="text-amber-500" /> Achievement Badges
        </h3>
        {progress.badges.length === 0 ? (
          <p className="text-sm text-slate-400">Complete roadmap tasks, resume reviews, and interviews to earn badges.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {progress.badges.map((b) => (
              <div key={b.name} className="rounded-xl bg-brand-gradient-soft border border-primary-200/50 dark:border-white/10 p-4 text-center">
                <Award size={22} className="mx-auto text-accent-500 mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{b.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{b.description}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </DashboardLayout>
  );
}
