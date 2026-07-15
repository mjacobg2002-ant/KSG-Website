import { AnimatedSection } from "./AnimatedSection";

type Lead = { name: string; meta: string; value: string };
type Column = { title: string; count: number; leads: Lead[] };

const columns: Column[] = [
  {
    title: "New Lead",
    count: 3,
    leads: [
      { name: "Water heater burst", meta: "Missed call · 10:47 PM · auto-texted", value: "Est. $2,400" },
      { name: "Drain backup", meta: "Web form · 8:12 AM", value: "Est. $450" },
      { name: "Repipe estimate", meta: "Google Ads · 9:03 AM", value: "Est. $9,000" },
    ],
  },
  {
    title: "Contacted",
    count: 2,
    leads: [
      { name: "Sump pump failure", meta: "Replied YES · called back in 42s", value: "Est. $1,800" },
      { name: "Garbage disposal", meta: "Text thread active", value: "Est. $380" },
    ],
  },
  {
    title: "Booked",
    count: 2,
    leads: [
      { name: "Tankless install", meta: "Thu 8:00 AM · self-booked", value: "Est. $4,600" },
      { name: "Leak inspection", meta: "Fri 1:00 PM", value: "Est. $250" },
    ],
  },
  {
    title: "Won",
    count: 2,
    leads: [
      { name: "Sewer line repair", meta: "Closed · review requested", value: "$7,200" },
      { name: "Water heater swap", meta: "Closed · 5-star review left", value: "$2,400" },
    ],
  },
];

export function PipelineBoard() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
        {columns.map((col, i) => (
          <AnimatedSection key={col.title} delay={i * 0.1}>
            <div className="bg-[#0f172a] p-6 h-full">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                <p
                  className="text-white/70 uppercase"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", fontWeight: 500 }}
                >
                  {col.title}
                </p>
                <span
                  className="text-blue-300/40"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem" }}
                >
                  {col.count}
                </span>
              </div>

              <div className="space-y-3">
                {col.leads.map((lead) => (
                  <div
                    key={lead.name}
                    className="bg-[#131d32] border border-white/5 rounded-sm p-4 hover:border-blue-400/20 transition-colors duration-500"
                  >
                    <p
                      className="text-white/80 mb-1"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
                    >
                      {lead.name}
                    </p>
                    <p
                      className="text-white/30 mb-3"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", lineHeight: "1.5" }}
                    >
                      {lead.meta}
                    </p>
                    <p
                      className="text-blue-300/70"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.03em" }}
                    >
                      {lead.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <p
        className="text-center text-white/25 mt-8"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", letterSpacing: "0.03em" }}
      >
        Sample pipeline &mdash; your board, your jobs, your numbers.
      </p>
    </div>
  );
}
