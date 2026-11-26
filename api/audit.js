// Serverless endpoint for Vercel (/api/audit)
// Environment variables required:
//   NOTION_TOKEN       - Notion integration secret
//   NOTION_DATABASE_ID - Target Leads database ID
//   NOTIFY_WEBHOOK_URL - (Optional) Slack/Discord/Email webhook for instant founder alert

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  ipHits.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIp =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Too many requests. Please try again shortly." });
  }

  const body = req.body || {};

  // Honeypot check
  if (body.website_hp) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const businessName = String(body.businessName || "").trim();
  const whatsapp = String(body.whatsapp || "").trim();
  const email = String(body.email || "").trim();
  const link = String(body.link || "").trim();
  const businessType = String(body.businessType || "Not specified").trim();
  const consent = body.consent === true;

  if (!name || !businessName || !whatsapp || !consent) {
    return res.status(400).json({
      error: "Name, business name, WhatsApp number, and consent are required.",
    });
  }

  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    return res.status(503).json({
      error: "Audit backend is not configured yet.",
    });
  }

  const pillarScores = body.pillarScores || {};
  const overall = body.overall ?? "N/A";
  const biggestGap = body.biggestGap || "N/A";
  const topFixes = Array.isArray(body.topFixes) ? body.topFixes : [];

  const summaryLines = [
    `Business Type: ${businessType}`,
    `Overall Readiness: ${overall}/100`,
    `Biggest Gap: ${biggestGap}`,
    `Pillar Scores: Website ${pillarScores.Website ?? "-"}, Google ${pillarScores["Google presence"] ?? "-"}, Social ${pillarScores["Social media"] ?? "-"}, Enquiries ${pillarScores["Enquiry handling"] ?? "-"}`,
    email ? `Email: ${email}` : null,
    body.referrer ? `Referrer: ${body.referrer}` : null,
    "",
    "Top 3 Fixes:",
    ...topFixes.map((f, i) => `${i + 1}. ${f.title} — Quick win: ${f.free_quick_win}`),
    "",
    "Raw Answers:",
    JSON.stringify(body.answers || {}, null, 2),
  ]
    .filter(Boolean)
    .join("\n");

  const properties = {
    Lead: { title: [{ text: { content: businessName.slice(0, 180) } }] },
    Stage: { select: { name: "New" } },
    Industry: { select: { name: businessType.slice(0, 90) } },
    "Contact Name": { rich_text: [{ text: { content: name.slice(0, 180) } }] },
    Phone: { phone_number: whatsapp.slice(0, 40) },
    "Next Action": { select: { name: "Send audit report" } },
    "Last contacted": { date: { start: new Date().toISOString().slice(0, 10) } },
    Source: { select: { name: "Website audit" } },
  };

  if (link) {
    properties.Website = { url: link };
  }

  try {
    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: summaryLines.slice(0, 1900) } }],
            },
          },
        ],
      }),
    });

    if (!notionRes.ok) {
      const errText = await notionRes.text();
      console.error("Notion API error:", errText);
      return res.status(502).json({ error: "Could not save audit to CRM." });
    }

    if (process.env.NOTIFY_WEBHOOK_URL) {
      fetch(process.env.NOTIFY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `New VibeNova Audit Lead: ${businessName} (${name}) — ${whatsapp} | Overall: ${overall}/100 | Gap: ${biggestGap}`,
        }),
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Unexpected server error." });
  }
}
