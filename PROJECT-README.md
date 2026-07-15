# Trevor Travis Academic Editing — Project Manifest

Full inventory of the site before hosting. 24 files total.

## Pages (14 HTML files)

| File | Purpose | Indexed by search engines? |
|---|---|---|
| `index.html` | Homepage — hero, services, subjects, pricing, process, work, FAQ, about, contact | Yes |
| `team.html` | Meet the editor + future team growth | Yes |
| `resources.html` | Guides hub — links to the 3 articles + 4 downloadable checklists | Yes |
| `blog-apa-citation-mistakes.html` | Article: APA 7th edition mistakes | Yes |
| `blog-literature-review-structure.html` | Article: literature review structure | Yes |
| `blog-personal-statement-tips.html` | Article: personal statement tips | Yes |
| `privacy-policy.html` | Legal — privacy policy | Yes |
| `terms-of-service.html` | Legal — terms of service | Yes |
| `404.html` | Custom error page | No (error page) |
| `login.html` | Client sign-in (Supabase auth) | No — blocked in robots.txt |
| `signup.html` | Client sign-up (Supabase auth) | No — blocked in robots.txt |
| `dashboard.html` | Logged-in client dashboard — submit projects, upload files | No — blocked in robots.txt |

## Code / config (4 files)

| File | Purpose |
|---|---|
| `supabase-client.js` | All Supabase auth + file upload logic. Contains your live project URL and anon key. |
| `supabase-js.min.js` | Self-hosted Supabase library (avoids CDN-blocking issues from ad blockers/privacy shields) |
| `supabase-schema.sql` | Complete record of everything set up on your live Supabase project — tables, security policies, storage bucket, auto-profile trigger |
| `robots.txt` | Tells search engines what to crawl; blocks login/signup/dashboard |
| `sitemap.xml` | Lists all 8 public pages for search engines |

## Images / icons (6 files)

`favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png`, `og-image.png` — browser tab icon and social-share preview image, all using the "T" monogram / navy-brass brand.

---

## What's already live and working

- **Supabase project** (`jordan-cole-academic`, region `us-east-1`) — active
- **Database**: `profiles` and `projects` tables, Row Level Security enabled, zero security warnings
- **Auto-profile trigger**: fixes the "foreign key" bug from earlier — every new signup gets a profile row automatically, regardless of email confirmation timing
- **Storage**: private `drafts` bucket for file uploads, with per-user access policies
- **Full auth flow tested by you**: sign up → email confirmation → dashboard → project submission, confirmed working

## What's real content (not placeholder)

- Name: Trevor Travis
- Location: Texas
- Stats: 200+ projects completed
- Payment: via Stripe (you're integrating this yourself)
- All legal pages use "Trevor Travis" and Texas jurisdiction
- 3 full articles (not stubs) with real, substantive advice

## What's still open — do these before going fully live

**Must do:**
1. **Domain name.** Every file currently references `trevortravis.com` as a placeholder domain (in canonical links, OG tags, `robots.txt`, `sitemap.xml`). Once you register a real domain, these need updating to match — otherwise search engines and shared links will point at a domain you don't own.
2. **Supabase redirect URLs.** Your Supabase project is currently only configured to accept auth redirects from `localhost`. Once you have your live Vercel URL, tell me — this needs updating in Supabase's Auth settings or login/signup/email-confirmation will break on the live site even though it works locally.
3. **Stripe integration.** Referenced throughout the site (pricing section, legal pages) but not yet wired to real checkout — you mentioned handling this yourself.
4. **Contact form backend.** Still doesn't submit anywhere. Needs Formspree or Netlify Forms connected (a few minutes once you pick one).

**Should do:**
5. **4 downloadable guide PDFs** on `resources.html` — currently link to `#` (dead links). Either create the PDFs or remove the section until they exist.
6. **Hosting provider name** in `privacy-policy.html` — currently bracketed since Vercel wasn't chosen yet at the time; update now that you're hosting there.
7. **Payment/refund policy specifics** in `terms-of-service.html` — deliberately left as a flagged decision only you can make, not invented.
8. **Lawyer review** of the legal pages before relying on them commercially.

**Nice to have, not urgent:**
9. Password reset flow on `login.html`
10. Email notifications when a client submits a project
11. Analytics (Google Analytics or Plausible)
12. Real testimonials once you have 2-3 genuine ones (the section was removed rather than faked)

---

## Deploying to Vercel — quick recap

1. Push all 24 files to a GitHub repo, or run `npx vercel` from the folder
2. Deploy — Vercel auto-detects a static site, no build config needed
3. Send me the live URL so I can update the Supabase redirect settings
4. Once you have a real domain, say the word and I'll do a full find-and-replace of `trevortravis.com` across every file in one pass
