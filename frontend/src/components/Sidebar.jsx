import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Compass,
  BarChart3,
  Map,
  FileText,
  MessagesSquare,
  Briefcase,
  TrendingUp,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/careers", label: "Career Recommendations", icon: Compass },
  { to: "/skill-gap", label: "Skill Gap Analysis", icon: BarChart3 },
  { to: "/roadmap", label: "Learning Roadmap", icon: Map },
  { to: "/resume", label: "Resume Review", icon: FileText },
  { to: "/interview", label: "Interview Practice", icon: MessagesSquare },
  { to: "/jobs", label: "Job Recommendations", icon: Briefcase },
  { to: "/progress", label: "Progress Tracker", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
        glass-card rounded-none lg:rounded-2xl lg:m-4 lg:h-[calc(100vh-2rem)] flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary-600/30">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-lg font-extrabold gradient-text">CareerCompass</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-gradient text-white shadow-md shadow-primary-600/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 text-xs text-slate-400 dark:text-slate-500">
          CareerCompass AI v1.0 &middot; Agentic Career Advisor
        </div>
      </aside>
    </>
  );
}
