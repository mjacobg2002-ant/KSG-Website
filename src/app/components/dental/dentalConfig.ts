/*
 * Single source of truth for the Complete Dental Growth Package page.
 *
 * Every pricing and terms statement on /dental-marketing must match the
 * general agreement published at AGREEMENT_PATH (Agreement Version:
 * November 9, 2026). If the agreement changes, update this file and re-check
 * the FAQ in DentalMarketingPage.tsx against the new text.
 */

/** General (non-client-specific) agreement + Stripe checkout. Not linked
 *  publicly: applicants receive it after we confirm the package fits. */
export const AGREEMENT_PATH = "/a/4xrtrhp2ltjj30";
export const AGREEMENT_VERSION = "November 9, 2026";

/** Serverless endpoint (api/dental-intake.js) for both forms on the page. */
export const INTAKE_ENDPOINT = "/api/dental-intake";

export const CONTACT_EMAIL = "marcel.grisard@kindsupplyco.org";
export const CONTACT_PHONE_DISPLAY = "(925) 775-8253";
export const CONTACT_PHONE_HREF = "tel:+19257758253";

export const PACKAGE = {
  name: "Complete Dental Growth Package",
  monthly: 2000,
  months: 6,
  /** $12,000 — Agreement §1.5 Term Commitment. */
  total: 2000 * 6,
  hostingOnlyMonthly: 99, // §3.2
  websiteFilesPurchase: 4500, // §8.4
};

/*
 * Standalone (unbundled) prices supplied by Kind Supply Digital.
 * Set SHOW_STANDALONE_COMPARISON to false if any of these are not prices the
 * agency genuinely quotes for the same services on their own — a reference
 * price has to be real to be shown.
 */
export const SHOW_STANDALONE_COMPARISON = true;
export const STANDALONE = {
  websiteBuild: 4500,
  seoMonthly: 2000,
  adsManagementMonthly: 1000,
};

export const standaloneSixMonthTotal =
  STANDALONE.websiteBuild +
  STANDALONE.seoMonthly * PACKAGE.months +
  STANDALONE.adsManagementMonthly * PACKAGE.months; // 22,500

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
