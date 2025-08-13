// app/page.js
"use client";

import { useState } from "react";
import CalendarTable from "./components/CalendarTable";

// Helper: build an .ics calendar from result + start date
function buildICS(calendar, startDateStr) {
  function fmt(dt) {
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(dt.getUTCDate()).padStart(2, "0");
    const hh = "09", mm = "00", ss = "00";
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
  }

  // Align start date to Monday for neat weeks
  const startDate = new Date(startDateStr + "T00:00:00");
  const day = startDate.getDay(); // 0=Sun..6=Sat
  const diffToMon = (day === 0 ? -6 : 1 - day);
  startDate.setDate(startDate.getDate() + diffToMon);

  const events = [];
  for (const w of calendar.weeks || []) {
    let idx = 0;
    for (const it of (w.items || [])) {
      const dayOffset = Math.floor(idx % 5); // Mon..Fri
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + (w.week - 1) * 7 + dayOffset);

      const uid = `${w.week}-${idx}-${Math.random().toString(36).slice(2)}@b2b-content-strategist`;
      const summary = `${it.title} (${it.format} on ${it.channel})`;
      const description = [
        `Persona: ${it.persona || ""}`,
        `Stage: ${it.journeyStage || ""}`,
        `Primary KW: ${it.primaryKeyword || ""}`,
        `Supporting KWs: ${(it.supportingKeywords || []).join(", ")}`,
        `CTA: ${it.cta || ""}`,
        `Notes: ${it.notes || ""}`
      ].join("\\n");

      events.push(
        [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP:${fmt(new Date())}`,
          `DTSTART:${fmt(eventDate)}`,
          `DTEND:${fmt(new Date(eventDate.getTime() + 60 * 60 * 1000))}`, // +1h
          `SUMMARY:${summary.replace(/[\r\n]/g, " ")}`,
          `DESCRIPTION:${description.replace(/[\r\n]/g, " ")}`,
          "END:VEVENT",
        ].join("\r\n")
      );
      idx++;
    }
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//B2B Content Strategist//EN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

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
    startDate: "2025-08-13", // change to today's date if you like
    brandContext: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);

    try {
      const payload = {
        ...form,
        timeframeWeeks: Number(form.timeframeWeeks),
        cadencePerWeek: Number(form.cadencePerWeek),
        channels: form.channels.split(",").map(s => s.trim()).filter(Boolean),
        formats: form.formats.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.calendar);
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">B2B Content Strategist (MVP)</h1>

      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-2">
          <span>Goal</span>
          <input className="border rounded p-2" name="goal" value={form.goal} onChange={onChange} />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span>Industry</span>
            <input className="border rounded p-2" name="industry" value={form.industry} onChange={onChange} />
          </label>
          <label className="grid gap-2">
            <span>ICP / persona</span>
            <input className="border rounded p-2" name="icp" value={form.icp} onChange={onChange} />
          </label>
        </div>

        {/* Brand + Voice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span>Voice / tone</span>
            <input className="border rounded p-2" name="voice" value={form.voice} onChange={onChange} />
          </label>
          <label className="grid gap-2">
            <span>Start date</span>
            <input type="date" className="border rounded p-2" name="startDate" value={form.startDate} onChange={onChange} />
          </label>
        </div>

        <label className="grid gap-2">
          <span>Brand context (paste guidelines, tone, examples)</span>
          <textarea
            className="border rounded p-2 min-h-[140px]"
            name="brandContext"
            value={form.brandContext}
            onChange={onChange}
            placeholder="Paste brand guidelines, tone-of-voice, and example links or snippets"
          ></textarea>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="grid gap-2">
            <span>Timeframe (weeks)</span>
            <input type="number" min="1" className="border rounded p-2" name="timeframeWeeks" value={form.timeframeWeeks} onChange={onChange} />
          </label>
          <label className="grid gap-2">
            <span>Cadence per week</span>
            <input type="number" min="1" className="border rounded p-2" name="cadencePerWeek" value={form.cadencePerWeek} onChange={onChange} />
          </label>
          <label className="grid gap-2">
            <span>Formats (comma separated)</span>
            <input className="border rounded p-2" name="formats" value={form.formats} onChange={onChange} />
          </label>
        </div>

        <label className="grid gap-2">
          <span>Channels (comma separated)</span>
          <input className="border rounded p-2" name="channels" value={form.channels} onChange={onChange} />
        </label>

        <button type="submit" disabled={loading} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
          {loading ? "Generating…" : "Generate calendar"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">Error: {error}</p>}

      {result && (
        <section className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-semibold">Plan</h2>

            {/* Download CSV */}
            <button
              onClick={() => {
                const rows = [["Week","Title","Format","Channel","Persona","Stage","Primary Keyword","Supporting Keywords","CTA","Notes"]];
                for (const w of result.weeks || []) {
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
                      (it.notes || "").replace(/\n/g, " ")
                    ]);
                  }
                }
                const csv = rows.map(r =>
                  r.map(v => {
                    const s = String(v ?? "");
                    const needsQuotes = /[",\n]/.test(s);
                    const safe = s.replace(/"/g, '""');
                    return needsQuotes ? `"${safe}"` : safe;
                  }).join(",")
                ).join("\n");
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
              className="ml-auto bg-gray-900 text-white text-sm rounded px-3 py-1.5"
            >
              Download CSV
            </button>

            {/* Download ICS */}
            <button
              onClick={() => {
                try {
                  const ics = buildICS(result, form.startDate);
                  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "content-calendar.ics";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                } catch (e) {
                  alert("Could not build ICS: " + (e?.message || e));
                }
              }}
              className="bg-gray-700 text-white text-sm rounded px-3 py-1.5"
            >
              Download ICS
            </button>
          </div>

          <CalendarTable
            calendar={result}
            onBrief={async (weekNumber, itemIndex, item) => {
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
                    item
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Brief generation failed");

                const b = data.brief || {};
                const lines = [];
                lines.push(`# ${b.title || item.title || "Content brief"}`);
                lines.push("");
                lines.push(`Goal alignment: ${b.goalAlignment || ""}`);
                lines.push(`Target audience: ${b.targetAudience || ""}`);
                lines.push(`Key angle: ${b.keyAngle || ""}`);
                lines.push("");
                lines.push("Outline:");
                (b.outline || []).forEach((x, i) => lines.push(`${i + 1}. ${x}`));
                lines.push("");
                lines.push("Key points:");
                (b.keyPoints || []).forEach((x) => lines.push(`- ${x}`));
                lines.push("");
                lines.push("Sources to cite:");
                (b.sourcesToCite || []).forEach((x) => lines.push(`- ${x}`));
                lines.push("");
                lines.push(`CTA: ${b.cta || ""}`);
                lines.push("");
                lines.push("Distribution checklist:");
                (b.distributionChecklist || []).forEach((x) => lines.push(`- ${x}`));
                lines.push("");
                lines.push(`Tone guidance: ${b.toneGuidance || form.voice || ""}`);
                const txt = lines.join("\n");

                const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const safeTitle = (item.title || "brief").replace(/[^\w\-]+/g, "_").slice(0,80);
                a.download = `${safeTitle}.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (e) {
                alert("Could not generate brief: " + (e?.message || e));
              }
            }}
          />
        </section>
      )}
    </main>
  );
}
