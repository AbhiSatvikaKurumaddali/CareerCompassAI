import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import api from "../api/axios";
import { Upload, Plus, X, Sparkles, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

const emptyEdu = { degree: "", institution: "", fieldOfStudy: "", startYear: "", endYear: "" };
const emptyExp = { title: "", company: "", durationMonths: "", description: "" };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const fetchProfile = () => {
    api.get("/profile").then((res) => setProfile(res.data.profile)).finally(() => setLoading(false));
  };

  useEffect(fetchProfile, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await api.put("/profile", {
        headline: profile.headline,
        bio: profile.bio,
        education: profile.education,
        experience: profile.experience,
        interests: profile.interests,
        skills: profile.skills,
        careerGoals: profile.careerGoals,
      });
      setProfile(res.data.profile);
      setMessage("Profile saved successfully.");
    } catch (err) {
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    setUploading(true);
    setMessage("");
    try {
      const res = await api.post("/profile/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.profile);
      setMessage("Resume uploaded and parsed successfully.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Resume upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post("/profile/analyze");
      setProfile((p) => ({ ...p, analysis: res.data.analysis }));
    } catch (err) {
      setMessage("Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setProfile((p) => ({ ...p, skills: [...(p.skills || []), skillInput.trim().toLowerCase()] }));
    setSkillInput("");
  };
  const removeSkill = (s) => setProfile((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  const addInterest = () => {
    if (!interestInput.trim()) return;
    setProfile((p) => ({ ...p, interests: [...(p.interests || []), interestInput.trim().toLowerCase()] }));
    setInterestInput("");
  };
  const removeInterest = (s) => setProfile((p) => ({ ...p, interests: p.interests.filter((x) => x !== s) }));

  const addEducation = () => setProfile((p) => ({ ...p, education: [...(p.education || []), { ...emptyEdu }] }));
  const updateEducation = (i, field, val) => {
    const list = [...profile.education];
    list[i] = { ...list[i], [field]: val };
    setProfile((p) => ({ ...p, education: list }));
  };
  const removeEducation = (i) => setProfile((p) => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));

  const addExperience = () => setProfile((p) => ({ ...p, experience: [...(p.experience || []), { ...emptyExp }] }));
  const updateExperience = (i, field, val) => {
    const list = [...profile.experience];
    list[i] = { ...list[i], [field]: val };
    setProfile((p) => ({ ...p, experience: list }));
  };
  const removeExperience = (i) => setProfile((p) => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));

  if (loading || !profile) return <DashboardLayout title="Profile"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Profile">
      {message && (
        <div className="mb-4 rounded-xl bg-primary-50 dark:bg-white/5 px-4 py-2.5 text-sm text-primary-700 dark:text-primary-300">
          {message}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column: forms */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Basic Info</h3>
            <div className="space-y-3">
              <input
                className="input-field"
                placeholder="Headline (e.g. Aspiring Frontend Developer)"
                value={profile.headline || ""}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              />
              <textarea
                className="input-field min-h-[90px]"
                placeholder="Short bio"
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resume</h3>
            <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} disabled={uploading} className="btn-secondary w-full sm:w-auto">
              <Upload size={16} /> {uploading ? "Uploading..." : "Upload Resume (PDF)"}
            </button>
            {profile.resumeUrl && (
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <FileText size={16} className="text-primary-500" />
                Resume on file — {profile.resumeText ? `${profile.resumeText.split(/\s+/).length} words extracted` : ""}
              </p>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                className="input-field"
                placeholder="e.g. react, sql, communication"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <button onClick={addSkill} className="btn-primary !px-4"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((s) => (
                <span key={s} className="badge-pill bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300">
                  {s} <X size={12} className="cursor-pointer" onClick={() => removeSkill(s)} />
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Interests</h3>
            <div className="flex gap-2 mb-3">
              <input
                className="input-field"
                placeholder="e.g. ai, design, data"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
              />
              <button onClick={addInterest} className="btn-primary !px-4"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.interests || []).map((s) => (
                <span key={s} className="badge-pill bg-accent-500/10 text-accent-600 dark:text-accent-400">
                  {s} <X size={12} className="cursor-pointer" onClick={() => removeInterest(s)} />
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Education</h3>
              <button onClick={addEducation} className="btn-secondary !px-3 !py-1.5 text-xs"><Plus size={14} /> Add</button>
            </div>
            <div className="space-y-3">
              {(profile.education || []).map((edu, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-white/10 p-3 space-y-2 relative">
                  <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input className="input-field" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                    <input className="input-field" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                    <input className="input-field" placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => updateEducation(i, "fieldOfStudy", e.target.value)} />
                    <div className="flex gap-2">
                      <input type="number" className="input-field" placeholder="Start Year" value={edu.startYear} onChange={(e) => updateEducation(i, "startYear", e.target.value)} />
                      <input type="number" className="input-field" placeholder="End Year" value={edu.endYear} onChange={(e) => updateEducation(i, "endYear", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              {(!profile.education || profile.education.length === 0) && (
                <p className="text-sm text-slate-400">No education added yet.</p>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Experience</h3>
              <button onClick={addExperience} className="btn-secondary !px-3 !py-1.5 text-xs"><Plus size={14} /> Add</button>
            </div>
            <div className="space-y-3">
              {(profile.experience || []).map((exp, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-white/10 p-3 space-y-2 relative">
                  <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input className="input-field" placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(i, "title", e.target.value)} />
                    <input className="input-field" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                    <input type="number" className="input-field" placeholder="Duration (months)" value={exp.durationMonths} onChange={(e) => updateExperience(i, "durationMonths", e.target.value)} />
                  </div>
                  <textarea className="input-field" placeholder="Description" value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
                </div>
              ))}
              {(!profile.experience || profile.experience.length === 0) && (
                <p className="text-sm text-slate-400">No experience added yet.</p>
              )}
            </div>
          </GlassCard>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* Right column: analysis */}
        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Profile Analyzer Agent</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Run analysis to extract skills, strengths, weaknesses, and your career readiness score.
            </p>
            <button onClick={runAnalysis} disabled={analyzing} className="btn-primary w-full mb-4">
              {analyzing ? "Analyzing..." : "Run Analysis"}
            </button>

            {profile.analysis?.careerReadinessScore != null && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-extrabold gradient-text">{profile.analysis.careerReadinessScore}</p>
                  <p className="text-xs text-slate-400">Career Readiness Score</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Extracted Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.analysis.extractedSkills?.map((s) => (
                      <span key={s} className="badge-pill bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-[11px]">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> Strengths</p>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    {profile.analysis.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><AlertTriangle size={12} className="text-amber-500" /> Weaknesses</p>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    {profile.analysis.weaknesses?.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
