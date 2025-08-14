// app/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PlanView from "./components/PlanView";

/* ---------------------- ICS builder ---------------------- */
function buildICS(calendar, startDateStr) {
  function fmt(dt) {
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(dt.getUTCDate()).padStart(2, "0");
    const hh = "09", mm = "00", ss = "00";
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
  }
  const startDate = new Date(startDateStr + "T00:00:00");
  const day = startDate.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  startDate.setDate(startDate.getDate() + diffToMon);

  const events = [];
  for (const w of calendar.weeks || []) {
    let idx = 0;
    for (const it of w.items || []) {
      const dayOffset = Math.floor(idx % 5);
      const dt = new Date(startDate);
      dt.setDate(startDate.getDate() + (w.week - 1) * 7 + dayOffset);
      events.push(
        [
          "BEGIN:VEVENT",
          `UID:${w.week}-${idx}-${Math.random().toString(36).slice(2)}@ctrlcontent`,
          `DTSTAMP:${fmt(new Date())}`,
          `DTSTART:${fmt(dt)}`,
          `DTEND:${fmt(new Date(dt.getTime() + 60 * 60 * 1000))}`,
          `SUMMARY:${(it.title || "").replace(/\r|\n/g, " ")} (${it.format} on ${it.channel})`,
          `DESCRIPTION:${[
            `Persona: ${it.persona || ""}`,
            `Stage: ${it.journeyStage || ""}`,
            `Primary KW: ${it.primaryKeyword || ""}`,
            `Supporting KWs: ${(it.supportingKeywords || []).join(", ")}`,
            `CTA: ${it.cta || ""}`,
            `Notes: ${it.notes || ""}`,
          ]
            .join("\\n")
            .replace(/\r|\n/g, " ")}`,
          "END:VEVENT",
        ].join("\r\n")
      );
      idx++;
    }
  }
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ctrl+Content//EN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/* ---------------------- Page ---------------------- */
export default function Home() {
  const [form, setForm] = useState({
    goal: "Generate qualified demo requests",
    industry: "B2B SaaS",
    icp: "Mid-market CTOs in fintech",
    timeframeWeeks: 8,
    cadencePerWeek: 2,
    channels: "Blog, LinkedIn",
    formats: "Article, LinkedIn post",
    voice: "Direct, practical, expert",
    startDate: "2025-08-13",
    brandContext: "",
  });

  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCalendar(null);
    try {
      const payload = {
        ...form,
        timeframeWeeks: Number(form.timeframeWeeks),
        cadencePerWeek: Number(form.cadencePerWeek),
        channels: form.channels.split(",").map((s) => s.trim()).filter(Boolean),
        formats: form.formats.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCalendar(data.calendar);
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* HERO */}
      <section className="cc-hero cc-mb-24">
        <div className="cc-container">
          <div className="grid items-center gap-12 py-20 md:grid-cols-2 md:py-32">
            <div>
              <span className="cc-eyebrow">Ctrl+Content</span>
              <h1 className="cc-h1 mt-2">AI content planning, minus the busywork</h1>
              <p className="cc-lead mt-4">
                Generate your entire content calendar and briefs in seconds.
              </p>
              <div className="mt-8 flex gap-3">
                <Link href="#planner" className="btn">Start planning</Link>
                <Link href="#how-it-works" className="ghost-btn px-4 py-2 text-sm">How it works</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/globe.svg"
                alt=""
                width={500}
                height={500}
                className="mx-auto w-full max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PLANNER */}
      <section id="planner" className="cc-container">
        <form onSubmit={onSubmit} className="card p-8 md:p-10 grid gap-8 max-w-3xl mx-auto">
          {/* Goal */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Your goal</h2>
            <label className="grid gap-1">
              <span className="label">Goal</span>
              <input className="input" name="goal" value={form.goal} onChange={onChange} />
            </label>
          </div>

          {/* Audience */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Audience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="grid gap-1">
                <span className="label">Industry</span>
                <input className="input" name="industry" value={form.industry} onChange={onChange} />
              </label>
              <label className="grid gap-1">
                <span className="label">ICP / persona</span>
                <input className="input" name="icp" value={form.icp} onChange={onChange} />
              </label>
            </div>
          </div>

          {/* Voice & brand */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Voice & brand</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="grid gap-1">
                <span className="label">Voice / tone</span>
                <input className="input" name="voice" value={form.voice} onChange={onChange} />
              </label>
              <label className="grid gap-1">
                <span className="label">Start date</span>
                <input
                  type="date"
                  className="input"
                  name="startDate"
                  value={form.startDate}
                  onChange={onChange}
                />
              </label>
            </div>
            <label className="grid gap-1 mt-4">
              <span className="label">Brand context (paste guidelines, tone, examples)</span>
              <textarea
                className="textarea"
                name="brandContext"
                value={form.brandContext}
                onChange={onChange}
                placeholder="Paste brand guidelines, tone-of-voice, and example links or snippets"
              />
            </label>
          </div>

          {/* Publishing prefs */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Publishing preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="grid gap-1">
                <span className="label">Timeframe (weeks)</span>
                <input
                  type="number"
                  min="1"
                  className="input"
                  name="timeframeWeeks"
                  value={form.timeframeWeeks}
                  onChange={onChange}
                />
              </label>
              <label className="grid gap-1">
                <span className="label">Cadence per week</span>
                <input
                  type="number"
                  min="1"
                  className="input"
                  name="cadencePerWeek"
                  value={form.cadencePerWeek}
                  onChange={onChange}
                />
              </label>
              <label className="grid gap-1">
                <span className="label">Formats (comma separated)</span>
                <input className="input" name="formats" value={form.formats} onChange={onChange} />
              </label>
            </div>

            <label className="grid gap-1 mt-4">
              <span className="label">Channels (comma separated)</span>
              <input className="input" name="channels" value={form.channels} onChange={onChange} />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Generating…" : "Generate calendar"}
            </button>
            {error && <span className="text-red-600 text-sm">Error: {error}</span>}
          </div>
        </form>
      </section>

      {/* DOWNLOADS TOOLBAR (centered + sticky under header) */}
      {calendar && (
        <div
          className="cc-toolbar cc-mt-24"
          style={{
            background: "rgba(246,245,255,.92)",
            backdropFilter: "blur(6px)",
            borderTop: "1px solid #E5E7EB",
            borderBottom: "1px solid #E5E7EB",
            padding: "10px 0",
          }}
        >
          <div className="cc-container" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3 className="font-semibold">Plan</h3>

            <button
              onClick={() => {
                const rows = [
                  [
                    "Week",
                    "Title",
                    "Format",
                    "Channel",
                    "Persona",
                    "Stage",
                    "Primary Keyword",
                    "Supporting Keywords",
                    "CTA",
                    "Notes",
                  ],
                ];
                for (const w of calendar.weeks || []) {
                  for (const it of w.items || []) {
                    rows.push([
                      w.week,
                      it.title || "",
                      it.format || "",
                      it.channel || "",
                      it.persona || "",
                      it.journeyStage || "",
                      it.primaryKeyword || "",
                      (it.supportingKeywords || []).join("; "),
                      it.cta || "",
                      (it.notes || "").replace(/\n/g, " "),
                    ]);
                  }
                }
                const csv = rows
                  .map((r) =>
                    r
                      .map((v) => {
                        const s = String(v ?? "");
                        const needs = /[",\n]/.test(s);
                        const safe = s.replace(/"/g, '""');
                        return needs ? `"${safe}"` : safe;
                      })
                      .join(",")
                  )
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "content-calendar.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
              className="btn px-3 py-1.5 text-sm"
            >
              Download CSV
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                try {
                  const ics = buildICS(calendar, form.startDate);
                  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "content-calendar.ics";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  alert("Could not build ICS: " + (err?.message || err));
                }
              }}
              className="ghost-btn px-3 py-1.5 text-sm"
            >
              Download ICS
            </a>
          </div>
        </div>
      )}

      {/* PLAN CARDS */}
      {calendar && (
        <div className="cc-mt-24">
          <PlanView
            calendar={calendar}
            onBrief={async (_week, _i, item) => {
              try {
                const res = await fetch("/api/brief", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    goal: form.goal,
                    industry: form.industry,
                    icp: form.icp,
                    voice: form.voice,
                    brandContext: form.brandContext,
                    item,
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Brief generation failed");

                const b = data.brief || {};
                const lines = [];
                lines.push(`# ${b.title || item.title || "Content brief"}`, "");
                lines.push(`Goal alignment: ${b.goalAlignment || ""}`);
                lines.push(`Target audience: ${b.targetAudience || ""}`);
                lines.push(`Key angle: ${b.keyAngle || ""}`, "", "Outline:");
                (b.outline || []).forEach((x, i) => lines.push(`${i + 1}. ${x}`));
                lines.push("", "Key points:");
                (b.keyPoints || []).forEach((x) => lines.push(`- ${x}`));
                lines.push("", "Sources to cite:");
                (b.sourcesToCite || []).forEach((x) =>
                  lines.push(`- ${typeof x === "string" ? x : x.title ? `${x.title} — ${x.url}` : ""}`)
                );
                lines.push("", `CTA: ${b.cta || ""}`, "", "Distribution checklist:");
                (b.distributionChecklist || []).forEach((x) => lines.push(`- ${x}`));
                lines.push("", `Tone guidance: ${b.toneGuidance || form.voice || ""}`);

                const txt = lines.join("\n");
                const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${(item.title || "brief").replace(/[^\w\-]+/g, "_").slice(0, 80)}.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (e) {
                alert("Could not generate brief: " + (e?.message || e));
              }
            }}
          />
        </div>
      )}

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="cc-mt-24">
        <div className="card p-8">
          <h3 className="text-2xl font-semibold tracking-tight mb-3">How it works</h3>
          <ol className="grid gap-3 list-decimal ml-5 text-slate-700">
            <li>Enter goals, ICP, tone, timeframe, formats, and channels.</li>
            <li>We generate a goal-aligned calendar plus optional briefs.</li>
            <li>Export to CSV and ICS, or download per-item briefs as text.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
