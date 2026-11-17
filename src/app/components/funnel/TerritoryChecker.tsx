import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Lock, MapPin, ShieldCheck } from "lucide-react";
import territories from "../../../../data/territories.json";
import { GUARANTEE } from "../dental/dentalConfig";
import { INTER, PLAYFAIR, body, buttonText, cleanText, goldButton, inputClass, labelClass, labelStyle, mailto, postLead } from "./ui";

type Entry = { zip: string; area?: string; partners?: number };
/** Partner practices accepted per ZIP code. */
export const SLOTS_PER_ZIP = Math.max(1, Number(territories.slotsPerZip) || 3);
const claimed = territories.claimedZips as Entry[];
const highDemand = territories.highDemandZips as Entry[];

export type TerritoryStatus = { zip: string; state: "claimed" | "open"; area?: string; highDemand: boolean; taken: number; open: number };

export function lookupTerritory(zip: string): TerritoryStatus {
  const hit = claimed.find((c) => c.zip === zip);
  const hot = highDemand.find((c) => c.zip === zip);
  const taken = hit ? Math.min(SLOTS_PER_ZIP, Math.max(1, Math.round(hit.partners ?? SLOTS_PER_ZIP))) : 0;
  const open = SLOTS_PER_ZIP - taken;
  return { zip, state: open > 0 ? "open" : "claimed", area: hit?.area ?? hot?.area, highDemand: Boolean(hot), taken, open };
}

const slotWord = (n: number) => `${n} Partner Slot${n === 1 ? "" : "s"}`;

/**
 * ZIP territory exclusivity checker, driven by data/territories.json.
 * `initialZip` (e.g. from /start?zip=) is checked automatically.
 */
export function TerritoryChecker({ initialZip = "", practice = "", headingId }: { initialZip?: string; practice?: string; headingId?: string }) {
  const uid = useId();
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<TerritoryStatus | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [wait, setWait] = useState<"idle" | "sending" | "done" | "fallback">("idle");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (/^\d{5}$/.test(initialZip)) {
      setZip(initialZip);
      setResult(lookupTerritory(initialZip));
    }
  }, [initialZip]);

  const check = (e: FormEvent) => {
    e.preventDefault();
    setWait("idle");
    if (!/^\d{5}$/.test(zip)) {
      setResult(null);
      setError("Enter the 5-digit ZIP code of your practice.");
      return;
    }
    setError("");
    setResult(lookupTerritory(zip));
  };

  const joinWaitlist = async (e: FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setWait("sending");
    const res = await postLead("waitlist", { zip: result.zip, email, practiceName: cleanText(practice, 160) }, startedAt.current);
    setWait(res.ok ? "done" : "fallback");
  };

  const startHref = result ? `/start?zip=${result.zip}${practice ? `&practice=${encodeURIComponent(practice)}` : ""}` : "/start";

  return (
    <div className="border border-white/12 bg-[#0c1525] p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-6">
        <MapPin size={22} className="text-blue-300 shrink-0 mt-1" aria-hidden="true" />
        <div>
          <h3 id={headingId} className="text-white mb-2" style={{ fontFamily: PLAYFAIR, fontSize: "1.55rem", fontWeight: 400, lineHeight: 1.2 }}>
            Is your ZIP code still open?
          </h3>
          <p className="text-white/60" style={body("0.95rem")}>
            We cap every ZIP code at {SLOTS_PER_ZIP} partner practices, so you aren&rsquo;t bidding against a dozen offices on the same block for the same patients.
          </p>
        </div>
      </div>

      <form onSubmit={check} noValidate className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label htmlFor={`${uid}-zip`} className={labelClass} style={labelStyle}>
            Practice ZIP code
          </label>
          <input
            id={`${uid}-zip`}
            className={inputClass}
            style={{ fontFamily: INTER, fontSize: "1.05rem", letterSpacing: "0.12em" }}
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}"
            maxLength={5}
            placeholder="22180"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            aria-describedby={error ? `${uid}-err` : undefined}
            aria-invalid={Boolean(error)}
          />
        </div>
        <button type="submit" className={goldButton} style={buttonText}>
          Check Territory Availability
        </button>
      </form>
      {error && (
        <p id={`${uid}-err`} role="alert" className="text-[#f0a8a4] mt-3" style={body("0.88rem")}>
          {error}
        </p>
      )}

      <div aria-live="polite">
        {result?.state === "claimed" && (
          <div className="funnel-in mt-6 border border-[#c2554f]/50 bg-[#2a1719] p-5 sm:p-6">
            <p className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#c2554f]/20 border border-[#c2554f]/50 text-[#f3b6b2] uppercase mb-4" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em" }}>
              <Lock size={13} aria-hidden="true" /> Territory Locked
            </p>
            <p className="text-white/85" style={body("1rem")}>
              All {SLOTS_PER_ZIP} partner slots in <strong className="text-white">{result.zip}</strong>
              {result.area ? ` (${result.area})` : ""} are taken. Join the waitlist if a spot opens.
            </p>
            {wait === "done" ? (
              <p className="text-[#a9d7b0] mt-4" style={body("0.92rem")}>You're on the waitlist for {result.zip}. We'll email you if it opens.</p>
            ) : (
              <form onSubmit={joinWaitlist} className="flex flex-col sm:flex-row gap-3 mt-5">
                <label htmlFor={`${uid}-email`} className="sr-only">Business email</label>
                <input id={`${uid}-email`} type="email" required autoComplete="email" placeholder="you@yourpractice.com" className={`${inputClass} flex-1`} style={body("0.95rem")} value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" disabled={wait === "sending"} className="inline-flex items-center justify-center min-h-[50px] px-5 border border-white/25 text-white hover:border-white/60 transition-colors disabled:opacity-50" style={buttonText}>
                  {wait === "sending" ? "Adding…" : "Join the waitlist"}
                </button>
              </form>
            )}
            {wait === "fallback" && (
              <p className="text-white/70 mt-3" style={body("0.88rem")}>
                That didn't go through.{" "}
                <a className="underline underline-offset-4 text-blue-200" href={mailto(`Territory waitlist: ${result.zip}`, [`Please add me to the waitlist for ZIP ${result.zip}.`, `Email: ${email}`, practice ? `Practice: ${practice}` : ""])}>
                  Email us instead
                </a>
                .
              </p>
            )}
          </div>
        )}

        {result?.state === "open" && (
          <div className="funnel-in mt-6 border border-[#4f9a66]/50 bg-[#13261c] p-5 sm:p-6">
            <p className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4f9a66]/20 border border-[#4f9a66]/50 text-[#b5e0bf] uppercase mb-4" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em" }}>
              <ShieldCheck size={13} aria-hidden="true" /> Territory Open
            </p>
            <p className="text-white/90" style={body("1rem")}>
              Territory Open in <strong className="text-white">{result.zip}</strong>
              {result.area ? ` (${result.area})` : ""} &mdash; {result.taken ? `${result.open} of ${SLOTS_PER_ZIP} Partner Slots Left` : `${slotWord(SLOTS_PER_ZIP)} Available`} (Eligible for {GUARANTEE.bookedNewPatients}-Patient Guarantee)
            </p>
            {result.open === 1 && (
              <p className="text-[#e8d4a1] mt-2" style={body("0.88rem")}>Last slot in this ZIP code.</p>
            )}
            {result.highDemand && (
              <p className="text-[#e8d4a1] mt-2" style={body("0.88rem")}>High-demand area: we get more inquiries from this ZIP than most.</p>
            )}
            <a href={startHref} className={`${goldButton} mt-5`} style={buttonText}>
              Lock In {result.zip} Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
