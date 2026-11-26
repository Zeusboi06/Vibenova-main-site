# VibeNova Main Site

Static marketing site + Instant Growth Audit serverless endpoint (`/api/audit`) ready for Vercel.

## Environment Variables (Vercel Project Settings)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NOTION_TOKEN` | Yes | Notion internal integration secret |
| `NOTION_DATABASE_ID` | Yes | Target Notion Leads database ID |
| `NOTIFY_WEBHOOK_URL` | No | Optional Slack/Discord/webhook URL for instant lead alerts |

## Local Development

Run `npx vercel dev` (recommended to test `/api/audit`) or `npx serve` for static preview.
