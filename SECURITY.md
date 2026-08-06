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

Order matters more than usual here, because two of the steps fail in ways that
look like success. Working checklist:

- [ ] Upstash database created, both variables in Vercel, **redeployed** (1.0)
- [ ] Site added to Cloudflare, apex + www as CNAMEs, **cloud still grey** (1.1)
- [ ] Nameservers changed at the registrar (1.1)
- [ ] Vercel reports **Valid Configuration** with a certificate — wait for this
- [ ] SSL/TLS set to **Full (strict)** (1.2)
- [ ] Both records switched to **Proxied / orange** (1.1) ← protection starts here
- [ ] `curl -sI https://ayainformatica.tech | grep -i '^cf-ray'` returns a value
- [ ] Managed + OWASP rulesets, Bot Fight Mode, the one rate-limit rule (1.3)

### 1.0 Do this before touching DNS

Rate limiting is **not working in production** until Upstash is configured. The
in-memory fallback resets on every cold start, so in a serverless deployment it
is effectively off. This takes five minutes and carries no DNS risk, so it comes
first.

1. [console.upstash.com](https://console.upstash.com) → **Create Database**.
2. Type **Redis**, region **eu-west-1** — the closest to the `cdg1` region set in
   `vercel.json`. Every limiter decision is a round trip, so distance is latency
   on every request.
3. **REST API** tab → copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Vercel → **Settings → Environment Variables** → add both to **Production**.
5. **Redeploy.** Environment variables only apply to new deployments.

### 1.1 Point the domain at Cloudflare

The starting state, confirmed by DNS lookup:

| Record | Value |
|---|---|
| Nameservers | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |
| A (apex) | `216.150.16.193`, `216.150.16.65` |
| MX | none |
| TXT | none |

Vercel is the DNS provider, not just the host, so this moves DNS away from it.
With no MX and no TXT records there is no mail routing and no verification token
to preserve — the usual migration hazard does not apply here. Only the apex
needs to survive.

1. Create a free Cloudflare account and **Add a site** → `ayainformatica.tech`.
2. Replace the imported A records with a CNAME. Cloudflare flattens CNAMEs at
   the apex, and this keeps working if Vercel changes its anycast addresses:

   | Type | Name | Target | Proxy |
   |---|---|---|---|
   | CNAME | `@` | `cname.vercel-dns.com` | **grey — for now** |
   | CNAME | `www` | `cname.vercel-dns.com` | **grey — for now** |

   Grey deliberately. Vercel issues its TLS certificate through an HTTP
   challenge, and Cloudflare proxying intercepts that challenge, so a domain
   that has never been verified will fail to get a certificate if you start
   orange. DNS-only first.
3. Replace the nameservers at your registrar with the two Cloudflare gives you.
   Propagation is usually under an hour, occasionally up to 24.
4. **Wait for Vercel → Settings → Domains to report Valid Configuration** with a
   certificate issued. Do not continue before it does.
5. Now switch both records to **Proxied** (orange). This is the moment any of
   the protection below starts applying — while the cloud is grey, traffic
   reaches Vercel directly and Cloudflare sees none of it.

### 1.2 SSL/TLS

Set this **with or before** the switch to orange, not after.

- **SSL/TLS → Overview → Full (strict)**. Anything less lets the Cloudflare↔Vercel
  hop run unencrypted or unverified, and *Flexible* specifically produces an
  infinite redirect loop: Vercel forces HTTPS, Cloudflare calls it over HTTP,
  and the two argue until the browser gives up.
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

The free plan allows **one** rate-limiting rule. Spend it here — this is the
only endpoint that costs anything to abuse:

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

A second, wider rule is worth adding **if the plan is ever upgraded** — it needs
a rule slot the free plan does not have:

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

Until that slot exists, the `page` tier in `proxy.ts` (200/min) is what covers
this case. It is the weaker of the two — it fires after the request has been
paid for rather than before — but it is not nothing, and it is already live.

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

**Is Cloudflare actually in front?** Everything in Layer 1 depends on this one
answer, and a grey cloud fails silently — the site works perfectly, entirely
unprotected.

```bash
curl -sI https://ayainformatica.tech | grep -i '^cf-ray'   # a value = proxied
```

No `cf-ray` means the record is DNS-only and none of the WAF, bot or
rate-limiting configuration is being applied, however carefully it was set up.

**Is Upstash actually wired?** The limiter is silent about falling back, so
check it by behaviour: eight rapid posts should turn into `429` after five, and
should *stay* limited after a redeploy. If a redeploy resets the count, the
in-memory fallback is still in use and the environment variables did not take.

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
