"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppShellProps {
  user: User;
  onSignOut: () => void;
  children: React.ReactNode;
}

export default function AppShell({ user, onSignOut, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header
        user={user}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      <Sidebar isOpen={sidebarOpen} onSignOut={onSignOut} />
      <main
        className={`min-h-[calc(100vh-3.5rem)] transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
