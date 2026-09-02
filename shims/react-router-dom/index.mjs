// react-router v7 merged react-router-dom into the "react-router" package.
// Re-export everything so consumers importing "react-router-dom" keep working.
export * from "react-router";

// `json` was removed in react-router v7; provide a compatible helper in case a
// consumer (e.g. vite-react-ssg) still references it.
export function json(data, init = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}
