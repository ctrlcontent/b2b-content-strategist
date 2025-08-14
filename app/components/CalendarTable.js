// app/components/CalendarTable.js
export default function CalendarTable({ calendar, onBrief }) {
  if (!calendar || !calendar.weeks?.length) {
    return <p className="mt-4 text-slate-600">No items to display.</p>;
    }

  return (
    <div className="space-y-6">
      {calendar.pillars?.length ? (
        <div className="card p-4">
          <h3 className="text-xl font-semibold mb-2">Pillars</h3>
          <ul className="list-disc ml-6 text-slate-700">
            {calendar.pillars.map((p, i) => (
              <li key={i}><span className="font-medium">{p.name}</span>: {p.why}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {calendar.weeks.map((w) => (
        <div key={w.week} className="card overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h4 className="font-semibold">Week {w.week}</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-left">
                  <th>Title</th>
                  <th>Format</th>
                  <th>Channel</th>
                  <th>Persona</th>
                  <th>Stage</th>
                  <th>Primary keyword</th>
                  <th>CTA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {w.items?.map((it, i) => (
                  <tr key={i}>
                    <td className="font-medium">{it.title}</td>
                    <td>{it.format}</td>
                    <td>{it.channel}</td>
                    <td>{it.persona}</td>
                    <td>{it.journeyStage}</td>
                    <td>{it.primaryKeyword}</td>
                    <td>{it.cta}</td>
                    <td>
                      <button
                        className="btn px-3 py-1 text-xs"
                        onClick={() => onBrief?.(w.week, i, it)}
                      >
                        Generate brief
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {w.items?.some(it => it.supportingKeywords?.length || it.notes) ? (
            <div className="px-4 py-3 text-xs text-slate-600 bg-slate-50">
              <p className="mb-1 font-medium">Notes & supporting keywords</p>
              <ul className="list-disc ml-5">
                {w.items?.map((it, i) => (
                  <li key={i}>
                    <span className="font-medium">{it.title}:</span>{" "}
                    {it.supportingKeywords?.length ? `KW: ${it.supportingKeywords.join(", ")}` : ""}
                    {it.supportingKeywords?.length && it.notes ? " — " : ""}
                    {it.notes || ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
