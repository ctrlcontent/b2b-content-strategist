// app/components/PlanView.js
export default function PlanView({ calendar, onBrief }) {
  if (!calendar?.weeks?.length) return null;

  return (
    <section className="space-y-10">
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
        <div
          key={w.week}
          className="card p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left rail: week label */}
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white"
                   style={{backgroundImage:'linear-gradient(90deg,#6D28D9,#A21CAF)'}}>
                Week {w.week}
              </div>
              <p className="mt-3 text-sm text-slate-500">
                {w.items?.length || 0} items
              </p>
            </div>

            {/* Items */}
            <div className="md:col-span-10 space-y-5">
              {w.items?.map((it, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-lg font-semibold leading-snug">
                        {it.title}
                      </h4>

                      {/* chips */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {it.format && <span className="chip">{it.format}</span>}
                        {it.channel && <span className="chip">{it.channel}</span>}
                        {it.persona && <span className="chip">{it.persona}</span>}
                        {it.journeyStage && <span className="chip">{it.journeyStage}</span>}
                        {it.primaryKeyword && <span className="chip">{it.primaryKeyword}</span>}
                      </div>
                    </div>

                    <div className="shrink-0 flex gap-2">
                      <button
                        onClick={() => onBrief?.(w.week, i, it)}
                        className="px-3 py-2 rounded-lg border text-sm hover:bg-slate-50"
                      >
                        Generate brief
                      </button>
                    </div>
                  </div>

                  {(it.supportingKeywords?.length || it.notes) && (
                    <div className="mt-4 text-slate-700 text-sm leading-relaxed">
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
        </div>
      ))}
    </section>
  );
}
