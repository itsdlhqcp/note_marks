"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConnectionState = "online" | "offline" | "slow";

export default function NetworkStatus() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("online");

  useEffect(() => {
    const checkConnection = () => {
      if (!navigator.onLine) {
        setConnectionState("offline");
        return;
      }

      const connection =
        (navigator as Navigator & { connection?: { effectiveType?: string } })
          .connection;
      const effectiveType = connection?.effectiveType;

      if (
        effectiveType === "slow-2g" ||
        effectiveType === "2g" ||
        effectiveType === "3g"
      ) {
        setConnectionState("slow");
      } else {
        setConnectionState("online");
      }
    };

    checkConnection();

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    const connection = (navigator as Navigator & { connection?: { addEventListener?: (type: string, fn: () => void) => void; removeEventListener?: (type: string, fn: () => void) => void } }).connection;
    connection?.addEventListener?.("change", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
      connection?.removeEventListener?.("change", checkConnection);
    };
  }, []);

  if (connectionState === "online") return null;

  return (
    <>
      <div
      className={`fixed left-0 right-0 top-0 z-[60] flex items-center justify-between gap-4 px-4 py-3 text-sm ${
        connectionState === "offline"
          ? "bg-red-600 text-white"
          : "bg-amber-500 text-zinc-900"
      }`}
    >
      <div className="flex items-center gap-2">
        {connectionState === "offline" ? (
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M3 3l3.364 3.364m9.272 9.272L21 21M3 21l9-9m-9 9V3"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <span>
          {connectionState === "offline"
            ? "You are offline. Some features may not work."
            : "Slow connection detected. Pages may load slowly."}
        </span>
      </div>
      <Link
        href="/network-slow"
        className="shrink-0 font-medium underline underline-offset-2 hover:no-underline"
      >
        Learn more
      </Link>
    </div>
    <div className="h-12 shrink-0 sm:h-14" aria-hidden />
    </>
  );
}
