import type { ShotSet } from "./DevicePreview";

// Screenshots rendered from Kind Supply's own Westpark Dental Studio build
// (pages with no practice photography — design and copy only).
import svcD1440a from "../../assets/dental/westpark-service-desktop-1440.avif";
import svcD1440w from "../../assets/dental/westpark-service-desktop-1440.webp";
import svcD960a from "../../assets/dental/westpark-service-desktop-960.avif";
import svcD960w from "../../assets/dental/westpark-service-desktop-960.webp";
import svcM780a from "../../assets/dental/westpark-service-mobile-780.avif";
import svcM780w from "../../assets/dental/westpark-service-mobile-780.webp";
import svcM390a from "../../assets/dental/westpark-service-mobile-390.avif";
import svcM390w from "../../assets/dental/westpark-service-mobile-390.webp";
import techD1440a from "../../assets/dental/westpark-technology-desktop-1440.avif";
import techD1440w from "../../assets/dental/westpark-technology-desktop-1440.webp";
import techD960a from "../../assets/dental/westpark-technology-desktop-960.avif";
import techD960w from "../../assets/dental/westpark-technology-desktop-960.webp";
import techM780a from "../../assets/dental/westpark-technology-mobile-780.avif";
import techM780w from "../../assets/dental/westpark-technology-mobile-780.webp";
import techM390a from "../../assets/dental/westpark-technology-mobile-390.avif";
import techM390w from "../../assets/dental/westpark-technology-mobile-390.webp";

export const westparkServicePage: ShotSet = {
  desktop: {
    small: { avif: svcD960a, webp: svcD960w, w: 960 },
    large: { avif: svcD1440a, webp: svcD1440w, w: 1440 },
    width: 1440,
    height: 772,
  },
  mobile: {
    small: { avif: svcM390a, webp: svcM390w, w: 390 },
    large: { avif: svcM780a, webp: svcM780w, w: 780 },
    width: 780,
    height: 1688,
  },
};

export const westparkTechnologyPage: ShotSet = {
  desktop: {
    small: { avif: techD960a, webp: techD960w, w: 960 },
    large: { avif: techD1440a, webp: techD1440w, w: 1440 },
    width: 1440,
    height: 764,
  },
  mobile: {
    small: { avif: techM390a, webp: techM390w, w: 390 },
    large: { avif: techM780a, webp: techM780w, w: 780 },
    width: 780,
    height: 1688,
  },
};
