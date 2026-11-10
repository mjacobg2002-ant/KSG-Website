import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AGREEMENT_PATH } from "./dentalConfig";

/*
 * Phone/tablet-only bar pointing to the agreement and checkout. Appears once
 * the hero is scrolled past and hides again as the assessment form (or
 * anything below it) comes into view, so it never covers the form or footer.
 */
export function StickyEnrollmentCTA({ heroId, assessmentId }: { heroId: string; assessmentId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById(heroId);
      const assessment = document.getElementById(assessmentId);
      if (!hero || !assessment) return;
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const assessmentReached = assessment.getBoundingClientRect().top < window.innerHeight;
      setShow(pastHero && !assessmentReached);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [heroId, assessmentId]);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a1120]/95 backdrop-blur-xl transition-transform duration-300 motion-reduce:transition-none ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-white/75 leading-snug" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
          Ready to start?
        </p>
        <a
          href={AGREEMENT_PATH}
          tabIndex={show ? 0 : -1}
          className="shrink-0 inline-flex items-center gap-2 min-h-[44px] px-5 bg-blue-500 text-[#0f172a] font-medium"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.03em" }}
        >
          Review &amp; enroll
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
