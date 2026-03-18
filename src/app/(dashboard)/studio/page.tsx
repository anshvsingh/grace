"use client";

import { useState } from "react";

const models = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

const codeQualities = [
  "Prototype",
  "Standard",
  "Production-grade",
  "Industry-grade",
];

export default function StudioPage() {
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [codeQuality, setCodeQuality] = useState("Industry-grade");
  const [temperature, setTemperature] = useState(0.6);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [strictOutput, setStrictOutput] = useState(true);
  const [instructions, setInstructions] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem("graceStudioConfig", JSON.stringify({
      selectedModel,
      codeQuality,
      temperature,
      maxTokens,
      strictOutput,
      instructions,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold"
          style={{
            background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
          AI Finetuning Studio
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(215 20% 65%)" }}>
          Configure how your AI engine builds SaaS MVPs
        </p>
      </div>

      <div className="space-y-4">

        {/* Row 1 — Model, Quality, Temperature */}
        <div className="grid grid-cols-3 gap-4">

          {/* AI Model */}
          <div className="p-5 rounded-xl"
            style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "hsl(215 20% 65%)" }}>
              AI Model
            </p>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "hsl(220 47% 8%)",
                border: "1px solid hsl(217 33% 17%)",
                color: "hsl(210 40% 98%)",
              }}>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Code Quality */}
          <div className="p-5 rounded-xl"
            style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "hsl(215 20% 65%)" }}>
              Code Quality
            </p>
            <select
              value={codeQuality}
              onChange={(e) => setCodeQuality(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "hsl(220 47% 8%)",
                border: "1px solid hsl(217 33% 17%)",
                color: "hsl(210 40% 98%)",
              }}>
              {codeQualities.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div className="p-5 rounded-xl"
            style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "hsl(215 20% 65%)" }}>
              Creativity (Temperature)
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-sm mt-1" style={{ color: "hsl(210 100% 56%)" }}>
              {temperature}
            </p>
          </div>
        </div>

        {/* Row 2 — Advanced Instructions */}
        <div className="p-5 rounded-xl"
          style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "hsl(215 20% 65%)" }}>
            Advanced Engine Instructions
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Prefer functional components, avoid inline CSS, use TypeScript strictly..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full rounded-lg p-3 text-sm resize-none outline-none"
            style={{
              backgroundColor: "hsl(220 47% 8%)",
              border: "1px solid hsl(217 33% 17%)",
              color: "hsl(210 40% 98%)",
            }}
          />
        </div>

        {/* Row 3 — Max Tokens, Strict Output, Save */}
        <div className="grid grid-cols-3 gap-4">

          {/* Max Tokens */}
          <div className="p-5 rounded-xl"
            style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "hsl(215 20% 65%)" }}>
              Max Tokens
            </p>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "hsl(220 47% 8%)",
                border: "1px solid hsl(217 33% 17%)",
                color: "hsl(210 40% 98%)",
              }}
            />
          </div>

          {/* Strict Output */}
          <div className="p-5 rounded-xl flex items-center justify-between"
            style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>
            <p className="text-sm font-medium" style={{ color: "hsl(210 40% 98%)" }}>
              Strict Output Format
            </p>
            <button
              onClick={() => setStrictOutput(!strictOutput)}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{
                backgroundColor: strictOutput ? "hsl(210 100% 56%)" : "hsl(217 33% 17%)",
              }}>
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all"
                style={{ left: strictOutput ? "26px" : "2px" }} />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="p-5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: saved
                ? "hsl(142 71% 45%)"
                : "linear-gradient(90deg, hsl(270 100% 70%), hsl(210 100% 56%))",
              color: "white",
            }}>
            {saved ? "✅ Saved!" : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}