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

    const prompt = `You are an expert SaaS developer. Generate a complete file structure and code for a SaaS MVP.

Project Name: ${projectName}
Startup Idea: ${idea}
Industry: ${industry}
Target Audience: ${audience}
Selected Features: ${features.join(", ")}

Return a JSON array of files in this exact format:
[
  {
    "filename": "package.json",
    "content": "... file content here ..."
  },
  {
    "filename": "src/app/page.tsx",
    "content": "... file content here ..."
  }
]

Generate at least 8-10 real working files. Real code only.
Return ONLY the JSON array, nothing else.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content || "[]";

    let files;
    try {
      // Clean any markdown code fences if present
      const cleaned = content.replace(/```json|```/g, "").trim();
      files = JSON.parse(cleaned);
    } catch {
      files = [];
    }

    return NextResponse.json({ files });

  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}