"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppShellProps {
  user: User;
  onSignOut: () => void;
  children: React.ReactNode;
}

export default function AppShell({ user, onSignOut, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) setSidebarOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header
        user={user}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <Sidebar isOpen={sidebarOpen} onSignOut={onSignOut} />
      <main
        className={`min-h-[calc(100vh-3rem)] transition-all duration-300 sm:min-h-[calc(100vh-3.5rem)] ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
