"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  name: string;
  status: string;
  created_at: string;
};

type User = {
  full_name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setUser({
        full_name: user.user_metadata?.full_name || "Builder",
        email: user.email || "",
      });

      // Get projects
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      setProjects(projects || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const statusColors: Record<string, string> = {
    Draft: "hsl(215 20% 40%)",
    Testing: "hsl(38 92% 50%)",
    Live: "hsl(142 71% 45%)",
  };

  const stats = [
    { label: "TOTAL MVPS", value: projects.length.toString(), icon: "🧩" },
    { label: "DEPLOYMENTS", value: "0", icon: "🚀" },
    { label: "GITHUB PUSHED", value: "0", icon: "🐙" },
    { label: "REVENUE", value: "₹0", icon: "💰" },
    { label: "MRR", value: "₹0", icon: "📈" },
    { label: "ARR", value: "₹0", icon: "📊" },
    { label: "AI COST", value: "₹0.01", icon: "🤖" },
    { label: "RETENTION", value: "0%", icon: "🔄" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "hsl(210 100% 56%)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold"
            style={{
              background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(215 20% 65%)" }}>
            Your AI SaaS control center
          </p>
        </div>
        <button
          onClick={() => router.push("/create")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
          style={{
            background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
            color: "white"
          }}>
          🚀 Launch New MVP
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label}
            className="p-5 rounded-xl"
            style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "hsl(215 20% 65%)" }}>
              {stat.icon} {stat.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: "hsl(210 100% 56%)" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="rounded-xl p-6"
        style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "hsl(210 40% 98%)" }}>
          Recent Projects
        </h2>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: "hsl(215 20% 65%)" }}>
              No projects yet! Click "Launch New MVP" to get started 🚀
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(217 33% 17%)" }}>
                <th className="text-left pb-3 text-sm font-medium" style={{ color: "hsl(215 20% 65%)" }}>Project</th>
                <th className="text-left pb-3 text-sm font-medium" style={{ color: "hsl(215 20% 65%)" }}>Status</th>
                <th className="text-left pb-3 text-sm font-medium" style={{ color: "hsl(215 20% 65%)" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}
                  style={{ borderBottom: "1px solid hsl(217 33% 17%)" }}>
                  <td className="py-3 text-sm" style={{ color: "hsl(210 40% 98%)" }}>
                    {project.name}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${statusColors[project.status] || statusColors.Draft}22`,
                        color: statusColors[project.status] || statusColors.Draft,
                      }}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm" style={{ color: "hsl(215 20% 65%)" }}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}