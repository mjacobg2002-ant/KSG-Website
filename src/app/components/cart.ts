/*
 * Minimal client-side cart. The site sells one subscription today (the Speed
 * to Lead System), so the cart holds at most one of each product and checkout
 * hands off to that product's Stripe Payment Link, which collects payment and
 * the buyer's email, name, business name and phone.
 *
 * State lives in localStorage and is broadcast with a window event so the
 * navbar badge, product pages and /cart stay in sync (and across tabs).
 */
import { useEffect, useState } from "react";
import { SPEED_TO_LEAD } from "./speedToLeadConfig";

export type Product = {
  id: string;
  name: string;
  monthly: number;
  blurb: string;
  path: string;
  checkoutUrl: string;
};

export const PRODUCTS: Record<string, Product> = {
  "speed-to-lead": {
    id: "speed-to-lead",
    name: SPEED_TO_LEAD.name,
    monthly: SPEED_TO_LEAD.monthly,
    blurb: "Instant text-back on every inquiry and missed call, automated follow-up, and one pipeline for every lead. Set up for you.",
    path: "/speed-to-lead",
    checkoutUrl: SPEED_TO_LEAD.checkoutUrl,
  },
};

const KEY = "ksd:cart";
const EVENT = "ksd:cart";

function read(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((id) => typeof id === "string" && PRODUCTS[id]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable: cart still works for this page view */
  }
  memory = ids;
  window.dispatchEvent(new Event(EVENT));
}

let memory: string[] = [];

export function addToCart(id: string) {
  const ids = read().length ? read() : memory;
  if (!ids.includes(id)) write([...ids, id]);
}

export function removeFromCart(id: string) {
  write((read().length ? read() : memory).filter((x) => x !== id));
}

/** Cart contents. Empty on the server and first client render, then hydrated. */
export function useCart() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(read().length ? read() : memory);
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const items = ids.map((id) => PRODUCTS[id]).filter(Boolean);
  return { items, count: items.length, has: (id: string) => ids.includes(id) };
}
