/*
 * Dental Patient Leak & ROI Calculator: constants, formulas, URL parameters.
 *
 * Every number shown on /dental-roi comes from compute() below. The constants
 * are listed, with their source or "planning assumption" label, in the
 * methodology drawer on the page (ROI_METHOD in DentalRoiPage.tsx). If a
 * constant changes here, update that table in the same commit.
 *
 * Package price and guarantee terms are read from dentalConfig.ts, which
 * mirrors the published agreement, so this file can never disagree with it.
 */
import { GUARANTEE, PACKAGE } from "./dentalConfig";

export const ROI = {
  WEEKS_PER_MONTH: 4.33,
  /** Share of callers who reach voicemail and hang up without a message. */
  VOICEMAIL_HANGUP_RATE: 0.8,
  /** Share of inbound calls that are prospective new patients. */
  NEW_PATIENT_CALL_SHARE: 0.3,
  /** Share of answered new-patient inquiries that book. */
  FRONT_DESK_BOOK_RATE: 0.5,
  /** Share of abandoned callers a fast missed-call text-back re-engages. */
  LEAD_RESCUE_RECOVERY_RATE: 0.45,
  /** Target visitor-to-booking rate, in tenths of a percent (45 = 4.5%). */
  KSG_SITE_CVR_TENTHS: 45,
  /** Minimum improvement assumed over the current rate (25 = 2.5 points). */
  MIN_CVR_LIFT_TENTHS: 25,
  /** Google Ads cost per lead used for planning, in dollars. */
  DENTAL_ADS_CPL: 78,
  /** Share of paid-search leads that book. */
  ADS_LEAD_BOOK_RATE: 0.45,
} as const;

export type Basis = "first" | "ltv";

export type RoiInputs = {
  /** Missed calls per week. */
  missed: number;
  /** Monthly website visitors. */
  visitors: number;
  /** Current visitor-to-booking rate, in percent (1.5 = 1.5%). */
  cvr: number;
  basis: Basis;
  /** Average new patient value in dollars, on the selected basis. */
  value: number;
  /** Monthly Google Ads budget in dollars, paid to Google. */
  adspend: number;
  /** Include the separate Lead Rescue missed-call text-back add-on. */
  rescue: boolean;
};

type Range = { min: number; max: number; step: number; def: number };

export const LIMITS: Record<"missed" | "visitors" | "cvr" | "adspend", Range> & {
  value: Record<Basis, Range>;
} = {
  missed: { min: 2, max: 50, step: 1, def: 8 },
  visitors: { min: 100, max: 5000, step: 50, def: 600 },
  cvr: { min: 0.5, max: 6, step: 0.1, def: 1.5 },
  adspend: { min: 1000, max: 5000, step: 100, def: 1500 },
  value: {
    first: { min: 500, max: 3500, step: 50, def: 1200 },
    ltv: { min: 2000, max: 12000, step: 100, def: 4800 },
  },
};

export const DEFAULT_INPUTS: RoiInputs = {
  missed: LIMITS.missed.def,
  visitors: LIMITS.visitors.def,
  cvr: LIMITS.cvr.def,
  basis: "first",
  value: LIMITS.value.first.def,
  adspend: LIMITS.adspend.def,
  rescue: true,
};

export type RoiResult = {
  monthlyMissedCalls: number;
  lostPatientsFromCalls: number;
  monthlyCallLeak: number;
  /** Target visitor-to-booking rate, in percent. */
  targetSiteCvr: number;
  extraSitePatients: number;
  monthlySiteLeak: number;
  totalMonthlyLeak: number;
  annualLeak: number;
  recoveredCallPatients: number;
  adsBookedPatients: number;
  totalAddedPatients: number;
  projectedGrossRevenue: number;
  totalMonthlyInvestment: number;
  projectedNetProfit: number;
  roiMultiple: number;
  breakevenPatients: number;
  guaranteeEligible: boolean;
};

