"use client";

import { useState } from "react";
import CalendarTable from "./components/CalendarTable";

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
  const diffToMon = (day === 0 ? -6 : 1 - day);
  startDate.setDate(startDate.getDate() + diffToMon);

  const events = [];
  for (const w of calendar.weeks || []) {
    let idx = 0;
    for (const it of (w.items || [])) {
      const dayOffset = Math.floor(idx % 5);
      const dt = new Date(startDate);
      dt.setDate(startDate.getDate() + (w.week - 1) * 7 + dayOffset);
      events.push([
        "BEGIN:VEVENT",
        `UID:${w.week}-${idx}-${Math.random().toString(36).slice(2)}@ctrlcontent`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(dt)}`,
        `DTEND:${fmt(new Date(dt.getTime()+60*60*1000))}`,
        `SUMMARY:${(it.title||"").replace(/\r|\n/g," ")} (${it.format} on ${it.channel})`,
        `DESCRIPTION:${[
          `Persona: ${it.persona||""}`,
          `Stage: ${it.journeyStage||""}`,
          `Primary KW: ${it.primaryKeyword||""}`,
          `Supporting KWs: ${(it.supportingKeywords||[]).join(", ")}`,
          `CTA: ${it.cta||""}`,
          `Notes: ${it.notes||""}`
        ].join("\\n").replace(/\r|\n/g," ")}`,
        "END:VEVENT"
      ].join("\r\n"));
      idx++;
    }
  }
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Ctrl+Content//EN",...events,"END:VCALENDAR"].join("\r\n");
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
    startDate: "2025-08-13",
    brandContext: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onChange = (e) => setForm(f => ({...f,[e.target.name]: e.target.value}));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try{
      const payload = {
        ...form,
        timeframeWeeks: Number(form.timeframeWeeks),
        cadencePerWeek: Number(form.cadencePerWeek),
        channels: form.channels.split(",").map(s=>s.trim()).filter(Boolean),
        formats: form.formats.split(",").map(s=>s.trim()).filter(Boolean),
      };
      const res = await fetch("/api/generate", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.calendar);
    }catch(err){ setError(String(err.message||err)); }
    finally{ setLoading(false); }
  };

  return (
    <main className="mt-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="section-title mb-3">B2B Content Strategist</h1>
        <p className="text-slate-600 mb-6">
          Plan goal-aligned calendars and downloadable briefs, tailored to your brand voice.
        </p>
      </div>

      {/* Form card */}
      <form onSubmit={onSubmit} className="card p-6 mx-auto max-w-3xl grid gap-4">
        <label className="grid gap-1">
          <span className="label">Goal</span>
          <input className="input" name="goal" value={form.goal} onChange={onChange}/>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="label">Industry</span>
            <input className="input" name="industry" value={form.industry} onChange={onChange}/>
          </label>
          <label className="grid gap-1">
            <span className="label">ICP / persona</span>
            <input className="input" name="icp" value={form.icp} onChange={onChange}/>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="label">Voice / tone</span>
            <input className="input" name="voice" value={form.voice} onChange={onChange}/>
          </label>
          <label className="grid gap-1">
            <span className="label">Start date</span>
            <input type="date" className="input" name="startDate" value={form.startDate} onChange={onChange}/>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="label">Brand context (paste guidelines, tone, examples)</span>
          <textarea className="textarea" name="brandContext" value={form.brandContext} onChange={onChange}
            placeholder="Paste brand guidelines, tone-of-voice, and example links or snippets"></textarea>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="label">Timeframe (weeks)</span>
            <input type="number" min="1" className="input" name="timeframeWeeks" value={form.timeframeWeeks} onChange={onChange}/>
          </label>
          <label className="grid gap-1">
            <span className="label">Cadence per week</span>
            <input type="number" min="1" className="input" name="cadencePerWeek" value={form.cadencePerWeek} onChange={onChange}/>
          </label>
          <label className="grid gap-1">
            <span className="label">Formats (comma separated)</span>
            <input className="input" name="formats" value={form.formats} onChange={onChange}/>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="label">Channels (comma separated)</span>
          <input className="input" name="channels" value={form.channels} onChange={onChange}/>
        </label>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Generating…" : "Generate calendar"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 max-w-3xl mx-auto">Error: {error}</p>}

      {result && (
        <section className="mt-8 mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-semibold">Plan</h2>

            {/* CSV */}
            <button
              onClick={()=>{
                const rows=[["Week","Title","Format","Channel","Persona","Stage","Primary Keyword","Supporting Keywords","CTA","Notes"]];
                for(const w of result.weeks||[]){
                  for(const it of w.items||[]){
                    rows.push([w.week,it.title||"",it.format||"",it.channel||"",it.persona||"",it.journeyStage||"",it.primaryKeyword||"",
                      (it.supportingKeywords||[]).join("; "),it.cta||"", (it.notes||"").replace(/\n/g," ")]);
                  }
                }
                const csv=rows.map(r=>r.map(v=>{
                  const s=String(v??""); const needs=/[",\n]/.test(s); const safe=s.replace(/"/g,'""'); return needs?`"${safe}"`:safe;
                }).join(",")).join("\n");
                const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob);
                const a=document.createElement("a"); a.href=url; a.download="content-calendar.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
              }}
              className="ml-auto btn px-3 py-1.5 text-sm"
            >Download CSV</button>

            {/* ICS */}
            <button
              onClick={()=>{
                try{
                  const ics=buildICS(result,form.startDate);
                  const blob=new Blob([ics],{type:"text/calendar;charset=utf-8;"}); const url=URL.createObjectURL(blob);
                  const a=document.createElement("a"); a.href=url; a.download="content-calendar.ics"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                }catch(e){ alert("Could not build ICS: "+(e?.message||e)); }
              }}
              className="btn px-3 py-1.5 text-sm"
            >Download ICS</button>
          </div>

          <CalendarTable
            calendar={result}
            onBrief={async (_week, _i, item)=>{
              try{
                const res=await fetch("/api/brief",{method:"POST",headers:{"Content-Type":"application/json"},
                  body:JSON.stringify({goal:form.goal,industry:form.industry,icp:form.icp,voice:form.voice,brandContext:form.brandContext,item})});
                const data=await res.json();
                if(!res.ok) throw new Error(data.error||"Brief generation failed");
                const b=data.brief||{}; const lines=[];
                lines.push(`# ${b.title||item.title||"Content brief"}`,"",
                  `Goal alignment: ${b.goalAlignment||""}`,
                  `Target audience: ${b.targetAudience||""}`,
                  `Key angle: ${b.keyAngle||""}`,"","Outline:");
                (b.outline||[]).forEach((x,i)=>lines.push(`${i+1}. ${x}`));
                lines.push("","Key points:"); (b.keyPoints||[]).forEach(x=>lines.push(`- ${x}`));
                lines.push("","Sources to cite:"); (b.sourcesToCite||[]).forEach(x=>lines.push(`- ${typeof x==="string"?x:(x.title?`${x.title} — ${x.url}`:"")}`));
                lines.push("",`CTA: ${b.cta||""}`,"","Distribution checklist:"); (b.distributionChecklist||[]).forEach(x=>lines.push(`- ${x}`));
                lines.push("",`Tone guidance: ${b.toneGuidance||form.voice||""}`);
                const txt=lines.join("\n");
                const blob=new Blob([txt],{type:"text/plain;charset=utf-8;"}); const url=URL.createObjectURL(blob);
                const a=document.createElement("a"); a.href=url; a.download=`${(item.title||"brief").replace(/[^\w\-]+/g,"_").slice(0,80)}.txt`;
                document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
              }catch(e){ alert("Could not generate brief: "+(e?.message||e)); }
            }}
          />
        </section>
      )}
    </main>
  );
}
