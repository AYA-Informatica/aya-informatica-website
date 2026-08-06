# Security

How `ayainformatica.tech` is defended, what each layer can and cannot do, and
what to do when something is happening.

## The honest shape of it

Protection sits in three layers, and they are not interchangeable.

| Layer | Where | Stops | Cannot stop |
|---|---|---|---|
| **Network / edge** | Cloudflare | Volumetric floods, L3/L4 attacks, most L7 floods, known-bad bots | Anything it is not in front of |
| **Application proxy** | `src/proxy.ts` | Scanners, scrapers, abusive clients, oversized bodies, wrong methods | A DDoS — see below |
| **Endpoint** | `src/app/api/contact` | Malformed input, spam, forged origins | Traffic that never reaches it |

**The application layer cannot stop a DDoS, and no amount of code will change
that.** By the time a request reaches `proxy.ts`, the TCP connection has been
accepted, the TLS handshake has completed, bandwidth has been consumed and a
serverless function has been invoked and billed. Rate limiting there decides
what to *answer*, not what to *pay for*. Anyone who tells you middleware is DDoS
protection is selling something.

That is why Cloudflare goes in front. It absorbs the flood at its own edge, in
its own network, and your origin never sees it.

---

## Layer 1 — Cloudflare (must be done in the dashboard)

Everything in this section is configuration, not code. It is written out so it
can be executed and audited later.

### 1.1 Point the domain at Cloudflare

1. Create a free Cloudflare account and **Add a site** → `ayainformatica.tech`.
2. Cloudflare scans the existing DNS. Check the imported records against your
   current registrar before continuing — a missed MX record silently kills your
   email.
3. Replace the nameservers at your registrar with the two Cloudflare gives you.
   Propagation is usually under an hour, occasionally up to 24.
4. In **DNS → Records**, make sure the record pointing at Vercel is
   **Proxied** (the cloud icon is orange, not grey). A grey cloud is DNS-only:
   traffic bypasses Cloudflare entirely and every protection below does nothing.

> Vercel and Cloudflare proxying coexist, but the domain must remain configured
> in Vercel as well, or Vercel will not issue a certificate for it.

### 1.2 SSL/TLS

- **SSL/TLS → Overview → Full (strict)**. Anything less lets the Cloudflare↔Vercel
  hop run unencrypted or unverified.
- **Edge Certificates → Always Use HTTPS: On**
- **Minimum TLS Version: 1.2**

The app already sends HSTS with a two-year max-age and `preload`.

### 1.3 The rules that do the work

**Security → WAF → Managed rules**

- Enable **Cloudflare Managed Ruleset**.
- Enable **OWASP Core Ruleset**, start at *Low* sensitivity. Higher settings
  produce false positives on ordinary form text; raise it only if you are
  actually being probed and you watch the events afterwards.

**Security → Bots**

- **Bot Fight Mode: On**. Free, and removes most of the background noise.

**Security → WAF → Rate limiting rules**

One rule matters more than the rest:

| Field | Value |
|---|---|
| Name | `contact-endpoint` |
| If incoming requests match | `URI Path` equals `/api/contact` |
| With the same characteristics | `IP` |
| When rate exceeds | `5` requests per `1 minute` |
| Then | `Block` for `1 hour` |

This duplicates the limit in `proxy.ts` on purpose. The application limit is the
one that survives if Cloudflare is bypassed; the Cloudflare limit is the one
that stops the traffic before you pay for it. Defence at both layers is the
point, not redundancy to be tidied away.

A second, wider rule is worth adding if you see sustained crawling:

| Field | Value |
|---|---|
| Name | `site-wide-flood` |
| If | `URI Path` does not start with `/_next/` |
| Same characteristics | `IP` |
| When rate exceeds | `300` requests per `1 minute` |
| Then | `Managed Challenge` |

Challenge rather than block. Carrier-grade NAT is widespread across East Africa,
so one address can front a large number of real visitors — a hard block at this
tier would take out a whole ISP's worth of genuine users at once.

**Security → Settings**

- **Security Level: Medium**
- **Challenge Passage: 30 minutes**
- **Browser Integrity Check: On**

### 1.4 Geographic filtering — think before enabling

Do not blanket-block countries. The site is trilingual, targets a diaspora
audience, and its analytics and search crawlers come from everywhere. If you
must filter, filter on *behaviour*, not origin: a WAF rule on
`cf.threat_score gt 14` is a far better signal than a country list.

### 1.5 During an actual attack

1. **Security → Settings → I'm Under Attack Mode: On.** Every visitor gets an
   interstitial for about five seconds. It is disruptive, and it works.
2. Watch **Security → Events** to find what the traffic has in common — an ASN,
   a user-agent, a path, a JA4 fingerprint.
