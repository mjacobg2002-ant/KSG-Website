import { Check, Lock } from "lucide-react";
import { AddToCartButton } from "../components/SpeedToLeadPromo";
import { SEOHead, SITE } from "../components/SEOHead";
import { SPEED_TO_LEAD } from "../components/speedToLeadConfig";
import { BOOK_CALL_URL, CONTACT_EMAIL } from "../components/dental/dentalConfig";
import { Eyebrow, body, buttonText, display, focusScope, ghostButton } from "../components/funnel/ui";

const PAGE_URL = `${SITE}/speed-to-lead`;

const INCLUDED = [
  ["Instant text-back", "Every new inquiry and missed call gets a text back within seconds, even after hours, so the lead hears from you before they call someone else."],
  ["Automated follow-up", "Leads who don't reply get a short follow-up sequence, so nobody goes cold because your team was busy."],
  ["One pipeline for every lead", "Calls, texts and form submissions land in a CRM pipeline you can see from your phone, so you always know who still needs a call."],
  ["Setup done for you", "We build and connect everything on a setup call with you. You don't touch any software."],
] as const;

const AT_CHECKOUT = ["Your email", "Your full name", "Your business name", "The best phone number to reach you"];

const STEPS = [
  ["Check out securely", "Pay through Stripe. It takes about a minute."],
  ["We reach out", "We contact you at the phone number and email you entered to schedule your setup meeting."],
  ["Go live", "On the setup meeting we connect your phone line and lead forms and turn the system on."],
] as const;

function CheckoutCard() {
  return (
    <div className="border border-blue-400/30 bg-[#0d1628] p-6 sm:p-8">
      <p className="text-white" style={{ ...body("1.05rem", 1.4), fontWeight: 600 }}>{SPEED_TO_LEAD.name}</p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-white" style={display("3rem")}>${SPEED_TO_LEAD.monthly}</span>
        <span className="text-white/55" style={body("1rem")}>/ month</span>
      </p>
      <p className="text-white/55 mt-1" style={body("0.9rem")}>Billed monthly through Stripe.</p>

      <p className="text-white/80 mt-6 mb-3" style={{ ...body("0.9rem"), fontWeight: 600 }}>To finish setup, checkout asks for:</p>
      <ul className="flex flex-col gap-2.5 mb-7">
        {AT_CHECKOUT.map((t) => (
          <li key={t} className="flex gap-2.5 text-white/70" style={body("0.92rem", 1.5)}>
            <Check size={16} className="text-blue-300 shrink-0 mt-1" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>

      <AddToCartButton className="w-full" />
      <a href={SPEED_TO_LEAD.checkoutUrl} className="flex items-center justify-center min-h-[44px] mt-2 text-white/70 hover:text-white underline underline-offset-4 transition-colors" style={body("0.88rem")}>
        Skip the cart, buy now
      </a>
      <p className="flex items-center justify-center gap-2 text-white/45 mt-2" style={body("0.82rem")}>
        <Lock size={13} aria-hidden="true" /> Secure checkout by Stripe
      </p>
    </div>
  );
}

export function SpeedToLeadPage() {
  return (
    <div className={focusScope}>
      <SEOHead
        title="Speed to Lead System | Kind Supply Digital"
        description="Every new inquiry and missed call gets a text back within seconds, automated follow-up, and one pipeline for every lead. $497 a month, set up for you."
        canonical={PAGE_URL}
      />

      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]" aria-labelledby="stl-title">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-14">
          <Eyebrow>{SPEED_TO_LEAD.name}</Eyebrow>
          <h1 id="stl-title" className="text-white max-w-3xl" style={display("clamp(2rem, 5vw, 3.2rem)")}>
            The first business to answer usually gets the job
          </h1>
          <p className="text-white/65 max-w-2xl mt-5" style={body("1.05rem")}>
            Every inquiry gets a reply within seconds, day or night, and every lead lands in one place so nothing slips through. We set it all up for you.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 pb-28 lg:pb-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
          <div className="order-2 lg:order-1">
            <h2 className="text-white mb-6" style={display("1.6rem")}>What's included</h2>
            <ul className="flex flex-col gap-6">
              {INCLUDED.map(([title, text]) => (
                <li key={title} className="flex gap-4">
                  <Check size={20} className="text-blue-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-white" style={{ ...body("1.02rem", 1.4), fontWeight: 600 }}>{title}</p>
                    <p className="text-white/60 mt-1.5" style={body("0.94rem")}>{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="text-white mt-12 mb-6" style={display("1.6rem")}>What happens next</h2>
            <ol className="flex flex-col gap-6">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="w-9 h-9 rounded-full border border-blue-400/50 text-blue-300 flex items-center justify-center shrink-0 tabular-nums" style={{ ...buttonText, fontSize: "0.9rem" }}>{i + 1}</span>
                  <div>
                    <p className="text-white" style={{ ...body("1.02rem", 1.4), fontWeight: 600 }}>{title}</p>
                    <p className="text-white/60 mt-1.5" style={body("0.94rem")}>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div id="buy" className="order-1 lg:order-2 flex flex-col gap-5 lg:sticky lg:top-24 scroll-mt-24">
            <CheckoutCard />
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className={`${ghostButton} flex-1`} style={buttonText}>Questions? Book 15 minutes</a>
            </div>
            <p className="text-white/45" style={body("0.84rem")}>
              Or email <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 text-white/70 hover:text-white">{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile: price and Add to cart always within thumb reach. */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1120]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center gap-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <p className="text-white shrink-0" style={body("1rem", 1.2)}>
          <span style={{ fontWeight: 600 }}>${SPEED_TO_LEAD.monthly}</span>
          <span className="block text-white/50" style={body("0.75rem", 1.2)}>per month</span>
        </p>
        <AddToCartButton className="flex-1 min-h-[48px]" />
      </div>
    </div>
  );
}
