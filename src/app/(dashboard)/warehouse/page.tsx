"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { downloadZip } from "@/lib/downloadZip";

type Project = {
  id: string;
  name: string;
  idea: string;
  industry: string;
  audience: string;
  features: string[];
  files: any[];
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  Draft: "hsl(215 20% 40%)",
  Testing: "hsl(38 92% 50%)",
  Live: "hsl(142 71% 45%)",
};

export default function WarehousePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("projects").update({ status }).eq("id", id);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleDelete = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold"
          style={{
            background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          Warehouse
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215 20% 65%)" }}>
          All your generated MVPs in one place
        </p>
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="text-center py-16 rounded-xl"
          style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
          <p className="text-4xl mb-4">📦</p>
          <p className="text-sm" style={{ color: "hsl(215 20% 65%)" }}>
            No projects yet! Go to Create to generate your first MVP.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id}
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>

              {/* Project Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-base font-semibold"
                      style={{ color: "hsl(210 40% 98%)" }}>
                      {project.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${statusColors[project.status] || statusColors.Draft}22`,
                        color: statusColors[project.status] || statusColors.Draft,
                      }}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "hsl(215 20% 65%)" }}>
                    {project.industry} • {project.audience} • {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className="rounded-lg px-2 py-1.5 text-xs outline-none"
                    style={{
                      backgroundColor: "hsl(220 47% 8%)",
                      border: "1px solid hsl(217 33% 17%)",
                      color: "hsl(210 40% 98%)",
                    }}>
                    <option>Draft</option>
                    <option>Testing</option>
                    <option>Live</option>
                  </select>

                  {/* Download */}
                  <button
                    onClick={() => downloadZip(project.files, project.name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
                      color: "white",
                    }}>
                    ⬇️ ZIP
                  </button>

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: "hsl(220 47% 8%)",
                      border: "1px solid hsl(217 33% 17%)",
                      color: "hsl(215 20% 65%)",
                    }}>
                    {expandedId === project.id ? "▲ Hide" : "▼ Files"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: "hsl(0 100% 60% / 0.1)",
                      border: "1px solid hsl(0 100% 60% / 0.3)",
                      color: "hsl(0 100% 60%)",
                    }}>
                    🗑️
                  </button>
                </div>
              </div>

              {/* Expanded Files */}
              {expandedId === project.id && (
                <div className="px-5 pb-5"
                  style={{ borderTop: "1px solid hsl(217 33% 17%)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider my-3"
                    style={{ color: "hsl(215 20% 65%)" }}>
                    Generated Files ({project.files?.length || 0})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {project.files?.map((file, i) => (
                      <div key={i}
                        className="flex items-center justify-between px-3 py-2 rounded-lg"
                        style={{ backgroundColor: "hsl(220 47% 8%)", border: "1px solid hsl(217 33% 17%)" }}>
                        <span className="text-xs" style={{ color: "hsl(210 40% 98%)" }}>
                          {file.filename}
                        </span>
                        <span className="text-green-400 text-xs">✅</span>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.features?.map((f) => (
                      <span key={f}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: "hsl(210 100% 56% / 0.1)",
                          color: "hsl(210 100% 56%)",
                          border: "1px solid hsl(210 100% 56% / 0.3)",
                        }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}