import { Link, useLocation } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const isContact = location.pathname === "/contact";

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isContact) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a1120]/95 backdrop-blur-xl border-t border-blue-400/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
            <p
              className="text-white/70 hidden sm:block"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}
            >
              Ready to grow your healthcare organization online?
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <Link
                to="/contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white hover:bg-blue-400 transition-all"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 500 }}
              >
                Free Consultation
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}