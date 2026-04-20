# Google Search Console Setup Guide

## Step 1: Create Account
1. Go to https://search.google.com/search-console
2. Sign in with your Google account
3. Click "Add Property"

## Step 2: Choose Verification Method

### Option A: Domain Property (Recommended)
- Enter: `ayainformatica.com`
- Requires DNS verification (add TXT record to domain registrar)
- Covers all subdomains and protocols

### Option B: URL Prefix Property (Easier)
- Enter: `https://ayainformatica.com`
- Multiple verification methods available

## Step 3: Verification Methods

### Method 1: HTML File Upload (Easiest for Vercel/Netlify)
1. Google will give you a file like `google1234567890abcdef.html`
2. Download it
3. Place it in `/public/` folder
4. Deploy to production
5. Click "Verify" in Google Search Console

### Method 2: HTML Meta Tag
1. Google gives you a meta tag like:
   ```html
   <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   ```
2. Add it to `index.html` in the `<head>` section
3. Deploy to production
4. Click "Verify"

### Method 3: DNS Verification (Most Reliable)
1. Google gives you a TXT record
2. Add it to your domain DNS settings
3. Wait for DNS propagation (can take 24-48 hours)
4. Click "Verify"

## Step 4: Submit Sitemap
Once verified:
1. Go to "Sitemaps" in left sidebar
2. Enter: `sitemap.xml`
3. Click "Submit"

## Step 5: Monitor
- Check "Coverage" for indexing status
- Check "Performance" for search analytics
- Fix any errors that appear

## Current Status
- ✅ sitemap.xml created and ready
- ✅ robots.txt created and ready
- ⏳ Waiting for verification

## Next Steps After Verification
1. Submit sitemap.xml
2. Request indexing for main pages
3. Monitor for 1-2 weeks
4. Check which pages are indexed
5. Fix any crawl errors

---

**Which verification method do you prefer?**
- HTML file upload (easiest)
- Meta tag (quick)
- DNS (most reliable)

Let me know and I'll help you implement it.
