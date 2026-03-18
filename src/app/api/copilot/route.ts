import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are Grace AI, an expert startup and SaaS advisor. 
You help founders with:
- Business strategy and market entry
- SaaS business models and pricing
- Product development and MVP planning
- Fundraising and investor relations
- Growth hacking and marketing
- Technical architecture decisions

Keep responses concise, practical and actionable.
Always relate advice to SaaS and startup context.`,
        },
        ...messages,
      ],
      max_tokens: 1000,
    });

    const reply = response.choices[0].message.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Copilot error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}