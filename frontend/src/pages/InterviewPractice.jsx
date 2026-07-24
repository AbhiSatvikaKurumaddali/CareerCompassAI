import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import api from "../api/axios";
import { MessagesSquare, Send, RotateCcw, Trophy } from "lucide-react";

const sessionTypes = [
  { value: "mixed", label: "Mixed" },
  { value: "technical", label: "Technical" },
  { value: "hr", label: "HR" },
  { value: "behavioral", label: "Behavioral" },
];

export default function InterviewPractice() {
  const [sessionType, setSessionType] = useState("mixed");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const startSession = async () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const res = await api.get("/interview/questions", { params: { type: sessionType, count: sessionType === "mixed" ? 2 : 3 } });
      setQuestions(res.data.questions);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({
        question: q.question,
        category: q.category,
        answer: answers[q.question] || "",
        keywords: q.keywords,
      }));
      const res = await api.post("/interview/submit", { sessionType, answers: payload });
      setResult(res.data.session);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Interview Practice">
      <GlassCard className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <select className="input-field flex-1" value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
          {sessionTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button onClick={startSession} disabled={loading} className="btn-primary">
          <MessagesSquare size={16} /> {loading ? "Loading..." : questions.length ? "New Questions" : "Start Session"}
        </button>
      </GlassCard>

      {loading && <Loader />}

      {!loading && questions.length > 0 && !result && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <GlassCard key={i} delay={i * 0.05}>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-pill bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-[10px] capitalize">{q.category}</span>
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-3">{q.question}</p>
              <textarea
                className="input-field min-h-[100px]"
                placeholder="Type your answer here..."
                value={answers[q.question] || ""}
                onChange={(e) => setAnswers({ ...answers, [q.question]: e.target.value })}
              />
            </GlassCard>
          ))}
          <button onClick={submit} disabled={submitting} className="btn-primary w-full">
            <Send size={16} /> {submitting ? "Evaluating..." : "Submit Answers"}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white">
              <Trophy size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Average Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.averageScore}/10</p>
            </div>
            <button onClick={() => { setQuestions([]); setResult(null); }} className="btn-secondary ml-auto">
              <RotateCcw size={16} /> New Session
            </button>
          </GlassCard>

          {result.answers.map((a, i) => (
            <GlassCard key={i} delay={i * 0.05}>
              <div className="flex items-center justify-between mb-2">
                <span className="badge-pill bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-[10px] capitalize">{a.category}</span>
                <span className="badge-pill bg-brand-gradient text-white text-[11px]">{a.score}/10</span>
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-100 mb-2">{a.question}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 italic">"{a.answer || "(no answer)"}"</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{a.feedback}</p>
              {a.improvementTips?.length > 0 && (
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  {a.improvementTips.map((tip, ti) => <li key={ti}>💡 {tip}</li>)}
                </ul>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {!loading && questions.length === 0 && !result && (
        <GlassCard><p className="text-sm text-slate-500 text-center py-8">Pick a question type and start a mock interview session.</p></GlassCard>
      )}
    </DashboardLayout>
  );
}
