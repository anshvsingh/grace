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

const prompt = `You are an expert Next.js developer. Generate a complete, working Next.js 14 App Router project.

Project Name: ${projectName}
Startup Idea: ${idea}
Industry: ${industry}
Target Audience: ${audience}
Selected Features: ${features.join(", ")}

STRICT RULES:
- Use Next.js 14 App Router (src/app/ structure NOT pages/)
- Use TypeScript
- Use Tailwind CSS for styling
- Every file must be 100% complete with no placeholders
- No comments like "add your code here"
- Use realistic dummy data where needed

REQUIRED FILES TO GENERATE:
1. package.json (with next, react, typescript, tailwind dependencies)
2. tsconfig.json
3. tailwind.config.ts
4. postcss.config.js
5. src/app/layout.tsx
6. src/app/page.tsx (landing/home page)
7. src/app/globals.css (with tailwind directives)
8. At least 3 more pages based on the selected features

Return a JSON array ONLY in this exact format, nothing else:
[
  {
    "filename": "package.json",
    "content": "complete file content here"
  }
]`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8000,
    });

    const content = response.choices[0].message.content || "[]";

let files;
try {
  const cleaned = content.replace(/```json|```/g, "").trim();
  console.log("RAW CONTENT:", cleaned.slice(0, 500));
  files = JSON.parse(cleaned);
  console.log("PARSED FILES COUNT:", files.length);
} catch (e) {
  console.log("PARSE ERROR:", e);
  files = [];
}

    return NextResponse.json({ files });

  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}