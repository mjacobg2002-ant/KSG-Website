import { GUARANTEE, PACKAGE, usd } from "./dentalConfig";

/*
 * FAQ for /dental-marketing. Each answer paraphrases the general agreement
 * (Version November 16, 2026) and cites the section it comes from, so it can be
 * checked line by line. Plain strings: rendered on the page and emitted as
 * FAQPage JSON-LD.
 */
export type Faq = { q: string; a: string[]; ref?: string };

export const dentalFaqs: Faq[] = [
  {
    q: "What does $2,000/month include?",
    a: [
      "Everything below, for one practice location: a custom, mobile-responsive website of up to 20 pages with appointment-request or online-booking integration, analytics and conversion tracking, and two rounds of design revisions; ongoing technical, on-page, and local SEO, including Google Business Profile optimization and local citation management; Google Ads management; hosting, security and platform updates, and up to five hours of minor edits a month; and a written report every month.",
    ],
    ref: "§2.1",
  },
  {
    q: "Why is the website build fee waived?",
    a: [
      "The website is included in the six-month commitment instead of being billed as a separate project. It is provided to you under license while the agreement is in effect — it is not a transfer of ownership. If you later want to own the website files outright, see “Who owns the website itself?” below.",
    ],
    ref: "§4.2",
  },
  {
    q: "Is Google Ads spending included?",
    a: [
      "No. Your advertising budget is paid by you directly to Google, from your own Google Ads account and payment method. We agree on the monthly budget with you and manage the campaigns. We never advance, mark up, or invoice ad spend.",
    ],
    ref: "§7.4",
  },
  {
    q: "How long is the contract?",
    a: [
      `Six months, starting on the day of your first payment. The fee is ${usd(PACKAGE.monthly)} a month, charged automatically to the card you use at checkout on the same day each month — ${usd(PACKAGE.total)} in total.`,
      "The agreement can’t be cancelled for convenience during those six months. If a client stops paying or abandons the agreement early, the remaining monthly fees become due. If we materially breach the agreement and don’t fix it within 15 days of your written notice, you can end it and owe only the fees accrued up to that point.",
    ],
    ref: "§3.1, §4, §10, §12",
  },
  {
    q: "What happens after the six months?",
    a: [
      "Unless either of us gives written notice at least 30 days before the six months end, SEO and Google Ads management continue month to month at $2,000, and either side can stop with 30 days’ written notice.",
      `If you stop SEO and Ads but want to keep the website hosted with us, hosting and maintenance are ${usd(PACKAGE.hostingOnlyMonthly)}/month. You can also purchase the website files (see below). If you choose neither, the website license ends and the site can be taken offline.`,
    ],
    ref: "§3.2, §12.3",
  },
  {
    q: "Who owns the domain, Google Ads account, and Google Business Profile?",
    a: [
      "You do. Your domain name, logo, photos, and content stay yours, as do your Google Ads, Google Business Profile, and analytics accounts and the data in them. If we register or manage your domain for you, we release it to you on request. When the agreement ends, we give up our administrative access to your accounts.",
    ],
    ref: "§8.1, §8.3",
  },
  {
    q: "Who owns the website itself?",
    a: [
      "Kind Supply Digital owns the website’s design, code, and hosting environment. You receive a license to use the website for as long as the agreement is in effect and payments are current. Ownership does not transfer automatically at any point.",
      `After the six-month commitment and all amounts due have been paid, you may purchase the website files for a one-time ${usd(PACKAGE.websiteFilesPurchase)}. We deliver them within 15 business days. Third-party themes, fonts, plug-ins, and licensed images stay subject to their own licenses. Purchasing is optional — you can keep the site hosted with us instead.`,
    ],
    ref: "§8.2, §8.4",
  },
  {
    q: "Are hosting and maintenance included?",
    a: [
      "Yes, throughout the engagement: hosting on our infrastructure, security and platform updates, and minor edits of up to five hours a month. Larger additions are quoted separately and only done with a written change order you sign.",
    ],
    ref: "§2.1(d), §2.3",
  },
  {
    q: "Can the website be transferred to another provider?",
    a: [
      `Yes, once you purchase the website files (${usd(PACKAGE.websiteFilesPurchase)}, after the six-month commitment is paid). Your domain, Google accounts, and content are always yours to take with you; without the purchase, the site’s design and code remain with us.`,
    ],
    ref: "§8.1, §8.4",
  },
  {
    q: "What if we want professional photography?",
    a: [
      "Photography and video aren’t part of the package and aren’t required. If you want original photos of your office, doctors, or team — or brand video — we quote it separately. Travel, lodging, and production needs affect the quote, and nothing is charged without your written approval first.",
    ],
    ref: "§2.3",
  },
  {
    q: "What if our practice has more than one location?",
    a: [
      "This package covers one location, which you designate and we confirm in writing. Each additional location needs its own agreement, with its own scope and pricing. Tell us about all of your locations when you get in touch and we’ll scope them together.",
    ],
    ref: "§1.2, §6",
  },
  {
    q: "Can a new dental practice sign before opening?",
    a: [
      "Yes. Opening practices often benefit most from having the website, search profile, and tracking ready before the first patient. Because the six-month term begins with your first payment, we’ll talk through your opening timeline before you enroll.",
    ],
  },
  {
    q: "How will marketing performance be reported?",
    a: [
      "Every month you receive a written report covering website traffic, search visibility, and Google Ads performance. Where your booking system allows it, we also track appointment requests and bookings — configured so that tracking doesn’t capture what patients type into forms. We report actual numbers and label anything that is an estimate.",
    ],
    ref: "§2.1(e), §9.2",
  },
  {
    q: "Do you handle patient information?",
    a: [
      "No. The services don’t require us to receive protected health information, and your website forms shouldn’t collect clinical details. If your practice ever needs us to handle patient information, we sign a business associate agreement first.",
    ],
    ref: "§9.1",
  },
  {
    q: "What is the first-month guarantee?",
    a: [
      `If the Google Ads campaign we manage doesn’t produce at least ${GUARANTEE.bookedNewPatients} new booked patients in its first ${GUARANTEE.periodDays} days, we refund your first ${usd(GUARANTEE.refund)} payment to us within 15 days — you don’t need to ask or send any notice — and the agreement ends with nothing more owed. The refund covers our fee only; what you pay Google for ads is not refunded. The ${GUARANTEE.periodDays} days start the day the ads start running, not the day you enroll.`,
      "A booked patient is a new patient who schedules an appointment after coming through the ads: by calling from an ad, or by clicking through to your website and then booking, requesting an appointment, or calling from the site. It counts when it is scheduled, even if the patient later cancels or doesn’t show. A campaign call your office doesn’t answer during office hours, or an appointment request not answered within one business day, also counts, because answering is your side of the arrangement.",
      `The conditions: your first ${usd(PACKAGE.monthly)} payment is made before any work or advertising begins; you fund a Google Ads budget of at least ${usd(GUARANTEE.minAdBudget)} for that period, paid directly to Google, and don’t pause or cut the campaign; you send materials, account access, and approvals on time; the website, booking path, and tracking stay as installed; and your office is open to new patients.`,
      "If the refund is issued, you keep your domain, your content, and your Google accounts. The website we built and the ad campaigns we created stay with us. We count from our own call and conversion tracking — nothing is needed from your office — and send you the count by number and date only, with no patient details. If the campaign books 3 new patients, the guarantee is met, the first month can’t be cancelled, and the six-month agreement continues. If the minimum Google Ads budget isn’t funded, the guarantee is void and the six-month term applies, since the work will already be underway.",
    ],
    ref: "§17, §4.1",
  },
  {
    q: "Do you guarantee rankings or new patients?",
    a: [
      "Beyond the first-month guarantee above, no. Search and advertising results build over time and depend on competition, budget, and Google’s own systems. What we commit to is the work in the agreement, done well, and honest monthly reporting on what it produces.",
    ],
    ref: "§13.1, §13.2, §17",
  },
];
