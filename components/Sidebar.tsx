"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
];

export default function Sidebar({
  isOpen,
  navItems = defaultNavItems,
  onSignOut,
}: SidebarProps) {
  const pathname = usePathname();
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
        className={`fixed left-0 top-12 z-30 flex h-[calc(100vh-3rem)] flex-col border-r border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 sm:top-14 sm:h-[calc(100vh-3.5rem)] lg:shadow-none
          w-[280px] max-w-[85vw]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          lg:transition-[width] lg:duration-300 lg:ease-in-out
          ${isOpen ? "lg:w-64" : "lg:w-20 lg:overflow-visible"}
          ${!isOpen ? "pointer-events-none lg:pointer-events-auto" : ""}`}
      >
        <nav className="flex flex-1 flex-col gap-2 p-2 lg:p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isOpen ? item.label : undefined}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 ${
                  isOpen ? "gap-3" : "justify-center"
                } ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <span className={!isOpen ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50" : ""}>
                  {item.icon}
                </span>
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {onSignOut && (
          <div className="border-t border-zinc-200 p-2 dark:border-zinc-800 lg:p-3">
            <button
              onClick={handleLogoutClick}
              title={!isOpen ? "Logout" : undefined}
              className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 ${
                isOpen ? "gap-3" : "justify-center"
              }`}
            >
              <span className={!isOpen ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30" : ""}>
                <LogoutIcon />
              </span>
              {isOpen && <span>Logout</span>}
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
