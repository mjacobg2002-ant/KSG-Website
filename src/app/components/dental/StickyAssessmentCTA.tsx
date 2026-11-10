import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/*
 * Phone/tablet-only bar pointing to the free written assessment. Appears once
 * the hero is scrolled past and hides again as the assessment form (or
 * anything below it) comes into view, so it never covers the form or footer.
 */
export function StickyAssessmentCTA({ heroId, targetId }: { heroId: string; targetId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById(heroId);
      const target = document.getElementById(targetId);
      if (!hero || !target) return;
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const targetReached = target.getBoundingClientRect().top < window.innerHeight;
      setShow(pastHero && !targetReached);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [heroId, targetId]);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a1120]/95 backdrop-blur-xl transition-transform duration-300 motion-reduce:transition-none ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-white/75 leading-snug" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
          Free, written, no call required.
        </p>
        <a
          href={`#${targetId}`}
          tabIndex={show ? 0 : -1}
          className="shrink-0 inline-flex items-center gap-2 min-h-[44px] px-5 bg-blue-500 text-[#0f172a] font-medium"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.03em" }}
        >
          Get my assessment
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
