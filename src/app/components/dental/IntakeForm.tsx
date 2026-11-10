import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { CONTACT_EMAIL, INTAKE_ENDPOINT } from "./dentalConfig";

/*
 * Shared intake form for the two paths on /dental-marketing:
 *   - "enrollment": Get Started with the package (we confirm fit, then send
 *     the agreement and secure Stripe checkout).
 *   - "assessment": request a written practice growth assessment.
 *
 * Posts JSON to api/dental-intake.js. Spam protection: a hidden honeypot
 * field, a minimum time-on-form, and server-side validation + rate limiting.
 * If the endpoint is unavailable (not yet configured, offline, local dev), the
 * visitor gets a pre-filled email instead of a silent failure.
 */

type FieldType = "text" | "email" | "url" | "select" | "textarea";

export type IntakeField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: string[];
  maxLength?: number;
  autoComplete?: string;
  /** Grid span on wide screens. */
  half?: boolean;
};

type Props = {
  kind: "enrollment" | "assessment";
  fields: IntakeField[];
  submitLabel: string;
  successTitle: string;
  successBody: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 3000;

function validate(field: IntakeField, raw: string): string | null {
  const value = raw.trim();
  if (field.required && !value)
    return field.type === "select" ? "Please choose an option." : `Please enter ${field.label.toLowerCase()}.`;
  if (!value) return null;
  if (field.type === "email" && !EMAIL_RE.test(value)) return "Please enter a valid email address.";
  if (field.type === "url") {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const u = new URL(candidate);
      if (!u.hostname.includes(".")) throw new Error("no tld");
    } catch {
      return "Please enter a valid web address, like yourpractice.com.";
    }
  }
  if (field.maxLength && value.length > field.maxLength)
    return `Please keep this under ${field.maxLength} characters.`;
  return null;
}

const labelStyle = { fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.02em" };
const inputClass =
  "w-full bg-white/[0.03] border border-white/15 px-4 py-3 text-white placeholder:text-white/35 transition-colors duration-200 hover:border-white/25 focus:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 aria-[invalid=true]:border-red-400/70";

export function IntakeForm({ kind, fields, submitLabel, successTitle, successBody }: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(Date.now());
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "sent" || status === "fallback") statusRef.current?.focus();
  }, [status]);

  const set = (name: string, v: string) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const mailtoHref = () => {
    const subject =
      kind === "enrollment"
        ? `Complete Dental Growth Package — ${values.practiceName || "enrollment request"}`
        : `Written Practice Growth Assessment — ${values.practiceName || "request"}`;
    const body = fields
      .map((f) => `${f.label}: ${values[f.name]?.trim() || "—"}`)
      .join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const f of fields) {
      const msg = validate(f, values[f.name] ?? "");
      if (msg) nextErrors[f.name] = msg;
    }
    setErrors(nextErrors);
    const firstBad = fields.find((f) => nextErrors[f.name]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad.name}"]`)?.focus();
      return;
    }

    const honeypot = (formRef.current?.elements.namedItem("company_site") as HTMLInputElement | null)?.value ?? "";
    setStatus("sending");
    try {
      const res = await fetch(INTAKE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          fields: Object.fromEntries(fields.map((f) => [f.name, (values[f.name] ?? "").trim()])),
          company_site: honeypot,
          elapsedMs: Date.now() - startedAt.current,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("fallback");
    }
  };

  if (status === "sent") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="border border-blue-400/30 bg-blue-500/[0.06] p-8 focus:outline-none"
      >
        <div className="w-10 h-10 mb-5 rounded-full border border-blue-400/40 flex items-center justify-center">
          <Check size={18} className="text-blue-300" aria-hidden="true" />
        </div>
        <p className="text-white mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400 }}>
          {successTitle}
        </p>
        <p className="text-white/65" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", lineHeight: 1.75 }}>
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-privacy`}>
      {/* Honeypot: invisible to people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
        <label htmlFor={`${uid}-company_site`}>Leave this field empty</label>
        <input id={`${uid}-company_site`} name="company_site" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
        {fields.map((f) => {
          const id = `${uid}-${f.name}`;
          const err = errors[f.name];
          const describedBy = [f.hint ? `${id}-hint` : "", err ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
          const common = {
            id,
            name: f.name,
            value: values[f.name],
            required: f.required,
            "aria-required": f.required || undefined,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": describedBy,
            className: inputClass,
            style: { fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", borderRadius: 0 },
          } as const;
          return (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              <label htmlFor={id} className="block text-white/80 mb-2" style={labelStyle}>
                {f.label}
                {f.required ? (
                  <span className="text-blue-300/80" aria-hidden="true"> *</span>
                ) : (
                  <span className="text-white/45 font-normal"> (optional)</span>
                )}
              </label>
              {f.type === "select" ? (
                <select
                  {...common}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={`${inputClass} appearance-none bg-[length:12px] bg-no-repeat bg-[right_1rem_center] pr-10`}
                  style={{
                    ...common.style,
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%23dcc07b' stroke-width='1.5'/%3E%3C/svg%3E\")",
                  }}
                >
                  <option value="" className="bg-[#0f172a]">Select…</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o} className="bg-[#0f172a]">
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  {...common}
                  rows={3}
                  maxLength={f.maxLength}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={`${inputClass} resize-y min-h-[96px]`}
                />
              ) : (
                <input
                  {...common}
                  type={f.type === "url" ? "text" : f.type}
                  inputMode={f.type === "url" ? "url" : f.type === "email" ? "email" : undefined}
                  autoComplete={f.autoComplete}
                  maxLength={f.maxLength ?? 160}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.hint && !err ? (
                <p id={`${id}-hint`} className="text-white/50 mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.76rem", lineHeight: 1.6 }}>
                  {f.hint}
                </p>
              ) : null}
              {err ? (
                <p id={`${id}-err`} className="text-red-300 mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem" }}>
                  {err}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <p
        id={`${uid}-privacy`}
        className="text-white/55 mt-6"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.76rem", lineHeight: 1.7 }}
      >
        We use these details only to respond to your request and follow up about it. We don&rsquo;t sell
        your information. Please don&rsquo;t include patient names or any health information.{" "}
        <Link to="/privacy-policy" className="text-blue-300/90 underline underline-offset-2 hover:text-blue-200">
          Privacy Policy
        </Link>
      </p>

      {status === "fallback" ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 border border-amber-300/30 bg-amber-300/[0.05] p-5 focus:outline-none"
        >
          <p className="text-white/85 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: 1.65 }}>
            We couldn&rsquo;t send this automatically. Your answers are still here &mdash; you can send them
            to us by email instead.
          </p>
          <a
            href={mailtoHref()}
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.86rem", fontWeight: 500 }}
          >
            Send by email to {CONTACT_EMAIL}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-4 whitespace-nowrap bg-blue-500 text-[#0f172a] font-medium hover:bg-blue-400 disabled:opacity-60 disabled:cursor-wait transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
