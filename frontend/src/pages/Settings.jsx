import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import { Sun, Moon, Save, User } from "lucide-react";

export default function Settings() {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await api.put("/auth/settings", { name, theme });
      setUser(res.data.user);
      localStorage.setItem("cc_user", JSON.stringify(res.data.user));
      setMessage("Settings saved.");
    } catch (err) {
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-xl space-y-4">
        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-primary-500" /> Account
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Email</label>
              <input className="input-field opacity-60" value={user?.email || ""} disabled />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border transition-colors ${
                theme === "light" ? "bg-brand-gradient text-white border-transparent" : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Sun size={16} /> Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border transition-colors ${
                theme === "dark" ? "bg-brand-gradient text-white border-transparent" : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Moon size={16} /> Dark
            </button>
          </div>
        </GlassCard>

        {message && <p className="text-sm text-primary-600 dark:text-primary-300">{message}</p>}

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </DashboardLayout>
  );
}
