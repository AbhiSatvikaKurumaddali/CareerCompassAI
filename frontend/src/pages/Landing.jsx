import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  BarChart3,
  Map,
  FileText,
  MessagesSquare,
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  { icon: Compass, title: "Career Recommendations", desc: "Get ranked career matches based on your skills, interests, and experience — with explainable reasoning." },
  { icon: BarChart3, title: "Skill Gap Analysis", desc: "See exactly which skills you're missing for your target role, prioritized by impact." },
  { icon: Map, title: "Learning Roadmap", desc: "A personalized week-by-week plan with courses, certifications, and projects." },
  { icon: FileText, title: "Resume Review", desc: "ATS scoring, keyword matching, and actionable formatting suggestions." },
  { icon: MessagesSquare, title: "AI Mock Interviews", desc: "Practice technical, HR, and behavioral questions with instant scored feedback." },
  { icon: Briefcase, title: "Job Matching", desc: "Discover roles that fit your skills with transparent match scores." },
];

const steps = [
  "Create your profile & upload your resume",
  "Get AI-driven career recommendations",
  "Close your skill gaps with a personalized roadmap",
  "Practice interviews and polish your resume",
  "Track your progress and land the job",
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-primary-50 to-accent-400/10 dark:from-slate-950 dark:via-slate-900 dark:to-primary-900/30">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-400/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-accent-500/25 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary-600/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-extrabold gradient-text">CareerCompass AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary !px-4 !py-2 text-sm">Log In</Link>
          <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300 mb-6"
        >
          <Sparkles size={14} /> Agentic AI Career Advisor
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Find your career path with <span className="gradient-text">confidence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          CareerCompass AI analyzes your skills, resume, and interests to recommend careers, close skill
          gaps, build learning roadmaps, sharpen your resume, and prep you for interviews — all in one place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary text-base">
            Start Your Journey <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base">
            I already have an account
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <h2 className="section-title text-center mb-2">Everything you need to plan your career</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-12">
          Eight specialized AI agents working together for you.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card-hover p-6"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <div className="glass-card p-8 sm:p-10">
          <h2 className="section-title mb-8 text-center">How it works</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  {i + 1}
                </div>
                <p className="text-slate-700 dark:text-slate-200">{step}</p>
                <CheckCircle2 size={18} className="ml-auto text-primary-400 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="glass-card bg-brand-gradient !bg-none rounded-3xl p-10 sm:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gradient opacity-90 rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">Ready to chart your course?</h2>
            <p className="text-white/85 mb-8">Join CareerCompass AI free and get your first career readiness score in minutes.</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary-700 shadow-lg hover:scale-[1.02] transition-transform"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} CareerCompass AI. Built for students and job seekers everywhere.
      </footer>
    </div>
  );
}
