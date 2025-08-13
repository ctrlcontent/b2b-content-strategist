// app/api/generate/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = process.env.MODEL_NAME || "gemini-2.5-flash-lite";
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const body = await req.json();

    // Read inputs (brandContext added)
    const {
      goal = "Generate qualified demo requests",
      industry = "B2B SaaS",
      icp = "Mid-market CTOs in fintech",
      timeframeWeeks = 8,
      cadencePerWeek = 2,
      channels = ["Blog", "LinkedIn"],
      formats = ["Article", "LinkedIn post"],
      voice = "Direct, practical, expert",
      brandContext = ""
    } = body || {};

    if (!API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 400 });
    }

    // Normalize channels/formats in case they arrive as comma-separated strings
    const normChannels = Array.isArray(channels)
      ? channels
      : String(channels || "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);

    const normFormats = Array.isArray(formats)
      ? formats
      : String(formats || "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);

    // Gemini client
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" }, // force pure JSON
    });

    // Prompt includes BRAND CONTEXT
    const prompt = `
You are a senior B2B content strategist.
Create a ${timeframeWeeks}-week content calendar to achieve: "${goal}".
ICP: ${icp}. Industry: ${industry}.
Cadence: ${cadencePerWeek} items/week. Channels: ${normChannels.join(", ")}.
Formats: ${normFormats.join(", ")}. Voice: ${voice}.

BRAND CONTEXT (must be reflected in pillars, topics, messaging, CTAs, and notes):
${brandContext}

Return ONLY valid JSON with this shape:
{
  "pillars": [{"name": string, "why": string}],
  "weeks": [
    {
      "week": number,
      "items": [
        {
          "title": string,
          "format": string,
          "channel": string,
          "persona": string,
          "journeyStage": "TOFU" | "MOFU" | "BOFU",
          "primaryKeyword": string,
          "supportingKeywords": string[],
          "cta": string,
          "notes": string
        }
      ]
    }
  ]
}
Rules:
- JSON only. No code fences, no prose.
- Keep 2–4 pillars tied to the goal and ICP.
- Mix TOFU/MOFU/BOFU across the plan.
- Total items ≈ ${timeframeWeeks * cadencePerWeek}.
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text().trim();

    // Parse JSON with a safe fallback
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        data = JSON.parse(text.slice(start, end + 1));
      } else {
        return NextResponse.json(
          { error: "Model returned non-JSON", raw: text },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ ok: true, calendar: data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