3. Write a temporary custom rule blocking that characteristic specifically.
4. Turn Under Attack Mode back off once the targeted rule is holding. Leaving it
   on costs you real visitors and search crawlers.

---

## Layer 2 — the application proxy

In `src/proxy.ts`, backed by `src/lib/traffic-guard.ts`. Checks run cheapest
first, so a scanner sweeping for `/wp-login.php` costs a prefix match and
nothing more.

| Order | Guard | Response |
|---|---|---|
| 1 | Static assets excluded by `config.matcher` | never invoked |
| 2 | Known scanner paths (`/wp-admin`, `/.env`, `/.git`, …) | `404` |
| 3 | Methods outside GET/HEAD/POST/OPTIONS | `405` |
| 4 | Origin allowlist on state-changing requests | `403` |
| 5 | Declared body over 16KB | `413` |
| 6 | Rate limit for the path's tier | `429` |

### Rate limit tiers

| Tier | Paths | Limit |
|---|---|---|
| `contact` | `/api/contact` | 5 / minute |
| `api` | other `/api/*` | 30 / minute |
| `page` | everything else | 200 / minute |

Backed by Upstash Redis when `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` are set. **Without them the limiter falls back to an
in-memory map that resets on every cold start, which in production means it is
effectively off.** Setting those two variables is the single highest-value
change still outstanding.

### Why the client IP is resolved the way it is

`resolveClientIp` reads, in order: `cf-connecting-ip`, `x-vercel-forwarded-for`,
`x-real-ip`, and only then `x-forwarded-for`.

That order is a security control, not a preference. `x-forwarded-for` is
supplied by the caller and appended to by proxies rather than replaced, so its
leftmost entry is whatever the client decided to write. A rate limiter keyed on
it is bypassed by rotating one header. Cloudflare overwrites `cf-connecting-ip`
on every request and strips any client-supplied copy; Vercel sets its own
headers from the real TCP peer. Those can be trusted. The forwarded header is
kept last only so local development still resolves to something.

**If you ever move off Cloudflare or Vercel, revisit this function.** Its
trust assumptions are specific to those two providers.

---

## Layer 3 — the contact endpoint

| Control | Behaviour |
|---|---|
| Zod schema | Shared by client and server; the server never trusts the client's copy |
| Sanitisation | HTML stripped *before* validation, so length limits apply to the real content |
| Honeypot | `_honey` field; a filled one returns `200` and sends nothing, so bots learn nothing |
| Origin requirement | State-changing requests must carry an allowlisted `Origin` |
| Turnstile | Optional. **Set both keys or neither** — the secret alone makes the server demand a token the browser has no widget to produce, rejecting every genuine submission |
| Header injection | CR/LF stripped from every value interpolated into a mail header |
| HTML escaping | Applied to every user value in the email templates |

## Headers

Defined once in `src/lib/security-headers.js` and shared by `next.config.js` and
the proxy, so the two cannot drift.

CSP, HSTS (2 years, `includeSubDomains`, `preload`), `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
and a `Permissions-Policy` denying camera, microphone, geolocation and payment.

`'unsafe-eval'` is added in development only, gated on `NODE_ENV`. Verify after
any deploy:

```bash
curl -sI https://ayainformatica.tech | grep -i content-security-policy
```

If `unsafe-eval` appears in that output, a development build reached production.

### Known weakness

`script-src` still carries `'unsafe-inline'`, because Next.js emits inline
bootstrap scripts. Removing it means adopting a per-request nonce, which in turn
means the pages carrying it can no longer be statically prerendered — all 24 of
them currently are. That trade has not been made. It is the largest remaining
gap in the CSP and it is a deliberate, documented choice rather than an
oversight.

## Dependencies

```bash
npm audit          # currently 0 vulnerabilities
```

Nested transitive advisories are pinned via `overrides` in `package.json`.
Do not run `npm audit fix --force` here — it has previously tried to "fix" the
tree by downgrading Next.js from 16 to 9.3.3.

## Verifying the whole thing

```bash
curl -sI https://ayainformatica.tech | grep -iE 'strict-transport|content-security|x-frame'
curl -s -o /dev/null -w '%{http_code}\n' https://ayainformatica.tech/wp-login.php   # expect 404
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE https://ayainformatica.tech/     # expect 405
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://ayainformatica.tech/api/contact  # expect 403
for i in $(seq 1 8); do
  curl -s -o /dev/null -w '%{http_code} ' -X POST \
    -H 'Content-Type: application/json' -H 'Origin: https://ayainformatica.tech' \
    -d '{}' https://ayainformatica.tech/api/contact
done; echo   # expect 400s then 429s
```

Behaviour is also covered by `src/lib/traffic-guard.test.ts` and
`src/lib/security-headers.test.ts`.

## Reporting

Security issues: **ay.company.andy@gmail.com**. Please do not open a public
issue for anything exploitable.
