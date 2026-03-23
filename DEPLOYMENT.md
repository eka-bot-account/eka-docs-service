# Docs-for-OSS Deployment Guide

## Components

1. **Landing Page** — `docs-for-oss.html` (static HTML)
2. **Contact Form Worker** — `contact-form-worker/` (Cloudflare Worker)

## Deployment Steps

### 1. Deploy Contact Form Worker

```bash
cd services/contact-form-worker
npm install
wrangler login
wrangler secret put EMAIL_API_KEY
# Paste the Resend API key when prompted
wrangler deploy
```

This deploys the worker to `docs-for-oss-contact-form.workers.dev`.

### 2. Configure DNS

Add a CNAME record:
```
contact.docs-for-oss.com → docs-for-oss-contact-form.workers.dev
```

### 3. Deploy Landing Page

**Option A: GitHub Pages**
```bash
cd services
git init
git add docs-for-oss.html
git commit -m "Initial landing page"
git branch -M main
git remote add origin https://github.com/[username]/docs-for-oss.git
git push -u origin main
```

Then enable GitHub Pages in repo settings, point to `main` branch.

**Option B: Cloudflare Pages**
```bash
cd services
wrangler pages deploy . --project-name=docs-for-oss
```

### 4. Configure Custom Domain

Point `docs-for-oss.com` to the deployed landing page via DNS A/CNAME records.

## Testing

Test the contact form locally:
```bash
cd contact-form-worker
npm run dev
```

Then open `docs-for-oss.html` in a browser and change the form action to `http://localhost:8787/submit`.

## Current Status

- ✅ Contact form worker code written
- ✅ Landing page updated with working contact form
- ⏳ Worker not yet deployed (needs Resend API key setup)
- ⏳ Landing page not yet deployed (needs domain/hosting setup)
- ⏳ DNS not yet configured

## Next Steps

1. Deploy the worker and test it works
2. Choose hosting platform (GitHub Pages or Cloudflare Pages)
3. Deploy landing page
4. Configure DNS records
5. Test end-to-end form submission
