// app/components/PlanView.js
export default function PlanView({ calendar, onBrief }) {
  if (!calendar?.weeks?.length) return null;

  return (
    <section className="space-y-12">
      {/* Pillars */}
      {calendar.pillars?.length ? (
        <div className="card p-8">
          <h3 className="text-2xl font-semibold tracking-tight mb-3">Pillars</h3>
          <ul className="grid gap-2 text-slate-700 list-disc ml-5">
            {calendar.pillars.map((p, i) => (
              <li key={i}>
                <span className="font-medium">{p.name}</span> — {p.why}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Weeks */}
      {calendar.weeks.map((w) => (
        <div key={w.week} className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #6D28D9 0%, #A21CAF 100%)",
              }}
            >
              Week {w.week}
            </div>
            <div className="text-sm text-slate-500">
              {(w.items?.length || 0)} items
            </div>
          </div>

          {/* Items grid: 1 col on mobile, 2 cols on lg */}
          <div className="grid gap-5 md:gap-6 lg:grid-cols-2">
            {w.items?.map((it, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-lg font-semibold leading-snug pr-2">
                    {it.title}
                  </h4>
                  <button
                    onClick={() => onBrief?.(w.week, i, it)}
                    className="px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-50 shrink-0"
                  >
                    Generate brief
                  </button>
                </div>

                {/* metadata chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {it.format && <span className="chip">{it.format}</span>}
                  {it.channel && <span className="chip">{it.channel}</span>}
                  {it.persona && <span className="chip">{it.persona}</span>}
                  {it.journeyStage && <span className="chip">{it.journeyStage}</span>}
                  {it.primaryKeyword && (
                    <span className="chip">{it.primaryKeyword}</span>
                  )}
                </div>

                {(it.supportingKeywords?.length || it.notes) && (
                  <div className="mt-4 text-sm text-slate-700 leading-relaxed">
                    {it.supportingKeywords?.length ? (
                      <div className="mb-1">
                        <span className="font-medium">Keywords:</span>{" "}
                        {it.supportingKeywords.join(", ")}
                      </div>
                    ) : null}
                    {it.notes ? (
                      <div className="text-slate-600">{it.notes}</div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