/** The formulas, exactly as specified. No rounding happens in here. */
export function compute(i: RoiInputs): RoiResult {
  const monthlyMissedCalls = i.missed * ROI.WEEKS_PER_MONTH;
  const lostPatientsFromCalls =
    monthlyMissedCalls * ROI.VOICEMAIL_HANGUP_RATE * ROI.NEW_PATIENT_CALL_SHARE * ROI.FRONT_DESK_BOOK_RATE;
  const monthlyCallLeak = lostPatientsFromCalls * i.value;

  // Rates are handled in tenths of a percent so 4.5% - 1.5% is exactly 3.0
  // points and not 0.030000000000000002.
  const currentTenths = Math.round(i.cvr * 10);
  const targetTenths = Math.max(ROI.KSG_SITE_CVR_TENTHS, currentTenths + ROI.MIN_CVR_LIFT_TENTHS);
  const extraSitePatients = (i.visitors * (targetTenths - currentTenths)) / 1000;
  const monthlySiteLeak = extraSitePatients * i.value;

  const totalMonthlyLeak = monthlyCallLeak + monthlySiteLeak;

  const recoveredCallPatients = i.rescue ? lostPatientsFromCalls * ROI.LEAD_RESCUE_RECOVERY_RATE : 0;
  const adsBookedPatients = (i.adspend / ROI.DENTAL_ADS_CPL) * ROI.ADS_LEAD_BOOK_RATE;
  const totalAddedPatients = recoveredCallPatients + extraSitePatients + adsBookedPatients;
  const projectedGrossRevenue = totalAddedPatients * i.value;

  const totalMonthlyInvestment = PACKAGE.monthly + i.adspend;

  return {
    monthlyMissedCalls,
    lostPatientsFromCalls,
    monthlyCallLeak,
    targetSiteCvr: targetTenths / 10,
    extraSitePatients,
    monthlySiteLeak,
    totalMonthlyLeak,
    annualLeak: totalMonthlyLeak * 12,
    recoveredCallPatients,
    adsBookedPatients,
    totalAddedPatients,
    projectedGrossRevenue,
    totalMonthlyInvestment,
    projectedNetProfit: projectedGrossRevenue - totalMonthlyInvestment,
    roiMultiple: projectedGrossRevenue / totalMonthlyInvestment,
    breakevenPatients: Math.ceil(totalMonthlyInvestment / i.value),
    guaranteeEligible: i.adspend >= GUARANTEE.minAdBudget,
  };
}

/*
 * Whole-dollar figures for the screen. Each line item is rounded once and the
 * totals are sums of those rounded lines, so anyone adding up what they see
 * gets exactly the total shown, with no off-by-a-dollar drift.
 */
export type RoiDisplay = {
  callLeak: number;
  siteLeak: number;
  totalLeak: number;
  annualLeak: number;
  rescueRevenue: number;
  siteRevenue: number;
  adsRevenue: number;
  gross: number;
  investment: number;
  net: number;
  roi: number;
};

export function present(i: RoiInputs, r: RoiResult): RoiDisplay {
  const callLeak = Math.round(r.monthlyCallLeak);
  const siteLeak = Math.round(r.monthlySiteLeak);
  const totalLeak = callLeak + siteLeak;
  const rescueRevenue = Math.round(r.recoveredCallPatients * i.value);
  const adsRevenue = Math.round(r.adsBookedPatients * i.value);
  const gross = rescueRevenue + siteLeak + adsRevenue;
  return {
    callLeak,
    siteLeak,
    totalLeak,
    annualLeak: totalLeak * 12,
    rescueRevenue,
    siteRevenue: siteLeak,
    adsRevenue,
    gross,
    investment: r.totalMonthlyInvestment,
    net: gross - r.totalMonthlyInvestment,
    roi: gross / r.totalMonthlyInvestment,
  };
}

/* ------------------------------------------------------------------ */
/* URL parameters                                                       */
/* ------------------------------------------------------------------ */

/** Clamp to a range and snap to the precision the field allows. */
export function clamp(n: number, range: Range, decimals = 0): number {
  const bounded = Math.min(range.max, Math.max(range.min, n));
  const f = 10 ** decimals;
  return Math.round(bounded * f) / f;
}

