"use client";

import { useState } from "react";

type Project = {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
  netlifyStatus: "idle" | "connecting" | "live";
  githubStatus: "idle" | "connecting" | "pushed";
};

const mockProjects: Project[] = [
  {
    id: "1",
    name: "FinPilot — Finance Tracking AI Assistant",
    prompt: "An AI-based assistant that automatically categorizes income/expenses and forecasts cash flow.",
    createdAt: "3/18/2026",
    netlifyStatus: "idle",
    githubStatus: "idle",
  },
  {
    id: "2",
    name: "ArtHive — Digital Art Portfolio",
    prompt: "A personal branded storefront portfolio marketplace for artists to sell or showcase their work.",
    createdAt: "3/18/2026",
    netlifyStatus: "idle",
    githubStatus: "idle",
  },
  {
    id: "3",
    name: "RecruitAI — Automated Candidate Screener",
    prompt: "Upload resumes or link a job post and get an AI-screened shortlist with skill matching.",
    createdAt: "3/18/2026",
    netlifyStatus: "live",
    githubStatus: "idle",
  },
  {
    id: "4",
    name: "FitBuddy — Personalized AI Fitness Planner",
    prompt: "An AI-generated fitness planner based on goals, equipment, and schedule.",
    createdAt: "3/18/2026",
    netlifyStatus: "idle",
    githubStatus: "pushed",
  },
];

export default function ProductionPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const handleNetlify = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, netlifyStatus: p.netlifyStatus === "live" ? "live" : "connecting" }
          : p
      )
    );
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, netlifyStatus: "live" } : p))
      );
    }, 2000);
  };

  const handleGithub = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, githubStatus: "connecting" }
          : p
      )
    );
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, githubStatus: "pushed" } : p))
      );
    }, 2000);
  };

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
          Deployments Center
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215 20% 65%)" }}>
          Manage and deploy all your generated MVPs
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id}
            className="p-5 rounded-xl"
            style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>

            {/* Project Name */}
            <h2 className="text-base font-semibold mb-1"
              style={{ color: "hsl(210 100% 56%)" }}>
              {project.name}
            </h2>
            <p className="text-xs mb-1" style={{ color: "hsl(215 20% 50%)" }}>
              Created: {project.createdAt}
            </p>

            {/* Prompt */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase mb-1"
                style={{ color: "hsl(215 20% 65%)" }}>
                Prompt
              </p>
              <p className="text-xs" style={{ color: "hsl(215 20% 65%)" }}>
                {project.prompt}
              </p>
            </div>

            {/* GitHub Status */}
            {project.githubStatus === "pushed" && (
              <p className="text-xs font-semibold mb-2"
                style={{ color: "hsl(142 71% 45%)" }}>
                ✅ GitHub push complete
              </p>
            )}

            {/* Netlify Button */}
            <button
              onClick={() => handleNetlify(project.id)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold mb-2 transition-all"
              style={{
                background: project.netlifyStatus === "live"
                  ? "hsl(142 71% 45%)"
                  : "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
                color: "hsl(220 47% 8%)",
              }}>
              {project.netlifyStatus === "idle" && "＋ Connect Netlify"}
              {project.netlifyStatus === "connecting" && "⏳ Connecting..."}
              {project.netlifyStatus === "live" && "🚀 Live on Netlify"}
            </button>

            {/* GitHub Button */}
            <button
              onClick={() => handleGithub(project.id)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: "hsl(220 47% 8%)",
                border: "1px solid hsl(217 33% 17%)",
                color: "hsl(210 40% 98%)",
              }}>
              {project.githubStatus === "idle" && "🐙 Connect GitHub"}
              {project.githubStatus === "connecting" && "⏳ Pushing..."}
              {project.githubStatus === "pushed" && "✅ Pushed to GitHub"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}