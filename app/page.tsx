"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <button
          onClick={signInWithGoogle}
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p>Welcome, {user.email}</p>
      <button
        onClick={signOut}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </main>
  );
}
