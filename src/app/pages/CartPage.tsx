import { Link } from "react-router";
import { ArrowRight, Check, Lock, ShoppingCart, Trash2 } from "lucide-react";
import { SEOHead, SITE } from "../components/SEOHead";
import { PRODUCTS, removeFromCart, useCart } from "../components/cart";
import { AddToCartButton } from "../components/SpeedToLeadPromo";
import { CONTACT_EMAIL } from "../components/dental/dentalConfig";
import { Eyebrow, body, buttonText, display, focusScope, goldButton } from "../components/funnel/ui";

const AT_CHECKOUT = ["Your email", "Your full name", "Your business name", "The best phone number to reach you"];

export function CartPage() {
  const { items } = useCart();
  const total = items.reduce((sum, p) => sum + p.monthly, 0);
  // One subscription per checkout: Stripe Payment Links are per product.
  const item = items[0];
  const suggested = PRODUCTS["speed-to-lead"];

  return (
    <div className={focusScope}>
      <SEOHead title="Your Cart | Kind Supply Digital" description="Review your cart and check out securely with Stripe." canonical={`${SITE}/cart`} noIndex />

      <section className="py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <Eyebrow>Cart</Eyebrow>
          <h1 className="text-white mb-8 sm:mb-10" style={display("clamp(2rem, 5vw, 2.8rem)")}>
            {item ? "Review and check out" : "Your cart is empty"}
          </h1>

          {!item ? (
            <div className="border border-white/12 p-6 sm:p-8 max-w-xl">
              <ShoppingCart size={28} className="text-blue-300 mb-4" aria-hidden="true" />
              <p className="text-white" style={{ ...body("1.05rem", 1.4), fontWeight: 600 }}>{suggested.name}</p>
              <p className="text-white/60 mt-2" style={body("0.94rem")}>{suggested.blurb}</p>
              <p className="text-white mt-4" style={body("1rem")}>
                <span style={{ fontWeight: 600 }}>${suggested.monthly}</span> <span className="text-white/55">/ month</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <AddToCartButton />
                <Link to={suggested.path} className="inline-flex items-center justify-center min-h-[48px] px-5 border border-white/20 text-white/85 hover:border-blue-400/60 hover:text-white transition-colors" style={buttonText}>
                  Learn more
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-10 items-start">
              <ul className="border border-white/12 divide-y divide-white/10" aria-label="Items in your cart">
                {items.map((p) => (
                  <li key={p.id} className="p-5 sm:p-6 flex gap-4 items-start">
                    <div className="flex-1 min-w-0">
                      <Link to={p.path} className="text-white hover:text-blue-200 transition-colors" style={{ ...body("1.05rem", 1.4), fontWeight: 600 }}>{p.name}</Link>
                      <p className="text-white/55 mt-1.5" style={body("0.9rem", 1.55)}>{p.blurb}</p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(p.id)}
                        className="inline-flex items-center gap-1.5 min-h-[44px] mt-1 text-white/50 hover:text-white transition-colors"
                        style={body("0.85rem")}
                      >
                        <Trash2 size={14} aria-hidden="true" /> Remove
                      </button>
                    </div>
                    <p className="text-white text-right shrink-0" style={body("1rem", 1.4)}>
                      <span style={{ fontWeight: 600 }}>${p.monthly}</span>
                      <span className="block text-white/50" style={body("0.8rem")}>per month</span>
                    </p>
                  </li>
                ))}
              </ul>

              <aside className="border border-blue-400/30 bg-[#0d1628] p-5 sm:p-7" aria-label="Order summary">
                <div className="flex items-baseline justify-between">
                  <p className="text-white/70" style={body("0.95rem")}>Due today</p>
                  <p className="text-white" style={{ ...body("1.4rem", 1.2), fontWeight: 600 }}>${total}</p>
                </div>
                <p className="text-white/50 mt-1" style={body("0.85rem")}>Then ${total} every month.</p>

                <p className="text-white/80 mt-6 mb-3" style={{ ...body("0.88rem"), fontWeight: 600 }}>Checkout asks for these to set up your meeting:</p>
                <ul className="flex flex-col gap-2 mb-6">
                  {AT_CHECKOUT.map((t) => (
                    <li key={t} className="flex gap-2.5 text-white/70" style={body("0.88rem", 1.5)}>
                      <Check size={15} className="text-blue-300 shrink-0 mt-1" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>

                <a href={item.checkoutUrl} className={`${goldButton} w-full`} style={buttonText}>
                  Check out securely
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
                <p className="flex items-center justify-center gap-2 text-white/45 mt-3" style={body("0.8rem")}>
                  <Lock size={13} aria-hidden="true" /> Payment handled by Stripe
                </p>
                <p className="text-white/45 mt-5 text-center" style={body("0.82rem")}>
                  Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 text-white/70 hover:text-white">Email us</a>
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
