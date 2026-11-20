/*
 * Speed to Lead System — single source of truth for /speed-to-lead and
 * /speed-to-lead/welcome.
 *
 * Stripe (live, Kind Supply Digital account):
 *   Product  prod_VfBFHmAgdhegyV  "Speed to Lead System"
 *   Price    price_1UdqsWCJQcEaXUBUzgaPqM5H  $497.00 / month
 *   Link     plink_1UdqsrCJQcEaXUBUOeGow3mS
 *
 * The Payment Link requires the buyer's email, full name, business name and
 * phone number, and redirects to /speed-to-lead/welcome after payment.
 * If the price changes, create a new Price + Payment Link in Stripe and
 * update both values below.
 */
export const SPEED_TO_LEAD = {
  name: "Speed to Lead System",
  monthly: 497,
  checkoutUrl: "https://buy.stripe.com/6oU5kC37gfk9fuM4L8efC01",
};
