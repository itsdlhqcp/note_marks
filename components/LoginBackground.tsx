"use client";

export default function LoginBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      {/* Gradient orbs - soft highlighter colors */}
      <div className="absolute -left-32 -top-32 h-96 w-96 animate-float-slow rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/20" />
      <div className="absolute -right-32 top-1/4 h-80 w-80 animate-float-slower rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/20" />
      <div className="absolute bottom-1/4 -left-24 h-72 w-72 animate-float-slow rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/20" />
      <div className="absolute -right-24 bottom-1/3 h-64 w-64 animate-float-slower rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-500/20" />
      <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 animate-float-slow rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-500/15" />

      {/* Floating note-like shapes */}
      <div className="absolute left-[10%] top-[15%] rotate-[-8deg]">
        <div className="h-24 w-28 animate-float rounded-lg border border-amber-300/50 bg-amber-50/60 shadow-lg dark:border-amber-600/30 dark:bg-amber-950/30" />
      </div>
      <div className="absolute right-[15%] top-[25%] rotate-[6deg]">
        <div className="h-20 w-24 animate-float-delay rounded-lg border border-emerald-300/50 bg-emerald-50/60 shadow-lg dark:border-emerald-600/30 dark:bg-emerald-950/30" />
      </div>
      <div className="absolute bottom-[30%] left-[20%] rotate-[12deg]">
        <div className="h-20 w-28 animate-float-slow rounded-lg border border-sky-300/50 bg-sky-50/60 shadow-lg dark:border-sky-600/30 dark:bg-sky-950/30" />
      </div>
      <div className="absolute bottom-[20%] right-[25%] rotate-[-5deg]">
        <div className="h-24 w-20 animate-float-delay rounded-lg border border-rose-300/50 bg-rose-50/60 shadow-lg dark:border-rose-600/30 dark:bg-rose-950/30" />
      </div>
      <div className="absolute right-[8%] top-[45%] rotate-[-12deg]">
        <div className="h-16 w-20 animate-float rounded-lg border border-violet-300/50 bg-violet-50/60 shadow-lg dark:border-violet-600/30 dark:bg-violet-950/30" />
      </div>
      <div className="absolute left-[15%] bottom-[35%] rotate-[3deg]">
        <div className="h-20 w-24 animate-float-slower rounded-lg border border-amber-300/40 bg-amber-50/50 shadow-md dark:border-amber-600/20 dark:bg-amber-950/20" />
      </div>
    </div>
  );
}
