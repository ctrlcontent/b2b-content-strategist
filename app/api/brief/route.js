// app/api/brief/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = process.env.MODEL_NAME || "gemini-2.5-flash-lite";
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      goal,
      industry,
      icp,
      voice,
      item // { title, format, channel, persona, journeyStage, primaryKeyword, supportingKeywords, cta, notes }
    } = body || {};

    if (!API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are a senior B2B content strategist and editor.
Write a concise, actionable content brief for the following content item.
Output MUST be JSON matching this schema:
{
  "title": string,
  "goalAlignment": string,
  "targetAudience": string,
  "keyAngle": string,
  "outline": [string, ...],
  "keyPoints": [string, ...],
  "sourcesToCite": [string, ...],
  "cta": string,
  "distributionChecklist": [string, ...],
  "toneGuidance": string
}

Context:
- Business goal: ${goal || ""}
- Industry: ${industry || ""}
- ICP/persona: ${icp || ""}

Item:
- Title: ${item?.title || ""}
- Format: ${item?.format || ""}
- Channel: ${item?.channel || ""}
- Persona: ${item?.persona || ""}
- Funnel stage: ${item?.journeyStage || ""}
- Primary keyword: ${item?.primaryKeyword || ""}
- Supporting keywords: ${(item?.supportingKeywords || []).join(", ")}
- CTA: ${item?.cta || ""}
- Notes: ${item?.notes || ""}

Tone/voice to follow: ${voice || "Direct, practical, expert"}

Rules:
- JSON only. No code fences, no extra prose.
- Make the outline specific and non-generic.
- Include 3–6 sourcesToCite (vendor-neutral where possible).
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text().trim();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        data = JSON.parse(text.slice(start, end + 1));
      } else {
        return NextResponse.json({ error: "Model returned non-JSON", raw: text }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true, brief: data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
