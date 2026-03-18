"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!fullName || !email || !password) return setError("Please fill in all fields!");
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "hsl(220 47% 8%)" }}>
      <div className="w-full max-w-sm rounded-2xl p-8"
        style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>

        <button onClick={() => router.back()}
          className="mb-6 text-sm"
          style={{ color: "hsl(215 20% 65%)" }}>
          ← Back
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ background: "linear-gradient(135deg, hsl(210 100% 56%), hsl(142 71% 45%))" }}>
            👤
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6"
          style={{ color: "hsl(210 100% 56%)" }}>
          Join Grace
        </h1>

        {error && (
          <p className="text-sm text-red-400 mb-4 text-center">{error}</p>
        )}

        <div className="space-y-4 mb-6">
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg p-3 text-sm outline-none"
            style={{
              backgroundColor: "hsl(220 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg p-3 text-sm outline-none"
            style={{
              backgroundColor: "hsl(220 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg p-3 text-sm outline-none"
            style={{
              backgroundColor: "hsl(220 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-sm mb-4"
          style={{
            background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
            color: "white",
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm"
          style={{ color: "hsl(215 20% 65%)" }}>
          Already have an account?{" "}
          <Link href="/login"
            style={{ color: "hsl(210 100% 56%)" }}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}