import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ChatWidget from "./ChatWidget";

export default function DashboardLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/40 to-accent-400/10 dark:from-slate-950 dark:via-slate-900 dark:to-primary-900/20">
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0">
          <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
          <main className="px-4 pb-10 lg:px-6">{children}</main>
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}
