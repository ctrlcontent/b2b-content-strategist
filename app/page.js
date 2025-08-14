"use client";
import { useState } from "react";

export default function Home() {
  const [plan, setPlan] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    // Your existing logic for generating plan...
    // setPlan(generatedPlan);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero */}
      <section className="mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div
            className="absolute inset-0 opacity-[0.3]"
            style={{
              background:
                "radial-gradient(1200px 400px at 50% -400px, #ede9fe 0, rgba(237,233,254,0) 60%)",
            }}
          ></div>
          <div className="relative px-6 md:px-10 py-12 md:py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Simulate your content plan in minutes
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Plug in your goals, audience, and channels. Get a structured calendar and
              exportable briefs – tailored to your voice.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="#planner" className="btn">
                Start planning
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50"
              >
                See it in action
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Planner Form */}
      <section id="planner">
        <form
          onSubmit={onSubmit}
          className="card p-8 grid gap-8 bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
          {/* Keep all your existing grouped form fields here exactly as before */}
        </form>
      </section>

      {/* Plan Output */}
      {plan && (
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Plan</h2>
            <button className="btn-sm">Download CSV</button>
            <button className="btn-sm">Download ICS</button>
          </div>

          {/* Pillars */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-10 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Pillars</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              {/* map over plan.pillars here */}
            </ul>
          </div>

          {/* Weeks */}
          <div className="space-y-10">
            {/* map over plan.weeks here */}
            {/* Each week */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-xl font-semibold mb-4">Week 1</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        Title
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        Format
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        Channel
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        Persona
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        Stage
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        Primary keyword
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        CTA
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* map over week.items here */}
                    <tr>
                      <td className="p-3 text-slate-700">Example title</td>
                      <td className="p-3 text-slate-700">Article</td>
                      <td className="p-3 text-slate-700">Blog</td>
                      <td className="p-3 text-slate-700">Mid-market CTO</td>
                      <td className="p-3 text-slate-700">TOFU</td>
                      <td className="p-3 text-slate-700">fintech scaling</td>
                      <td className="p-3 text-slate-700">Download guide</td>
                      <td className="p-3">
                        <button className="btn-sm">Generate brief</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
