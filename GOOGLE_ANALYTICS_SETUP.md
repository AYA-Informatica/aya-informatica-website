# Google Analytics 4 Setup Guide

## Why Google Analytics?
- Track visitor behavior
- Understand traffic sources
- Monitor conversion goals
- Measure page performance
- Make data-driven decisions

## Step 1: Create GA4 Account

1. Go to https://analytics.google.com
2. Sign in with Google account
3. Click "Start measuring"
4. Create Account:
   - **Account name**: AYA Informatica
   - Check data sharing settings (optional)
5. Create Property:
   - **Property name**: AYA Informatica Website
   - **Reporting time zone**: Africa/Kigali
   - **Currency**: Rwandan Franc (RWF)
6. About your business:
   - **Industry**: Technology
   - **Business size**: Small (1-10 employees)
   - **Objectives**: Select relevant goals
7. Create Data Stream:
   - Choose "Web"
   - **Website URL**: https://ayainformatica.com
   - **Stream name**: AYA Website

## Step 2: Get Measurement ID

After creating stream, you'll see:
- **Measurement ID**: G-XXXXXXXXXX (copy this)

## Step 3: Implementation

I'll add the GA4 tracking code to your website.

### Option A: Direct Script (Recommended)
Add to `index.html` in `<head>` section.

### Option B: Google Tag Manager (Advanced)
More flexible but requires additional setup.

## Step 4: Configure Events (Optional but Recommended)

Track important actions:
- **Contact form submissions**
- **Product page views** (RAY, Humura)
- **CTA button clicks**
- **Service inquiries**

## Step 5: Set Up Goals

Common goals for your site:
1. Contact form submission
2. Email link clicks
3. Phone number clicks
4. Product page engagement
5. Time on site > 2 minutes

## Implementation Code Ready

Once you provide your Measurement ID (G-XXXXXXXXXX), I'll:
1. Add GA4 script to index.html
2. Set up event tracking for:
   - Contact form submissions
   - CTA button clicks
   - Product page views
3. Configure privacy-compliant tracking

## Privacy Considerations

### GDPR/Privacy Compliance
- Add cookie consent banner (optional for Rwanda, but good practice)
- Update privacy policy
- Anonymize IP addresses (GA4 does this by default)

### Cookie Banner (Optional)
If you want to add one, I can implement a simple solution.

## Monitoring After Setup

Check weekly:
- **Users**: How many visitors
- **Sessions**: How many visits
- **Bounce rate**: % leaving after one page
- **Top pages**: Most visited pages
- **Traffic sources**: Where visitors come from
- **Conversions**: Goal completions

## Expected Insights

You'll learn:
- Which pages get most traffic
- Where visitors come from (Google, direct, social)
- Which products/services interest people most
- How long people stay on site
- Which CTAs work best

---

## 🎯 Ready to Implement?

**Provide me with:**
1. Your GA4 Measurement ID (G-XXXXXXXXXX)

**I'll then:**
1. Add tracking code to index.html
2. Set up event tracking
3. Test to ensure it's working
4. Commit and deploy

**Timeline:**
- Setup: 10 minutes
- Data collection starts: Immediately after deployment
- Meaningful insights: 1-2 weeks of data

---

**Next Steps:**
1. Create GA4 account at https://analytics.google.com
2. Get your Measurement ID
3. Share it with me
4. I'll implement tracking code
