# Deployment Guide

> Last updated: 2026-09-07

Blog CMS supports three deployment targets out of the box. Pick the one that fits your workflow.

---

## 1. Cloudflare Pages (Recommended)

Cloudflare Pages gives you a global CDN, automatic HTTPS, and zero-config preview deployments on every PR.

### Steps

1. **Connect your repository**

   - Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/) → *Create a project* → *Connect to Git*
   - Select this repository

2. **Configure the build**

   | Setting | Value |
   |---------|-------|
   | Framework preset | `None` |
   | Build command | `hugo --minify` |
   | Build output directory | `public` |
   | Root directory | `/` |

3. **Set environment variables** (Settings → Environment variables)

   ```
   HUGO_VERSION=0.136.0
   ```

4. **CMS Authentication** — add a Cloudflare Zero Trust Access policy protecting `/admin/*` to enable the Decap CMS backend.

### Custom Domain

Pages → Custom domains → Add domain → follow the DNS instructions.

---

## 2. Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new)
2. Framework: **Other**
3. Build command: `hugo --minify`
4. Output directory: `public`
5. Add environment variable `HUGO_VERSION=0.136.0`

Vercel Edge Network handles the CDN; preview URLs are generated automatically for every branch.

---

## 3. GitHub Pages

1. Enable Pages in *Settings → Pages → Source → GitHub Actions*
2. The workflow at `.github/workflows/ci.yml` builds and deploys on every push to `main`

> **Note:** The Decap CMS admin panel requires a backend that handles OAuth. With GitHub Pages, use [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) as the auth proxy or switch to Cloudflare Pages + Zero Trust.

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HUGO_VERSION` | ✅ | — | Hugo binary version pinned for reproducible builds |
| `BASE_URL` | ✅ (prod) | — | Canonical site URL (e.g. `https://blog.example.com`) |
| `CMS_BACKEND_URL` | ✅ (CMS) | — | Netlify Identity or CF Access URL for Decap CMS auth |
| `PREVIEW_SECRET` | Optional | — | Token for on-demand ISR preview (Vercel only) |

---

## Local Development

```bash
# Install Hugo (macOS)
brew install hugo

# Install Hugo (Linux)
wget https://github.com/gohugoio/hugo/releases/download/v0.136.0/hugo_extended_0.136.0_linux-amd64.tar.gz
tar -xzf hugo_*.tar.gz && sudo mv hugo /usr/local/bin/

# Run dev server
hugo server --disableFastRender --buildDrafts
# → http://localhost:1313
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `hugo: command not found` | Add `HUGO_VERSION` env var or install manually |
| CMS shows "Not logged in" | Check Zero Trust / Netlify Identity config |
| Build fails on `extended` features | Ensure `extended: true` in the Hugo setup action |
| 404 on `/admin` | Verify the `_redirects` file exists in `static/` |
