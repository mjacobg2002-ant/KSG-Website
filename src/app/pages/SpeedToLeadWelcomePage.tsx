import { useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { removeFromCart } from "../components/cart";
import { SEOHead, SITE } from "../components/SEOHead";
import { SPEED_TO_LEAD } from "../components/speedToLeadConfig";
import { BOOK_CALL_URL, CONTACT_EMAIL } from "../components/dental/dentalConfig";
import { Eyebrow, body, buttonText, display, focusScope, goldButton } from "../components/funnel/ui";

/** Stripe Payment Link redirects here after a successful checkout. */
export function SpeedToLeadWelcomePage() {
  // Paid: empty the cart so the badge clears.
  useEffect(() => removeFromCart("speed-to-lead"), []);
  return (
    <div className={focusScope}>
      <SEOHead
        title="You're In — Speed to Lead System | Kind Supply Digital"
        description="Thanks for signing up for the Speed to Lead System."
        canonical={`${SITE}/speed-to-lead/welcome`}
        noIndex
      />
      <section className="py-14 sm:py-20 bg-[radial-gradient(ellipse_at_top_right,#1c2940,transparent_64%)]">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <CheckCircle2 size={40} className="text-blue-300 mb-6" aria-hidden="true" />
          <Eyebrow>{SPEED_TO_LEAD.name}</Eyebrow>
          <h1 className="text-white" style={display("clamp(2rem, 5vw, 2.8rem)")}>You're in. Let's get you set up.</h1>
          <p className="text-white/65 mt-5" style={body("1.05rem")}>
            Your payment went through. We'll reach out at the phone number and email you entered to schedule your setup meeting.
          </p>
          <p className="text-white/65 mt-4" style={body("1.05rem")}>
            Want to lock in a time now? Pick one below.
          </p>
          <div className="mt-8">
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className={goldButton} style={buttonText}>
              Book my setup meeting
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          </div>
          <p className="text-white/45 mt-8" style={body("0.88rem")}>
            Questions in the meantime? Email <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 text-white/70 hover:text-white">{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
