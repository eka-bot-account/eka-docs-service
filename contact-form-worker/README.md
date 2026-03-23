# Contact Form Worker for docs-for-oss.com

Cloudflare Worker that receives contact form submissions from the landing page and forwards them via email.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set the Resend API key:
```bash
wrangler secret put EMAIL_API_KEY
# Paste the Resend API key when prompted
```

3. Deploy:
```bash
npm run deploy
```

## Endpoint

**Production:** `https://contact.docs-for-oss.com/submit`

## Request Format

```
POST /submit
Content-Type: multipart/form-data

name=John+Doe
email=john@example.com
project=MyProject
message=I+need+docs+for+my+OSS+project
```

## Response

```json
{
  "success": true
}
```

## Local Testing

```bash
npm run dev
```

Then test with:
```bash
curl -X POST http://localhost:8787/submit \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "project=Test Project" \
  -F "message=This is a test message"
```
