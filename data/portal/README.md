# Client portal configs

Each `*.json` file here becomes an unlisted page at `/portal/<slug>` (noindex, not in the sitemap or nav).
Copy `demo-practice.json`, rename it to the client's slug, edit, commit, and push.

- `stages.*.status`: `complete`, `in-progress`, or `upcoming`. Use `date` (`YYYY-MM-DD`) for real clients; `daysAgo` exists so the demo never goes stale.
- `guarantee.adsLiveDate`: the day ads started running (`YYYY-MM-DD`). The 30-day window and the fourth stage are worked out from it. Leave it out until ads are live.
- `guarantee.bookedPatients`: one entry per booked new patient: `{ "date": "YYYY-MM-DD", "source": "Google Ads call" }`.
  **Never put patient names, phone numbers, or treatment details here.** These files ship to the browser.
- `links`: `liveSite`, `callLogs`, `agreement`. Leave one empty to show it as "not connected yet".
- `accessCodeSha256` (optional): SHA-256 hex of an access code to show a code prompt first.
  Generate with `printf 'the-code' | shasum -a 256`. This keeps casual visitors out; it is not real security,
  because the page data is still in the site's public files. Keep anything sensitive out of these configs.
- `"demo": true` shows a "sample data" banner. Remove it for real clients.
