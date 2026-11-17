/** Free dental tools, linked from the navbar, footer and /dental-marketing. */
export const DENTAL_TOOLS = [
  { label: "Free Website & Rank Check", path: "/audit", desc: "Scan your site for speed, local SEO, booking and pixel gaps. Scored 1–10." },
  { label: "Missed-Call Simulator", path: "/demo-call", desc: "Watch an after-hours call get texted back and land in your pipeline." },
  { label: "Patient Leak & ROI Calculator", path: "/dental-roi", desc: "See what missed calls and non-booking visitors cost you each month." },
  { label: "Map Pack Competitor Snapshot", path: "/map-gap", desc: "Your reviews vs. the #1 practice on the map, and the patients it costs you." },
  { label: "Check Territory Availability", path: "/start", desc: "We take 3 partner practices per ZIP code. See if yours has a slot." },
  { label: "Sample Client Portal", path: "/portal/demo-practice", desc: "The launch and guarantee tracker every client gets." },
] as const;

export const DENTAL_TOOL_PATHS: string[] = DENTAL_TOOLS.map((t) => t.path);
