import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { idea, features, industry, audience, projectName } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "No idea provided" }, { status: 400 });
    }

    const prompt = `You are an expert React developer. Generate a complete, beautiful, fully working single-page React application.

Project: ${projectName}
Idea: ${idea}
Industry: ${industry}
Audience: ${audience}
Features: ${features.join(", ")}

Generate EXACTLY these files:

FILE 1: package.json
Use EXACTLY this content (no modifications):
{
  "name": "${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": { "next": "14.2.5", "react": "^18.3.1", "react-dom": "^18.3.1" },
  "devDependencies": { "@types/node": "^20", "@types/react": "^18", "@types/react-dom": "^18", "typescript": "^5", "tailwindcss": "^3.4.1", "autoprefixer": "^10.0.1", "postcss": "^8" }
}

FILE 2: tsconfig.json
Use EXACTLY this content:
{
  "compilerOptions": {
    "target": "es5", "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true, "skipLibCheck": true, "strict": true,
    "noEmit": true, "esModuleInterop": true, "module": "esnext",
    "moduleResolution": "bundler", "resolveJsonModule": true,
    "isolatedModules": true, "jsx": "preserve", "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

FILE 3: tailwind.config.ts
Use EXACTLY this content:
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};
export default config;

FILE 4: postcss.config.js
Use EXACTLY this content:
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }

FILE 5: next.config.js
Use EXACTLY this content:
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig

FILE 6: src/app/globals.css
Use EXACTLY this content:
@tailwind base;
@tailwind components;
@tailwind utilities;

FILE 7: src/app/layout.tsx
Use EXACTLY this content:
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "${projectName}", description: "${idea}" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-gray-950 text-white">{children}</body></html>;
}

FILE 8: src/app/page.tsx
Generate a COMPLETE, BEAUTIFUL, FULLY WORKING single page application.

REQUIREMENTS:
- Use "use client" at the top
- Import useState from react
- Use useState for ALL navigation and interactions
- Dark theme with beautiful gradients and colors
- A navbar with the app name and navigation links
- Each nav link changes the active section using useState
- Generate ALL these sections based on features: ${features.join(", ")}
- Every button must DO something using useState
- Use realistic dummy data (names, dates, prices, etc.)
- Beautiful cards, modals, forms using Tailwind CSS
- Professional gradients like: bg-gradient-to-r from-blue-500 to-cyan-500
- NO external component imports
- NO missing dependencies
- The entire app in ONE file

Example of working navigation:
\`\`\`
"use client";
import { useState } from "react";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
      <nav>
        <button onClick={() => setActiveSection("home")}>Home</button>
        <button onClick={() => setActiveSection("events")}>Events</button>
      </nav>
      {activeSection === "home" && <HomeSection />}
      {activeSection === "events" && <EventsSection />}
    </div>
  );
}
\`\`\`

Make the app look like a REAL professional product!
Generate at least 300 lines of code for page.tsx.

Return ONLY a valid JSON array. No markdown. No backticks. No explanation:
[
  { "filename": "package.json", "content": "..." },
  { "filename": "tsconfig.json", "content": "..." },
  { "filename": "tailwind.config.ts", "content": "..." },
  { "filename": "postcss.config.js", "content": "..." },
  { "filename": "next.config.js", "content": "..." },
  { "filename": "src/app/globals.css", "content": "..." },
  { "filename": "src/app/layout.tsx", "content": "..." },
  { "filename": "src/app/page.tsx", "content": "..." }
]`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert React and Next.js developer. You ONLY return valid JSON arrays. Never use markdown backticks. Never add explanations. Just the raw JSON array.",
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 8000,
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || "[]";

    let files;
    try {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      
      const start = cleaned.indexOf("[");
      const end = cleaned.lastIndexOf("]");
      
      if (start === -1 || end === -1) {
        throw new Error("No JSON array found");
      }
      
      const jsonStr = cleaned.slice(start, end + 1);
      files = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Parse error:", e);
      files = [];
    }

    return NextResponse.json({ files });

  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}