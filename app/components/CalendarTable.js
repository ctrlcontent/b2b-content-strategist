// app/components/CalendarTable.js
export default function CalendarTable({ calendar, onBrief }) {
  if (!calendar || !calendar.weeks || calendar.weeks.length === 0) {
    return <p className="mt-4 text-gray-600">No items to display.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Pillars */}
      {calendar.pillars?.length ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">Pillars</h3>
          <ul className="list-disc ml-6">
            {calendar.pillars.map((p, i) => (
              <li key={i}><span className="font-medium">{p.name}</span>: {p.why}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Weeks */}
      {calendar.weeks.map((w) => (
        <div key={w.week} className="border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h4 className="font-semibold">Week {w.week}</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Format</th>
                  <th className="px-4 py-2">Channel</th>
                  <th className="px-4 py-2">Persona</th>
                  <th className="px-4 py-2">Stage</th>
                  <th className="px-4 py-2">Primary keyword</th>
                  <th className="px-4 py-2">CTA</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {w.items?.map((it, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2 font-medium">{it.title}</td>
                    <td className="px-4 py-2">{it.format}</td>
                    <td className="px-4 py-2">{it.channel}</td>
                    <td className="px-4 py-2">{it.persona}</td>
                    <td className="px-4 py-2">{it.journeyStage}</td>
                    <td className="px-4 py-2">{it.primaryKeyword}</td>
                    <td className="px-4 py-2">{it.cta}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-xs bg-black text-white rounded px-2 py-1"
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
            <div className="px-4 py-3 text-xs text-gray-600 bg-gray-50">
              <p className="mb-1"><span className="font-semibold">Notes & supporting keywords</span></p>
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
