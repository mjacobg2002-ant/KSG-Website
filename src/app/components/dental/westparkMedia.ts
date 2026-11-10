/*
 * Westpark Dental Studio imagery for /dental-marketing.
 *
 * Practice photographs come from the practice's own website build and are
 * shown with the client's written permission (confirmed by Kind Supply,
 * Nov 2026). Do NOT add the doctor's headshot or any patient/stock images of
 * people here. Screenshots are the live homepage design, unedited.
 */
import type { ShotSet } from "./DevicePreview";

import roomP853a from "../../assets/dental/wp-room-portrait-853.avif";
import roomP853w from "../../assets/dental/wp-room-portrait-853.webp";
import roomP560a from "../../assets/dental/wp-room-portrait-560.avif";
import roomP560w from "../../assets/dental/wp-room-portrait-560.webp";
import roomW1600a from "../../assets/dental/wp-room-wide-1600.avif";
import roomW1600w from "../../assets/dental/wp-room-wide-1600.webp";
import roomW960a from "../../assets/dental/wp-room-wide-960.avif";
import roomW960w from "../../assets/dental/wp-room-wide-960.webp";
import ext1200a from "../../assets/dental/wp-exterior-1200.avif";
import ext1200w from "../../assets/dental/wp-exterior-1200.webp";
import ext720a from "../../assets/dental/wp-exterior-720.avif";
import ext720w from "../../assets/dental/wp-exterior-720.webp";
import rec1400a from "../../assets/dental/wp-reception-1400.avif";
import rec1400w from "../../assets/dental/wp-reception-1400.webp";
import rec900a from "../../assets/dental/wp-reception-900.avif";
import rec900w from "../../assets/dental/wp-reception-900.webp";
import ster1000a from "../../assets/dental/wp-sterilization-1000.avif";
import ster1000w from "../../assets/dental/wp-sterilization-1000.webp";
import ster640a from "../../assets/dental/wp-sterilization-640.avif";
import ster640w from "../../assets/dental/wp-sterilization-640.webp";
import cerec1200a from "../../assets/dental/wp-cerec-1200.avif";
import cerec1200w from "../../assets/dental/wp-cerec-1200.webp";
import cerec720a from "../../assets/dental/wp-cerec-720.avif";
import cerec720w from "../../assets/dental/wp-cerec-720.webp";
import siteD1440a from "../../assets/dental/wp-site-home-desktop-1440.avif";
import siteD1440w from "../../assets/dental/wp-site-home-desktop-1440.webp";
import siteD960a from "../../assets/dental/wp-site-home-desktop-960.avif";
import siteD960w from "../../assets/dental/wp-site-home-desktop-960.webp";
import siteM780a from "../../assets/dental/wp-site-home-mobile-780.avif";
import siteM780w from "../../assets/dental/wp-site-home-mobile-780.webp";
import siteM390a from "../../assets/dental/wp-site-home-mobile-390.avif";
import siteM390w from "../../assets/dental/wp-site-home-mobile-390.webp";
import founder819a from "../../assets/dental/founder-marcel-819.avif";
import founder819w from "../../assets/dental/founder-marcel-819.webp";
import founder560a from "../../assets/dental/founder-marcel-560.avif";
import founder560w from "../../assets/dental/founder-marcel-560.webp";

export type PhotoSource = { avif: string; webp: string; w: number };
export type Photo = {
  alt: string;
  width: number;
  height: number;
  sources: PhotoSource[]; // ascending width
};

export const photos = {
  roomPortrait: {
    alt: "A light-filled treatment room at Westpark Dental Studio in Tysons Corner, Virginia",
    width: 853,
    height: 1066,
    sources: [
      { avif: roomP560a, webp: roomP560w, w: 560 },
      { avif: roomP853a, webp: roomP853w, w: 853 },
    ],
  },
  roomWide: {
    alt: "A light-filled treatment room at Westpark Dental Studio in Tysons Corner, Virginia",
    width: 1600,
    height: 1066,
    sources: [
      { avif: roomW960a, webp: roomW960w, w: 960 },
      { avif: roomW1600a, webp: roomW1600w, w: 1600 },
    ],
  },
  exterior: {
    alt: "Exterior entrance of Westpark Dental Studio with WESTPARK DENTAL signage above glass doors",
    width: 1200,
    height: 1600,
    sources: [
      { avif: ext720a, webp: ext720w, w: 720 },
      { avif: ext1200a, webp: ext1200w, w: 1200 },
    ],
  },
  reception: {
    alt: "The reception and waiting area at Westpark Dental Studio, with floor-to-ceiling windows",
    width: 1400,
    height: 787,
    sources: [
      { avif: rec900a, webp: rec900w, w: 900 },
      { avif: rec1400a, webp: rec1400w, w: 1400 },
    ],
  },
  sterilization: {
    alt: "Westpark Dental Studio's dedicated sterilization and instrument-processing center",
    width: 1000,
    height: 1000,
    sources: [
      { avif: ster640a, webp: ster640w, w: 640 },
      { avif: ster1000a, webp: ster1000w, w: 1000 },
    ],
  },
  cerec: {
    alt: "CEREC Primemill same-day milling unit at Westpark Dental Studio",
    width: 1200,
    height: 900,
    sources: [
      { avif: cerec720a, webp: cerec720w, w: 720 },
      { avif: cerec1200a, webp: cerec1200w, w: 1200 },
    ],
  },
} satisfies Record<string, Photo>;

/** Kind Supply's founder (supplied by Marcel, Nov 2026). Not Westpark imagery. */
export const founderPhoto: Photo = {
  alt: "Marcel Grisard, founder of Kind Supply Digital",
  width: 819,
  height: 1024,
  sources: [
    { avif: founder560a, webp: founder560w, w: 560 },
    { avif: founder819a, webp: founder819w, w: 819 },
  ],
};

/** Live homepage design (desktop + phone), unedited. */
export const westparkHomeShots: ShotSet = {
  desktop: {
    small: { avif: siteD960a, webp: siteD960w, w: 960 },
    large: { avif: siteD1440a, webp: siteD1440w, w: 1440 },
    width: 1440,
    height: 900,
  },
  mobile: {
    small: { avif: siteM390a, webp: siteM390w, w: 390 },
    large: { avif: siteM780a, webp: siteM780w, w: 780 },
    width: 780,
    height: 1688,
  },
};
