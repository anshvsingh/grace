"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setFullName(user.user_metadata?.full_name || "");
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "hsl(210 100% 56%)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold"
          style={{
            background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          Account
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215 20% 65%)" }}>
          Manage your Grace account
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-xl mb-4"
        style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: "linear-gradient(135deg, hsl(210 100% 56%), hsl(142 71% 45%))" }}>
            {fullName?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div>
            <p className="font-semibold" style={{ color: "hsl(210 40% 98%)" }}>
              {fullName || "Grace User"}
            </p>
            <p className="text-sm" style={{ color: "hsl(215 20% 65%)" }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block"
            style={{ color: "hsl(215 20% 65%)" }}>
            Full Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg p-3 text-sm outline-none"
            style={{
              backgroundColor: "hsl(220 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
        </div>

        {/* Email (readonly) */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block"
            style={{ color: "hsl(215 20% 65%)" }}>
            Email Address
          </label>
          <input
            value={user?.email || ""}
            disabled
            className="w-full rounded-lg p-3 text-sm outline-none opacity-50"
            style={{
              backgroundColor: "hsl(220 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-lg font-semibold text-sm"
          style={{
            background: saved
              ? "hsl(142 71% 45%)"
              : "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
            color: "white",
            opacity: saving ? 0.7 : 1,
          }}>
          {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 rounded-xl"
        style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: "hsl(210 40% 98%)" }}>
          Sign Out
        </h2>
        <p className="text-xs mb-4" style={{ color: "hsl(215 20% 65%)" }}>
          You will be redirected to the login page.
        </p>
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-lg font-semibold text-sm"
          style={{
            backgroundColor: "hsl(0 100% 60% / 0.1)",
            border: "1px solid hsl(0 100% 60% / 0.3)",
            color: "hsl(0 100% 60%)",
          }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}