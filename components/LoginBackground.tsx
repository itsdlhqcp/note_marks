"use client";

export default function LoginBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      {/* Gradient orbs - smaller on mobile */}
      <div className="absolute -left-24 -top-24 h-48 w-48 animate-float-slow rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/20 sm:-left-32 sm:-top-32 sm:h-96 sm:w-96" />
      <div className="absolute -right-24 top-1/4 h-40 w-40 animate-float-slower rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/20 sm:-right-32 sm:h-80 sm:w-80" />
      <div className="absolute bottom-1/4 -left-16 h-36 w-36 animate-float-slow rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/20 sm:-left-24 sm:h-72 sm:w-72" />
      <div className="absolute -right-16 bottom-1/3 h-32 w-32 animate-float-slower rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-500/20 sm:-right-24 sm:h-64 sm:w-64" />
      <div className="absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 animate-float-slow rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-500/15 sm:h-48 sm:w-48" />

      {/* Floating note-like shapes - fewer/smaller on mobile */}
      <div className="absolute left-[5%] top-[12%] hidden rotate-[-8deg] sm:block">
        <div className="h-16 w-20 animate-float rounded-lg border border-amber-300/50 bg-amber-50/60 shadow-lg dark:border-amber-600/30 dark:bg-amber-950/30 sm:h-24 sm:w-28" />
      </div>
      <div className="absolute right-[8%] top-[20%] rotate-[6deg]">
        <div className="h-12 w-14 animate-float-delay rounded-lg border border-emerald-300/50 bg-emerald-50/60 shadow-lg dark:border-emerald-600/30 dark:bg-emerald-950/30 sm:h-20 sm:w-24" />
      </div>
      <div className="absolute bottom-[25%] left-[10%] hidden rotate-[12deg] sm:block">
        <div className="h-20 w-28 animate-float-slow rounded-lg border border-sky-300/50 bg-sky-50/60 shadow-lg dark:border-sky-600/30 dark:bg-sky-950/30" />
      </div>
      <div className="absolute bottom-[18%] right-[15%] rotate-[-5deg]">
        <div className="h-14 w-12 animate-float-delay rounded-lg border border-rose-300/50 bg-rose-50/60 shadow-lg dark:border-rose-600/30 dark:bg-rose-950/30 sm:h-24 sm:w-20" />
      </div>
      <div className="absolute right-[5%] top-[40%] hidden rotate-[-12deg] sm:block">
        <div className="h-16 w-20 animate-float rounded-lg border border-violet-300/50 bg-violet-50/60 shadow-lg dark:border-violet-600/30 dark:bg-violet-950/30" />
      </div>
      <div className="absolute left-[8%] bottom-[30%] hidden rotate-[3deg] sm:block">
        <div className="h-20 w-24 animate-float-slower rounded-lg border border-amber-300/40 bg-amber-50/50 shadow-md dark:border-amber-600/20 dark:bg-amber-950/20" />
      </div>
    </div>
  );
}
