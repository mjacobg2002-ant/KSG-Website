import { Link, useNavigate } from "react-router";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { PRODUCTS, addToCart, useCart } from "./cart";

const INTER = "'Inter', sans-serif";
const PLAYFAIR = "'Playfair Display', serif";
const product = PRODUCTS["speed-to-lead"];

const POINTS = ["Text-back within seconds, day or night", "Automated follow-up on every lead", "One pipeline you can check from your phone", "Set up for you on a setup meeting"];

/** "Add to cart" that turns into "View cart" once the item is in. Sends the visitor to /cart. */
export function AddToCartButton({ className = "", label = "Add to cart" }: { className?: string; label?: string }) {
  const navigate = useNavigate();
  const { has } = useCart();
  const inCart = has(product.id);
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(product.id);
        navigate("/cart");
      }}
      className={`inline-flex items-center justify-center gap-2.5 min-h-[52px] px-6 bg-blue-500 text-[#0f172a] hover:bg-blue-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${className}`}
      style={{ fontFamily: INTER, fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.02em" }}
    >
      <ShoppingCart size={18} aria-hidden="true" />
      {inCart ? "View cart & check out" : label}
    </button>
  );
}

/** Homepage / services section that puts the product and its price in front of visitors. */
export function SpeedToLeadPromo({ id = "speed-to-lead" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-24 border-b border-white/5 bg-[#0c1525]" aria-labelledby={`${id}-title`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] border border-blue-400/30 bg-[#0d1628]">
          <div className="p-6 sm:p-10">
            <p className="uppercase text-blue-300/80 mb-4" style={{ fontFamily: INTER, fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.28em" }}>
              Available now · Buy online
            </p>
            <h2 id={`${id}-title`} className="text-white" style={{ fontFamily: PLAYFAIR, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 400, lineHeight: 1.15 }}>
              {product.name}
            </h2>
            <p className="text-white/65 mt-4 max-w-xl" style={{ fontFamily: INTER, fontSize: "1rem", lineHeight: 1.7 }}>
              The first business to answer usually gets the job. Every inquiry gets a reply in seconds, and nothing slips through.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-6">
              {POINTS.map((t) => (
                <li key={t} className="flex gap-2.5 text-white/75" style={{ fontFamily: INTER, fontSize: "0.92rem", lineHeight: 1.5 }}>
                  <Check size={16} className="text-blue-300 shrink-0 mt-1" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-blue-400/20 flex flex-col justify-center">
            <p className="flex items-baseline gap-2">
              <span className="text-white" style={{ fontFamily: PLAYFAIR, fontSize: "3.2rem", lineHeight: 1 }}>${product.monthly}</span>
              <span className="text-white/55" style={{ fontFamily: INTER, fontSize: "1rem" }}>/ month</span>
            </p>
            <p className="text-white/50 mt-2 mb-6" style={{ fontFamily: INTER, fontSize: "0.88rem" }}>Billed monthly. Secure checkout by Stripe.</p>
            <AddToCartButton className="w-full" />
            <Link
              to={product.path}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] mt-3 text-white/75 hover:text-white transition-colors"
              style={{ fontFamily: INTER, fontSize: "0.9rem", fontWeight: 500 }}
            >
              See what's included <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
