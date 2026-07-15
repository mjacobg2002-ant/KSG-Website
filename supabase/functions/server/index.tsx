import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-88bd143f/health", (c) => {
  return c.json({ status: "ok" });
});

// Submit consultation inquiry
app.post("/make-server-88bd143f/inquiries", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, company, industry, website, budget, details } = body;

    if (!name || !email || !company || !industry || !details) {
      return c.json({ error: "Missing required fields: name, email, company, industry, details" }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const inquiry = {
      id,
      name,
      email,
      company,
      industry,
      website: website || "Not provided",
      budget: budget || "Not selected",
      details,
      submittedAt: timestamp,
      status: "new",
    };

    // Store inquiry with a unique key
    await kv.set(`inquiry:${id}`, inquiry);

    // Also maintain a list of inquiry IDs for easy retrieval
    const existingIds = (await kv.get("inquiry:ids")) || [];
    existingIds.push(id);
    await kv.set("inquiry:ids", existingIds);

    console.log(`New inquiry received from ${name} (${email}) at ${company}`);

    // Send email notification via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Kind Supply Digital <onboarding@resend.dev>",
            to: ["marcel.grisard@kindsupplyco.org"],
            subject: `New Consultation Inquiry from ${name} at ${company}`,
            html: `
              <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 4px;">
                <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px;">New Consultation Inquiry</h1>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top; width: 120px;">Name</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 15px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Email</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 15px;"><a href="mailto:${email}" style="color: #93c5fd;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Company</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 15px;">${company}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Industry</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 15px;">${industry}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Website</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 15px;">${website || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Budget</td>
                    <td style="padding: 10px 0; color: #ffffff; font-size: 15px;">${budget || "Not selected"}</td>
                  </tr>
                </table>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <p style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Project Details</p>
                  <p style="color: #ffffff; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${details}</p>
                </div>
                <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); color: #64748b; font-size: 12px;">
                  Inquiry ID: ${id}<br/>
                  Submitted: ${timestamp}
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text();
          console.log(`Resend email sending failed (non-critical): ${emailError}`);
        } else {
          console.log(`Email notification sent to marcel.grisard@kindsupplyco.org for inquiry ${id}`);
        }
      } catch (emailErr) {
        // Email failure is non-critical — the inquiry is already saved
        console.log(`Email notification error (non-critical): ${emailErr}`);
      }
    } else {
      console.log("RESEND_API_KEY not configured — skipping email notification");
    }

    return c.json({ success: true, id, message: "Inquiry submitted successfully" });
  } catch (err) {
    console.log(`Error submitting inquiry: ${err}`);
    return c.json({ error: `Failed to submit inquiry: ${err}` }, 500);
  }
});

// Get all inquiries (for admin use)
app.get("/make-server-88bd143f/inquiries", async (c) => {
  try {
    const ids = (await kv.get("inquiry:ids")) || [];
    if (ids.length === 0) {
      return c.json({ inquiries: [] });
    }
    const keys = ids.map((id: string) => `inquiry:${id}`);
    const inquiries = await kv.mget(keys);
    // Sort by most recent first
    inquiries.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return c.json({ inquiries });
  } catch (err) {
    console.log(`Error fetching inquiries: ${err}`);
    return c.json({ error: `Failed to fetch inquiries: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);