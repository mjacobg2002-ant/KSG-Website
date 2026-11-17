import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowRight, Check, MessageSquare, Phone, PhoneMissed, RotateCcw, Siren, CalendarCheck } from "lucide-react";
import { SEOHead, SITE } from "../components/SEOHead";
import { BOOK_CALL_URL } from "../components/dental/dentalConfig";
import { Eyebrow, INTER, body, buttonText, cleanText, display, focusScope, ghostButton, goldButton, inputClass, labelClass, labelStyle, mailto, postLead, useQueryParams } from "../components/funnel/ui";

const PAGE_URL = `${SITE}/demo-call`;
const TEXT_AT = 42; // seconds from missed call to the automatic text
const FAST = 6; // default playback speed, so the 42 seconds take about 7
const CALLER = "(703) 555-0142";
const EST_VALUE = "$1,200";

type Phase = "idle" | "ringing" | "missed" | "counting" | "texted" | "typing" | "triaged";
type Choice = "emergency" | "exam";
type Msg = { from: "office" | "patient"; text: string };

const REPLIES: Record<Choice, { pill: string; office: (p: string) => string; stage: string; tag: string; next: string }> = {
  emergency: {
    pill: "Emergency toothache",
    office: (p) => `Thank you. I've flagged this as urgent for the on-call team at ${p}. Expect a call back at this number within a few minutes.`,
    stage: "Emergency: on-call notified",
    tag: "Urgent",
    next: "On-call phone alerted by text. Lead held at the top of the pipeline until someone calls back.",
  },
  exam: {
    pill: "New patient exam",
    office: (p) => `Great! ${p} has openings tomorrow at 8:30 AM and Thursday at 2:00 PM. Reply 1 or 2 to hold a spot, or pick another time with the booking link.`,
    stage: "Booking link sent",
    tag: "New patient",
    next: "Next open slots offered. If there's no reply, a follow-up goes out at 8:00 AM.",
  },
};

const clock = (s: number) => `0:${String(Math.min(s, TEXT_AT)).padStart(2, "0")}`;

