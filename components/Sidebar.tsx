"use client";

import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  navItems?: NavItem[];
  onSignOut?: () => void;
}

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const NotesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const defaultNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <HomeIcon /> },
  { label: "Notes", href: "/notes", icon: <NotesIcon /> },
  { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
];

export default function Sidebar({
  isOpen,
  navItems = defaultNavItems,
  onSignOut,
}: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = () => {
    onSignOut?.();
    setShowLogoutConfirm(false);
  };
  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  return (
    <>
      <aside
        className={`fixed left-0 top-12 z-30 flex h-[calc(100vh-3rem)] flex-col border-r border-zinc-200 bg-white shadow-lg transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 sm:top-14 sm:h-[calc(100vh-3.5rem)] lg:shadow-none ${
          isOpen
            ? "w-full max-w-[280px] sm:max-w-none sm:w-72 lg:w-64"
            : "w-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        {onSignOut && (
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <button
              onClick={handleLogoutClick}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleLogoutCancel}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
              Log out?
            </h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
              Are you sure you want to log out of your account?
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
