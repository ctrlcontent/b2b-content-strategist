// app/components/PlanView.js
export default function PlanView({ calendar, onBrief }) {
  if (!calendar?.weeks?.length) return null;

  return (
    <section className="space-y-6">
      {calendar.pillars?.length ? (
        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-2">Pillars</h3>
          <ul className="grid gap-2 text-slate-700 list-disc ml-5">
            {calendar.pillars.map((p, i) => (
              <li key={i}>
                <span className="font-medium">{p.name}</span> — {p.why}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {calendar.weeks.map((w) => (
        <div key={w.week} className="card overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white">
            <h4 className="font-semibold">Week {w.week}</h4>
          </div>

          <div className="p-5 space-y-4">
            {w.items?.map((it, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 p-4 flex flex-col gap-3 bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl leading-none">📝</div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{it.title}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      {it.format ? (
                        <span className="px-2 py-1 rounded-full border text-slate-600">
                          {it.format}
                        </span>
                      ) : null}
                      {it.channel ? (
                        <span className="px-2 py-1 rounded-full border text-slate-600">
                          {it.channel}
                        </span>
                      ) : null}
                      {it.persona ? (
                        <span className="px-2 py-1 rounded-full border text-slate-600">
                          {it.persona}
                        </span>
                      ) : null}
                      {it.journeyStage ? (
                        <span className="px-2 py-1 rounded-full border text-slate-600">
                          {it.journeyStage}
                        </span>
                      ) : null}
                      {it.primaryKeyword ? (
                        <span className="px-2 py-1 rounded-full border text-slate-600">
                          {it.primaryKeyword}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    onClick={() => onBrief?.(w.week, i, it)}
                    className="px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-50"
                  >
                    Generate brief
                  </button>
                </div>

                {(it.supportingKeywords?.length || it.notes) && (
                  <div className="text-sm text-slate-700">
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