const num = (raw: string | null): number | null => {
  if (raw === null || raw.trim() === "") return null;
  const n = Number(raw.replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) ? n : null;
};

export const MAX_PRACTICE_LENGTH = 80;

export function cleanPractice(raw: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/[\u0000-\u001F\u007F<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_PRACTICE_LENGTH);
}

/**
 * ?practice=Practice+Name&missed=12&visitors=600&cvr=1.5&value=1200&adspend=1500
 * Optional: basis=first|ltv (inferred from value when omitted), rescue=0|1.
 * Anything missing or unreadable falls back to the default; anything out of
 * range is pulled to the nearest allowed value.
 */
export function parseRoiParams(params: URLSearchParams): { inputs: RoiInputs; practice: string } {
  const inputs: RoiInputs = { ...DEFAULT_INPUTS };

  const missed = num(params.get("missed"));
  if (missed !== null) inputs.missed = clamp(missed, LIMITS.missed);
  const visitors = num(params.get("visitors"));
  if (visitors !== null) inputs.visitors = clamp(visitors, LIMITS.visitors);
  const cvr = num(params.get("cvr"));
  if (cvr !== null) inputs.cvr = clamp(cvr, LIMITS.cvr, 1);
  const adspend = num(params.get("adspend"));
  if (adspend !== null) inputs.adspend = clamp(adspend, LIMITS.adspend);

  const value = num(params.get("value"));
  const basisParam = params.get("basis");
  if (basisParam === "ltv" || basisParam === "first") inputs.basis = basisParam;
  else if (value !== null && value > LIMITS.value.first.max) inputs.basis = "ltv";
  inputs.value = value !== null ? clamp(value, LIMITS.value[inputs.basis]) : LIMITS.value[inputs.basis].def;

  const rescue = params.get("rescue");
  if (rescue === "0" || rescue === "false") inputs.rescue = false;

  return { inputs, practice: cleanPractice(params.get("practice")) };
}

export function roiQuery(inputs: RoiInputs, practice = ""): URLSearchParams {
  const q = new URLSearchParams();
  if (practice) q.set("practice", practice);
  q.set("missed", String(inputs.missed));
  q.set("visitors", String(inputs.visitors));
  q.set("cvr", String(inputs.cvr));
  q.set("value", String(inputs.value));
  q.set("basis", inputs.basis);
  q.set("adspend", String(inputs.adspend));
  if (!inputs.rescue) q.set("rescue", "0");
  return q;
}

export const ROI_PATH = "/dental-roi";
export const ROI_CONTACT_SOURCE = "dental-roi";

/** Where the main button sends people: /contact, carrying inputs and results. */
export function roiContactHref(inputs: RoiInputs, practice: string, d: RoiDisplay, r: RoiResult): string {
  const q = roiQuery(inputs, practice);
  q.set("source", ROI_CONTACT_SOURCE);
  q.set("leak", String(d.totalLeak));
  q.set("patients", r.totalAddedPatients.toFixed(1));
  q.set("gross", String(d.gross));
  q.set("net", String(d.net));
  return `/contact?${q.toString()}`;
}

/** Plain-text summary for the message that reaches the agency. */
export function roiSummary(inputs: RoiInputs, d: { leak: string; patients: string; gross: string; net: string }): string {
  return [
    `Missed calls/week: ${inputs.missed}`,
    `Website visitors/month: ${inputs.visitors}`,
    `Visitor-to-booking rate: ${inputs.cvr}%`,
    `New patient value: $${inputs.value} (${inputs.basis === "ltv" ? "5-year lifetime" : "first-year"})`,
    `Google Ads budget: $${inputs.adspend}/month`,
    `Lead Rescue add-on: ${inputs.rescue ? "included" : "not included"}`,
    `Estimated leak: $${d.leak}/month`,
    `Projected added patients: ${d.patients}/month`,
    `Projected production: $${d.gross}/month`,
    `Projected net: $${d.net}/month`,
  ].join("\n");
}
