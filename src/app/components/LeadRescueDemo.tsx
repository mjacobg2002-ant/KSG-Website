import { motion } from "motion/react";
import { PhoneMissed, MessageSquare } from "lucide-react";

export function LeadRescueDemo() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 bg-blue-500/5 blur-3xl rounded-full" aria-hidden="true" />

      <div className="relative bg-[#0a1120] border border-white/10 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-white/30"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em" }}
          >
            10:47 PM
          </span>
          <span
            className="text-white/30"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em" }}
          >
            TUESDAY
          </span>
        </div>

        {/* Missed call */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#131d32] border border-white/5 rounded-xl p-4 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full border border-blue-400/20 flex items-center justify-center shrink-0">
            <PhoneMissed size={15} className="text-blue-300/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-white/80"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Missed call
            </p>
            <p
              className="text-white/30"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
            >
              (703) 555&ndash;0142 &middot; no voicemail left
            </p>
          </div>
        </motion.div>

        {/* Connector */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
          className="w-[1px] h-6 mx-auto bg-gradient-to-b from-blue-400/10 via-blue-400/40 to-blue-400/10"
          aria-hidden="true"
        />

        {/* Auto-text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#131d32] border border-blue-400/25 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2">
              <MessageSquare size={13} className="text-blue-400" />
              <span
                className="text-blue-300"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", fontWeight: 500 }}
              >
                AUTO-TEXT SENT
              </span>
            </span>
            <span
              className="text-blue-300/50"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem" }}
            >
              +42 seconds
            </span>
          </div>
          <p
            className="text-white/60"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", lineHeight: "1.7" }}
          >
            Sorry we missed your call! Are you dealing with an emergency right now?
            Reply YES and we'll call you back immediately &mdash; or tap here to book a time.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center text-white/25 mt-5"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.03em" }}
        >
          Runs on your line. Automatically. Every time.
        </motion.p>
      </div>
    </div>
  );
}
