import { useState, useEffect, useRef } from "react";
import { Menu, Bell, Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      // silent — notifications are non-critical
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    await api.patch("/notifications/all/read");
    fetchNotifications();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden glass-card p-2 rounded-xl">
          <Menu size={20} />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="glass-card p-2.5 rounded-xl text-slate-600 dark:text-slate-200 hover:scale-105 transition-transform"
          title="Toggle dark/light mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative glass-card p-2.5 rounded-xl text-slate-600 dark:text-slate-200 hover:scale-105 transition-transform"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto glass-card rounded-2xl p-3 shadow-glass-lg">
              <div className="flex items-center justify-between px-2 pb-2">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-600 dark:text-primary-300 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-4 text-center">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`rounded-xl px-3 py-2 mb-1 text-sm ${
                      n.isRead ? "opacity-60" : "bg-primary-50 dark:bg-white/5"
                    }`}
                  >
                    <p className="font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="glass-card flex items-center gap-2 rounded-xl px-2.5 py-2 hover:scale-[1.02] transition-transform"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-200">
              {user?.name?.split(" ")[0]}
            </span>
            <ChevronDown size={14} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 glass-card rounded-2xl p-2 shadow-glass-lg">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
