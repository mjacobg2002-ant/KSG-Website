import { useId, useState, type CSSProperties, type ReactNode } from "react";

const INTER = "'Inter', sans-serif";

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Decimal places the field accepts (0 for whole numbers). */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  hint?: ReactNode;
  /** Spoken value for screen readers, e.g. "8 calls per week". */
  valueText?: string;
  onChange: (next: number) => void;
};

/**
 * A slider with a number box beside it. Either one sets the value; typing
 * updates results as soon as the number is inside the allowed range, and
 * leaving the box pulls anything outside the range back to the nearest limit.
 */
export function RangeField({
  label,
  value,
  min,
  max,
  step,
  decimals = 0,
  prefix,
  suffix,
  hint,
  valueText,
  onChange,
}: RangeFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const factor = 10 ** decimals;
  const snap = (n: number) => Math.round(Math.min(max, Math.max(min, n)) * factor) / factor;
  const fill = `${((value - min) / (max - min)) * 100}%`;
  const shown = decimals ? value.toFixed(decimals) : String(value);

  const type = (raw: string) => {
    setDraft(raw);
    const n = Number(raw.replace(/[^0-9.]/g, ""));
    if (raw.trim() !== "" && Number.isFinite(n) && n >= min && n <= max) onChange(snap(n));
  };
  const finish = () => {
    if (draft !== null) {
      const n = Number(draft.replace(/[^0-9.]/g, ""));
      if (draft.trim() !== "" && Number.isFinite(n)) onChange(snap(n));
    }
    setDraft(null);
  };

  const fmt = (n: number) => `${prefix ?? ""}${n.toLocaleString("en-US")}${suffix ?? ""}`;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={`${id}-range`} className="text-white" style={{ fontFamily: INTER, fontSize: "0.98rem", fontWeight: 500, lineHeight: 1.35 }}>
          {label}
        </label>
        <div className="shrink-0 flex items-center h-11 w-[7.25rem] border border-white/25 bg-white/[0.04] focus-within:border-blue-400 transition-colors">
          {prefix ? (
            <span className="pl-3 text-white/60" style={{ fontFamily: INTER, fontSize: "1rem" }} aria-hidden="true">
              {prefix}
            </span>
          ) : null}
          <input
            id={`${id}-box`}
            type="text"
            inputMode={decimals ? "decimal" : "numeric"}
            autoComplete="off"
            aria-label={`${label}, type a number`}
            value={draft ?? shown}
            onChange={(e) => type(e.target.value)}
            onBlur={finish}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="w-full min-w-0 h-full bg-transparent px-2 text-right text-white tabular-nums lining-nums focus:outline-none"
            style={{ fontFamily: INTER, fontSize: "1rem", fontWeight: 600 }}
          />
          {suffix ? (
            <span className="pr-3 text-white/60" style={{ fontFamily: INTER, fontSize: "1rem" }} aria-hidden="true">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        className="roi-range mt-1"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        aria-describedby={hint ? `${id}-hint` : undefined}
        style={{ "--fill": fill } as CSSProperties}
        onChange={(e) => {
          setDraft(null);
          onChange(snap(Number(e.target.value)));
        }}
      />
      <div className="flex justify-between text-white/45 tabular-nums lining-nums -mt-1" style={{ fontFamily: INTER, fontSize: "0.72rem" }} aria-hidden="true">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-white/60 mt-2 mb-0" style={{ fontFamily: INTER, fontSize: "0.8rem", lineHeight: 1.55 }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
