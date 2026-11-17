import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { INTER, PLAYFAIR, body, buttonText, cleanText, goldButton, inputClass, labelClass, labelStyle, leadError, loadSavedLead, recordToolLead, useQueryParams } from "./ui";

/**
 * Asks for practice name + work email before a dental tool opens. The page
 * underneath is still rendered (so it stays in the prerendered HTML for
 * search), just blurred and inert until the form is sent. Fields prefill from
 * ?practice= / ?email= or from the last tool used in this browser, but every
 * tool still needs its own submit so each use is recorded.
 */
export function LeadGate({
  tool,
  title,
  text,
  cta = "Open the tool",
  details,
  onUnlock,
  children,
}: {
  tool: string;
  title: string;
  text: string;
  cta?: string;
  /** Extra context sent with the lead, read at submit time. */
  details?: () => Record<string, string | number | boolean>;
  onUnlock?: (lead: { practiceName: string; email: string }) => void;
  children: ReactNode;
}) {
  const uid = useId();
  const params = useQueryParams();
  const [open, setOpen] = useState(false);
  const [practiceName, setPracticeName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    if (!params) return;
    startedAt.current = Date.now();
    const saved = loadSavedLead();
    setPracticeName(cleanText(params.get("practice"), 160) || saved.practiceName);
    setEmail(cleanText(params.get("email"), 200) || saved.email);
  }, [params]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = leadError(practiceName, email);
    if (err) return setError(err);
    recordToolLead(tool, practiceName, email, { page: window.location.pathname + window.location.search, ...(details?.() ?? {}) }, startedAt.current);
    onUnlock?.({ practiceName: cleanText(practiceName, 160), email: email.trim() });
    setOpen(true);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative">
      <div {...(open ? {} : { inert: "", "aria-hidden": true })} className={open ? "" : "blur-[6px] opacity-40 pointer-events-none select-none max-h-[1400px] overflow-hidden"}>
        {children}
      </div>
      {!open && (
        <div className="absolute inset-x-0 top-0 z-20 flex justify-center px-5 pt-10 sm:pt-16">
          <form onSubmit={submit} noValidate className="funnel-in w-full max-w-lg border border-blue-400/40 bg-[#0f172a] shadow-2xl p-6 sm:p-8" aria-labelledby={`${uid}-t`}>
            <p className="inline-flex items-center gap-2 text-blue-300 uppercase mb-4" style={{ fontFamily: INTER, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em" }}>
              <Lock size={13} aria-hidden="true" /> Free tool
            </p>
            <h2 id={`${uid}-t`} className="text-white" style={{ fontFamily: PLAYFAIR, fontSize: "1.7rem", fontWeight: 400, lineHeight: 1.2 }}>{title}</h2>
            <p className="text-white/65 mt-3" style={body("0.95rem")}>{text}</p>
            <div className="flex flex-col gap-4 mt-6">
              <div>
                <label htmlFor={`${uid}-p`} className={labelClass} style={labelStyle}>Practice name</label>
                <input id={`${uid}-p`} className={inputClass} style={body("1rem")} required maxLength={160} autoComplete="organization" placeholder="Maple Avenue Dental" value={practiceName} onChange={(e) => (setPracticeName(e.target.value), setError(""))} />
              </div>
              <div>
                <label htmlFor={`${uid}-e`} className={labelClass} style={labelStyle}>Work email</label>
                <input id={`${uid}-e`} className={inputClass} style={body("1rem")} required type="email" maxLength={200} autoComplete="email" placeholder="you@yourpractice.com" value={email} onChange={(e) => (setEmail(e.target.value), setError(""))} />
              </div>
            </div>
            {error && <p role="alert" className="text-[#f0a8a4] mt-3" style={body("0.88rem")}>{error}</p>}
            <button type="submit" className={`${goldButton} w-full mt-6`} style={buttonText}>
              {cta}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
            <p className="text-white/40 mt-4" style={body("0.76rem", 1.5)}>
              We use this to send you your results and follow up about them. No spam, and you can opt out anytime.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
