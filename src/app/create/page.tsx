"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const features = [
  "Landing Page",
  "Authentication",
  "Database CRUD",
  "Payment Integration",
  "Admin Panel",
  "File Upload",
  "Email Notifications",
  "Analytics Dashboard",
];

export default function CreatePage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

const handleGenerate = () => {
  if (!idea.trim()) return alert("Please enter your startup idea!");
  if (selectedFeatures.length === 0) return alert("Please select at least one feature!");

  const params = new URLSearchParams({
    idea,
    industry,
    audience,
    projectName,
    features: selectedFeatures.join(","),
  });

  router.push(`/build?${params.toString()}`);
};

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "hsl(222 47% 8%)" }}>
      <div className="w-full max-w-2xl rounded-2xl p-8"
        style={{ backgroundColor: "hsl(222 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8"
          style={{ background: "linear-gradient(90deg, hsl(270 100% 70%), hsl(186 100% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Create Your SaaS MVP
        </h1>

        {/* Startup Idea */}
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block"
            style={{ color: "hsl(215 20% 65%)" }}>
            Startup Idea
          </label>
          <textarea
            rows={4}
            placeholder="e.g. Log income/expenses manually and visualize trends..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full rounded-lg p-3 text-sm resize-none outline-none"
            style={{
              backgroundColor: "hsl(222 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
        </div>

        {/* Industry + Audience */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-medium mb-2 block"
              style={{ color: "hsl(215 20% 65%)" }}>
              Industry
            </label>
            <input
              placeholder="e.g. FinTech"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg p-3 text-sm outline-none"
              style={{
                backgroundColor: "hsl(222 47% 8%)",
                border: "1px solid hsl(217 33% 17%)",
                color: "hsl(210 40% 98%)",
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block"
              style={{ color: "hsl(215 20% 65%)" }}>
              Audience
            </label>
            <input
              placeholder="e.g. Students, Freelancers"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-lg p-3 text-sm outline-none"
              style={{
                backgroundColor: "hsl(222 47% 8%)",
                border: "1px solid hsl(217 33% 17%)",
                color: "hsl(210 40% 98%)",
              }}
            />
          </div>
        </div>

        {/* Project Name */}
        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block"
            style={{ color: "hsl(215 20% 65%)" }}>
            Project Name
          </label>
          <input
            placeholder="e.g. TrackBuddy — Expense Tracker MVP"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-lg p-3 text-sm outline-none"
            style={{
              backgroundColor: "hsl(222 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
        </div>

        {/* Select Features */}
        <div className="mb-8">
          <label className="text-sm font-medium mb-3 block"
            style={{ color: "hsl(215 20% 65%)" }}>
            Select Features
          </label>
          <div className="grid grid-cols-3 gap-3">
            {features.map((feature) => {
              const isSelected = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isSelected ? "hsl(186 100% 50%)" : "transparent",
                    border: `1px solid ${isSelected ? "hsl(186 100% 50%)" : "hsl(217 33% 17%)"}`,
                    color: isSelected ? "hsl(222 47% 8%)" : "hsl(215 20% 65%)",
                  }}>
                  {feature}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(90deg, hsl(186 100% 50%), hsl(142 71% 45%))",
            color: "hsl(222 47% 8%)",
          }}>
          🚀 Generate MVP
        </button>
      </div>
    </div>
  );
}