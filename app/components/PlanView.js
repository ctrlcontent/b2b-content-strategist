// app/components/PlanView.js
export default function PlanView({ calendar, onBrief }) {
  if (!calendar?.weeks?.length) return null;

  return (
    <section className="space-y-8">
      {/* Pillars */}
      {calendar.pillars?.length ? (
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-3">Pillars</h3>
          <ul className="grid gap-2 text-slate-700 list-disc ml-5">
            {calendar.pillars.map((p, i) => (
              <li key={i}><span className="font-medium">{p.name}</span> — {p.why}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Weeks */}
      {calendar.weeks.map((w) => (
        <div key={w.week} className="card overflow-hidden">
          <div className="px-6 py-3 bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white">
            <h4 className="font-semibold">Week {w.week}</h4>
          </div>

          <div className="p-6 grid gap-4">
            {w.items?.map((it, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 p-4 bg-white hover:shadow-sm transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📝</div>
                    <div>
                      <div className="font-semibold text-slate-900">{it.title}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {it.format && <span className="chip">{it.format}</span>}
                        {it.channel && <span className="chip">{it.channel}</span>}
                        {it.persona && <span className="chip">{it.persona}</span>}
                        {it.journeyStage && <span className="chip">{it.journeyStage}</span>}
                        {it.primaryKeyword && <span className="chip">{it.primaryKeyword}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onBrief?.(w.week, i, it)}
                      className="px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-50"
                    >
                      Generate brief
                    </button>
                  </div>
                </div>

                {(it.supportingKeywords?.length || it.notes) && (
                  <div className="text-sm text-slate-700 mt-3">
                    {it.supportingKeywords?.length ? (
                      <div className="mb-1">
                        <span className="font-medium">Keywords:</span>{" "}
                        {it.supportingKeywords.join(", ")}
                      </div>
                    ) : null}
                    {it.notes ? <div className="text-slate-600">{it.notes}</div> : null}
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