export function DemoCallPage() {
  const uid = useId();
  const params = useQueryParams();
  const [practice, setPractice] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [realTime, setRealTime] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  const thread = useRef<HTMLDivElement>(null);

  // "Send a real test text" form
  const [formPractice, setFormPractice] = useState("");
  const [phone, setPhone] = useState("");
  const [send, setSend] = useState<"idle" | "sending" | "done" | "error" | "fallback">("idle");
  const [sendError, setSendError] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    return () => timers.current.forEach(window.clearTimeout);
  }, []);
  useEffect(() => {
    const p = cleanText(params?.get("practice"), 60);
    if (p) {
      setPractice(p);
      setFormPractice(p);
    }
  }, [params]);
  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: "smooth" });
  }, [messages, phase]);

  const name = cleanText(practice, 60);
  const officeName = name || "our office";
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const addLog = (line: string) => setLog((l) => [...l, line]);

  // The 0:00 → 0:42 countdown. One tick per second in real time, or FAST× by default.
  useEffect(() => {
    if (phase !== "counting") return;
    if (seconds >= TEXT_AT) {
      setMessages([{ from: "office", text: `Hi! Sorry we missed your call at ${officeName}. Are you dealing with a dental emergency, or would you like to grab the next open appointment slot?` }]);
      addLog("+0:42  Automatic text-back sent");
      setPhase("texted");
      return;
    }
    const id = window.setTimeout(() => setSeconds((s) => s + 1), realTime ? 1000 : 1000 / FAST);
    return () => window.clearTimeout(id);
  }, [phase, seconds, realTime, officeName]);

  const reset = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setPhase("idle");
    setSeconds(0);
    setMessages([]);
    setChoice(null);
    setLog([]);
  };

  const start = () => {
    reset();
    setPhase("ringing");
    setLog(["9:47 PM  Incoming call, office closed"]);
    later(() => {
      setPhase("missed");
      addLog("9:47 PM  Call rang out. No voicemail left");
    }, 4200);
    later(() => setPhase("counting"), 5600);
  };

  const reply = (c: Choice) => {
    if (phase !== "texted") return;
    setChoice(c);
    setMessages((m) => [...m, { from: "patient", text: REPLIES[c].pill }]);
    addLog(`+1:05  Patient replied: "${REPLIES[c].pill}"`);
    setPhase("typing");
    later(() => {
      setMessages((m) => [...m, { from: "office", text: REPLIES[c].office(officeName) }]);
      addLog(`+1:06  Auto-triaged: ${REPLIES[c].stage}`);
    }, 1300);
    later(() => {
      setPhase("triaged");
      addLog(`+1:06  Lead card created (est. ${EST_VALUE})`);
    }, 2100);
  };

  const submitTest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!cleanText(formPractice)) return (setSend("error"), setSendError("Please enter your practice name."));
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) return (setSend("error"), setSendError("Please enter a 10-digit US cell number."));
    setSend("sending");
    const honeypot = (e.currentTarget.elements.namedItem("company_site") as HTMLInputElement | null)?.value ?? "";
    const res = await postLead("test-text", { practiceName: cleanText(formPractice, 160), phone }, startedAt.current, honeypot);
    if (res.ok) return setSend("done");
    if (res.unconfigured) return setSend("fallback");
    setSend("error");
    setSendError(res.message);
  };

  const running = phase !== "idle";
  const showThread = phase === "texted" || phase === "typing" || phase === "triaged";

  return (
    <div className={focusScope}>
      <SEOHead
        title="Lead Rescue Missed-Call Simulator for Dental Practices | Kind Supply Digital"
        description="Watch what happens when a new patient calls your dental practice after hours: the missed call, the automatic text-back 42 seconds later, and the lead landing in your pipeline."
        keywords="missed call text back dental, dental missed call simulator, Lead Rescue System, after hours dental calls"
        canonical={PAGE_URL}
      />

      {/* ============ HERO ============ */}
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]" aria-labelledby="demo-title">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <Eyebrow>Lead Rescue &middot; Live Simulator</Eyebrow>
          <h1 id="demo-title" className="text-white max-w-3xl" style={display("clamp(2rem, 5vw, 3.3rem)")}>
            It's 9:47 PM. A new patient with a chipped tooth is calling{name ? ` ${name}` : " your practice"}.
          </h1>
          <p className="text-white/65 max-w-2xl mt-5" style={body("1.05rem")}>
            Nobody's at the front desk. Press the button and watch what Lead Rescue does with that call.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-end mt-8 max-w-2xl">
            <div className="flex-1">
              <label htmlFor={`${uid}-practice`} className={labelClass} style={labelStyle}>
                Practice name <span className="text-white/40">(optional)</span>
              </label>
              <input id={`${uid}-practice`} className={inputClass} style={body("1rem")} placeholder="Maple Avenue Dental" maxLength={60} autoComplete="organization" value={practice} onChange={(e) => setPractice(e.target.value)} />
            </div>
            <button type="button" onClick={start} className={goldButton} style={buttonText}>
              <PhoneMissed size={17} aria-hidden="true" />
              {running ? "Run It Again" : "Simulate After-Hours Missed Call"}
            </button>
          </div>
          <label className="inline-flex items-center gap-2.5 mt-4 min-h-[44px] text-white/55 cursor-pointer" style={body("0.85rem")}>
            <input type="checkbox" className="w-4 h-4 accent-[#caa34e]" checked={realTime} onChange={(e) => setRealTime(e.target.checked)} />
            Play the 42-second wait in real time (default is sped up)
          </label>
        </div>
      </section>

      {/* ============ SIMULATOR ============ */}
      <section className="py-10 sm:py-14" aria-label="Missed-call simulator">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-8 lg:gap-14 items-start">
          {/* ---- Phone ---- */}
          <div className="mx-auto w-full max-w-[340px]">
            <div className="relative rounded-[2.4rem] border border-white/15 bg-[#060b16] p-3 shadow-2xl">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl bg-[#060b16] z-10" aria-hidden="true" />
              <div className="rounded-[1.9rem] bg-[#0f172a] overflow-hidden h-[560px] flex flex-col" role="group" aria-label="Patient's phone screen">
                <div className="flex items-center justify-between px-6 pt-3 pb-2 text-white/50" style={{ fontFamily: INTER, fontSize: "0.7rem", fontWeight: 600 }}>
                  <span>9:47</span>
                  <span>Tue &middot; after hours</span>
                </div>

                {phase === "idle" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                    <Phone size={30} className="text-white/25 mb-5" aria-hidden="true" />
                    <p className="text-white/55" style={body("0.92rem")}>Press &ldquo;Simulate After-Hours Missed Call&rdquo; to start.</p>
                  </div>
                )}

                {(phase === "ringing" || phase === "missed") && (
                  <div className="flex-1 flex flex-col items-center justify-between py-10 px-6 text-center" aria-live="polite">
                    <div>
                      <p className="text-white/50 uppercase mb-3" style={{ fontFamily: INTER, fontSize: "0.68rem", letterSpacing: "0.2em", fontWeight: 600 }}>
                        {phase === "ringing" ? `Calling ${officeName}…` : "Call ended"}
                      </p>
                      <p className="text-white" style={{ fontFamily: INTER, fontSize: "1.5rem", fontWeight: 500 }}>{CALLER}</p>
                      <p className="inline-block mt-3 px-3 py-1.5 bg-blue-500/15 border border-blue-400/30 text-blue-200" style={{ fontFamily: INTER, fontSize: "0.8rem", fontWeight: 500 }}>
                        Chipped tooth &mdash; new patient
                      </p>
                    </div>
                    {phase === "ringing" ? (
                      <div className="funnel-pulse w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                        <Phone size={30} className="funnel-ring text-[#0f172a]" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="funnel-in w-20 h-20 rounded-full bg-[#c2554f] flex items-center justify-center">
                        <PhoneMissed size={30} className="text-white" aria-hidden="true" />
                      </div>
                    )}
                    <p className="text-white/60" style={body("0.88rem")}>
                      {phase === "ringing" ? "Ringing… the office closed at 5:00 PM." : "No answer. No voicemail left."}
                    </p>
                  </div>
                )}

                {phase === "counting" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                    <p className="text-white/50 uppercase mb-4" style={{ fontFamily: INTER, fontSize: "0.68rem", letterSpacing: "0.2em", fontWeight: 600 }}>Since the missed call</p>
                    <p className="text-white tabular-nums" role="timer" aria-label={`${seconds} seconds since the missed call`} style={{ fontFamily: INTER, fontSize: "4rem", fontWeight: 300, lineHeight: 1 }}>
                      {clock(seconds)}
                    </p>
                    <div className="w-44 h-1 bg-white/10 mt-6" aria-hidden="true">
                      <div className="h-full bg-blue-500 transition-[width] duration-200 ease-linear" style={{ width: `${(seconds / TEXT_AT) * 100}%` }} />
                    </div>
                    <p className="text-white/55 mt-6" style={body("0.86rem")}>
                      {seconds < 30 ? "The patient is already back on Google, looking at the next dentist." : "Lead Rescue is sending a text…"}
                    </p>
                  </div>
                )}

                {showThread && (
                  <>
                    <div className="px-5 py-3 border-y border-white/8 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <MessageSquare size={14} className="text-blue-300" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white truncate" style={{ fontFamily: INTER, fontSize: "0.85rem", fontWeight: 600 }}>{name || "Your practice"}</p>
                        <p className="text-white/45" style={{ fontFamily: INTER, fontSize: "0.7rem" }}>Text message &middot; 0:42 after the call</p>
                      </div>
                    </div>
                    <div ref={thread} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" aria-live="polite">
                      {messages.map((m, i) => (
                        <p key={i} className={`funnel-in max-w-[86%] px-3.5 py-2.5 rounded-2xl ${m.from === "office" ? "self-start bg-[#1b2740] text-white/90 rounded-bl-md" : "self-end bg-blue-500 text-[#0f172a] rounded-br-md"}`} style={body("0.86rem", 1.5)}>
                          {m.text}
                        </p>
                      ))}
                      {phase === "typing" && messages[messages.length - 1]?.from === "patient" && (
                        <p className="self-start bg-[#1b2740] px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5" aria-label="Lead Rescue is replying">
                          <span className="funnel-dot w-1.5 h-1.5 rounded-full bg-white/70" />
                          <span className="funnel-dot w-1.5 h-1.5 rounded-full bg-white/70" />
                          <span className="funnel-dot w-1.5 h-1.5 rounded-full bg-white/70" />
                        </p>
                      )}
                    </div>
                    {phase === "texted" && (
                      <div className="px-4 pb-5 pt-3 border-t border-white/8">
                        <p className="text-white/50 mb-2.5" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500 }}>Reply as the patient:</p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(REPLIES) as Choice[]).map((c) => (
                            <button key={c} type="button" onClick={() => reply(c)} className="funnel-in min-h-[44px] px-4 rounded-full border border-blue-400/60 text-blue-200 hover:bg-blue-500 hover:text-[#0f172a] transition-colors" style={{ fontFamily: INTER, fontSize: "0.84rem", fontWeight: 600 }}>
                              {REPLIES[c].pill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {running && (
              <button type="button" onClick={reset} className="mx-auto mt-4 flex items-center gap-2 min-h-[44px] px-3 text-white/55 hover:text-white transition-colors" style={body("0.85rem")}>
                <RotateCcw size={14} aria-hidden="true" /> Reset
              </button>
            )}
          </div>

          {/* ---- Pipeline ---- */}
          <div className="min-w-0">
            <div className="border border-white/12 bg-[#0c1525]">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10">
                <p className="text-white" style={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600 }}>Lead Pipeline{name ? ` · ${name}` : ""}</p>
                <p className="text-white/45" style={{ fontFamily: INTER, fontSize: "0.72rem", letterSpacing: "0.08em" }}>LIVE</p>
              </div>
              <div className="p-5 sm:p-6 min-h-[230px]" aria-live="polite">
                {phase === "triaged" && choice ? (
                  <div className={`funnel-drop border-l-4 ${choice === "emergency" ? "border-[#c2554f]" : "border-blue-500"} bg-[#131d32] p-5`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 uppercase ${choice === "emergency" ? "bg-[#c2554f]/20 text-[#f3b6b2]" : "bg-blue-500/15 text-blue-200"}`} style={{ fontFamily: INTER, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em" }}>
                        {choice === "emergency" ? <Siren size={12} aria-hidden="true" /> : <CalendarCheck size={12} aria-hidden="true" />}
                        {REPLIES[choice].tag}
                      </span>
                      <span className="text-blue-300" style={{ fontFamily: INTER, fontSize: "1.25rem", fontWeight: 600 }}>Est. {EST_VALUE}</span>
                    </div>
                    <p className="text-white" style={{ fontFamily: INTER, fontSize: "1.05rem", fontWeight: 600 }}>{REPLIES[choice].pill} &middot; {CALLER}</p>
                    <p className="text-white/60 mt-1" style={body("0.86rem")}>Source: after-hours missed call &middot; Tue 9:47 PM</p>
                    <p className="text-white/85 mt-4 flex items-start gap-2" style={body("0.9rem")}>
                      <Check size={16} className="text-blue-300 shrink-0 mt-1" aria-hidden="true" />
                      <span><strong className="text-white">{REPLIES[choice].stage}.</strong> {REPLIES[choice].next}</span>
                    </p>
                  </div>
                ) : (
                  <div className="h-full min-h-[180px] border border-dashed border-white/15 flex items-center justify-center text-center px-6">
                    <p className="text-white/45" style={body("0.92rem")}>
                      {phase === "idle" ? "Rescued leads land here, each with a dollar value attached." : phase === "texted" ? "Waiting on the patient's reply. Tap one of the pills on the phone." : "Nothing yet. Without a text-back, this is where the story ends."}
                    </p>
                  </div>
                )}
              </div>
              <div className="px-5 sm:px-6 py-4 border-t border-white/10">
                <p className="text-white/45 uppercase mb-3" style={{ fontFamily: INTER, fontSize: "0.66rem", letterSpacing: "0.18em", fontWeight: 600 }}>Activity log</p>
                {log.length === 0 ? (
                  <p className="text-white/35" style={body("0.84rem")}>No activity yet.</p>
                ) : (
                  <ol className="flex flex-col gap-1.5">
                    {log.map((line, i) => (
                      <li key={i} className="funnel-in text-white/70 tabular-nums" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.78rem" }}>{line}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
            <p className="text-white/40 mt-4" style={body("0.8rem")}>
              Simulation with a sample caller. The text asks no health questions, and the {EST_VALUE} figure is an illustrative first-year patient value, not a promise.
            </p>
          </div>
        </div>
      </section>

      {/* ============ REAL TEST TEXT ============ */}
      <section className="py-14 lg:py-20 bg-[#0c1525] border-t border-white/8" aria-labelledby="test-title">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <Eyebrow>Try it on your own phone</Eyebrow>
          <h2 id="test-title" className="text-white" style={display("clamp(1.7rem, 3.6vw, 2.4rem)")}>Want to feel it buzz in your pocket?</h2>
          <p className="text-white/60 mt-4" style={body("1rem")}>Enter your cell and we'll send the same text-back to your phone, written for your practice.</p>

          {send === "done" ? (
            <p role="status" className="mt-8 border border-[#4f9a66]/50 bg-[#13261c] text-[#b5e0bf] p-5" style={body("0.98rem")}>
              Request received. Keep your phone handy: your test text comes from our Lead Rescue line shortly.
            </p>
          ) : (
            <form onSubmit={submitTest} noValidate className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor={`${uid}-company_site`}>Leave this field empty</label>
                <input id={`${uid}-company_site`} name="company_site" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>
              <div>
                <label htmlFor={`${uid}-fp`} className={labelClass} style={labelStyle}>Practice name</label>
                <input id={`${uid}-fp`} className={inputClass} style={body("1rem")} required maxLength={160} autoComplete="organization" value={formPractice} onChange={(e) => setFormPractice(e.target.value)} />
              </div>
              <div>
                <label htmlFor={`${uid}-ph`} className={labelClass} style={labelStyle}>Cell phone</label>
                <input id={`${uid}-ph`} className={inputClass} style={body("1rem")} required type="tel" inputMode="tel" autoComplete="tel" placeholder="(703) 555-0142" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={send === "sending"} className={`${goldButton} w-full sm:w-auto`} style={buttonText}>
                  {send === "sending" ? "Sending…" : "Send a Real Test Text to My Phone"}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
                <p className="text-white/45 mt-3" style={body("0.78rem")}>
                  By submitting, you agree to receive one demo text message from Kind Supply Digital at this number. Message and data rates may apply. We won't add you to a list.
                </p>
                {send === "error" && <p role="alert" className="text-[#f0a8a4] mt-3" style={body("0.9rem")}>{sendError}</p>}
                {send === "fallback" && (
                  <p role="alert" className="text-white/75 mt-3" style={body("0.9rem")}>
                    That didn't go through on our end.{" "}
                    <a className="underline underline-offset-4 text-blue-200" href={mailto("Lead Rescue test text request", [`Practice: ${formPractice}`, `Cell phone: ${phone}`, "I agree to receive one demo text at this number."])}>Send the request by email instead</a>.
                  </p>
                )}
              </div>
            </form>
          )}

          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-white/10">
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className={ghostButton} style={buttonText}>Book 15 minutes</a>
            <Link to="/dental-roi" className={ghostButton} style={buttonText}>What are missed calls costing you?</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
