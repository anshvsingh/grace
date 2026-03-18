"use client";
import { supabase } from "@/lib/supabase";
import { downloadZip } from "@/lib/downloadZip";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type GeneratedFile = {
  filename: string;
  content: string;
};

function BuildContent() {
  const searchParams = useSearchParams();
  const [completedFiles, setCompletedFiles] = useState<GeneratedFile[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [allFiles, setAllFiles] = useState<GeneratedFile[]>([]);

  const idea = searchParams.get("idea") || "";
  const features = searchParams.get("features")?.split(",") || [];
  const industry = searchParams.get("industry") || "";
  const audience = searchParams.get("audience") || "";
  const projectName = searchParams.get("projectName") || "";

  useEffect(() => {
    const generate = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, features, industry, audience, projectName }),
        });

        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        // Stream files one by one
        // Stream files one by one
        for (let i = 0; i < data.files.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setCompletedFiles((prev) => [...prev, data.files[i]]);
                   }

        setAllFiles(data.files);
setIsDone(true);
setIsLoading(false);

// Save to Supabase
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  await supabase.from("projects").insert({
    user_id: user.id,
    name: projectName || "Untitled Project",
    idea: idea,
    industry: industry,
    audience: audience,
    features: features,
    files: data.files,
    status: "Draft",
  });
}
      } catch (err) {
        setError("Something went wrong!");
        setIsLoading(false);
      }
    };

    if (idea) generate();
    else setIsLoading(false);
  }, []);

  const progress = isDone ? 100 : Math.round((completedFiles.length / 10) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "hsl(220 47% 8%)" }}>
      <div className="w-full max-w-xl">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2"
          style={{ background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Building Your SaaS MVP
        </h1>
        <p className="text-center text-sm mb-8"
          style={{ color: "hsl(215 20% 65%)" }}>
          {isLoading ? "Generating your files with GPT-4..." : isDone ? "Your MVP is ready!" : "Processing..."}
        </p>

        {/* Card */}
        <div className="rounded-2xl p-6"
          style={{ backgroundColor: "hsl(220 47% 11%)", border: "1px solid hsl(217 33% 17%)" }}>

          {/* Selected Features */}
          {features.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2"
                style={{ color: "hsl(210 100% 56%)" }}>
                Selected Features
              </p>
              <ul className="space-y-1">
                {features.map((f) => (
                  <li key={f} className="text-sm"
                    style={{ color: "hsl(215 20% 65%)" }}>
                    • {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full rounded-full h-2 mb-5"
            style={{ backgroundColor: "hsl(217 33% 17%)" }}>
            <div className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 mb-4">{error}</p>
          )}

          {/* File List */}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {completedFiles.map((file, i) => (
              <div key={i}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg"
                style={{ backgroundColor: "hsl(220 47% 8%)", border: "1px solid hsl(217 33% 17%)" }}>
                <span className="text-sm" style={{ color: "hsl(210 40% 98%)" }}>
                  {file.filename}
                </span>
                <span className="text-green-400">✅</span>
              </div>
            ))}
          </div>

          {/* Loading spinner */}
          {isLoading && completedFiles.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "hsl(210 100% 56%)", borderTopColor: "transparent" }} />
              <p className="text-sm mt-3" style={{ color: "hsl(215 20% 65%)" }}>
                GPT-4 is writing your code...
              </p>
            </div>
          )}

          {/* Done */}
{isDone && (
  <div className="mt-6 text-center">
    <p className="text-sm font-semibold mb-4"
      style={{ color: "hsl(142 71% 45%)" }}>
      ✨ MVP Generation Complete!
    </p>
    <button
      onClick={() => downloadZip(allFiles, projectName)}
      className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
      style={{
        background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(142 71% 45%))",
        color: "hsl(220 47% 8%)",
      }}>
      ⬇️ Download ZIP
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default function BuildPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuildContent />
    </Suspense>
  );
}