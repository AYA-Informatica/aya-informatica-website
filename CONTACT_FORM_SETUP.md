# Contact Form Setup with Formspree

## ✅ What's Implemented

The contact form now has:
- ✅ Real form submission (Formspree integration)
- ✅ Client-side validation
- ✅ Accessible error messages
- ✅ Loading states
- ✅ Success/error handling
- ✅ Email validation
- ✅ Required field validation
- ✅ Character length validation

## 🔧 Setup Instructions

### Step 1: Create Formspree Account

1. Go to https://formspree.io/
2. Sign up for free account (no credit card required)
3. Free plan includes:
   - 50 submissions/month
   - Email notifications
   - Spam filtering
   - File uploads

### Step 2: Create New Form

1. Click "New Form"
2. Name it: "AYA Informatica Contact Form"
3. Copy your Form ID (looks like: `xyzabc123`)

### Step 3: Update ContactPage.tsx

Replace `YOUR_FORM_ID` in line 82 with your actual Form ID:

```typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

Change to:

```typescript
const response = await fetch('https://formspree.io/f/xyzabc123', {
```

### Step 4: Configure Form Settings (Optional)

In Formspree dashboard:

**Email Settings:**
- Set reply-to email: ay.company.andy@gmail.com
- Enable email notifications
- Customize email template

**Spam Protection:**
- Enable reCAPTCHA (recommended)
- Set up honeypot field
- Block specific domains

**Integrations:**
- Connect to Slack (get notifications)
- Connect to Google Sheets (log submissions)
- Webhook to custom endpoint

## 📋 Form Validation Rules

**Name:**
- Required
- Minimum 2 characters

**Email:**
- Required
- Valid email format (regex validated)

**Subject:**
- Required
- Must select from dropdown

**Message:**
- Required
- Minimum 10 characters

**Phone:**
- Optional
- No validation

## 🎨 User Experience Features

**Real-time Validation:**
- Errors clear as user types
- Errors show on submit if invalid
- Accessible error messages with ARIA

**Loading State:**
- Button shows spinner
- Button disabled during submission
- "Sending..." text feedback

**Success State:**
- Success message with icon
- Form clears automatically
- Option to send another message

**Error State:**
- Error message with fallback email
- User can retry submission

## 🔒 Security Features

**Built-in:**
- HTTPS only
- CORS protection
- Rate limiting (Formspree)
- Spam filtering (Formspree)

**Recommended:**
- Add reCAPTCHA in Formspree dashboard
- Monitor submissions for spam
- Set up email alerts

## 📧 Email Template

Submissions will include:

```
From: [name] <[email]>
Subject: New contact from [name] - [subject]

Name: [name]
Email: [email]
Phone: [phone or "Not provided"]
Subject: [subject]

Message:
[message]
```

## 🧪 Testing

**Test the form:**
1. Fill out all required fields
2. Submit form
3. Check for success message
4. Verify email received at ay.company.andy@gmail.com

**Test validation:**
1. Try submitting empty form (should show errors)
2. Enter invalid email (should show error)
3. Enter short message (should show error)

## 🚀 Alternative: EmailJS

If you prefer EmailJS instead:

1. Sign up at https://www.emailjs.com/
2. Create email service
3. Create email template
4. Get Service ID, Template ID, Public Key
5. Replace Formspree code with EmailJS code

## 📊 Monitoring

**Check submissions:**
- Formspree dashboard shows all submissions
- Email notifications for each submission
- Export to CSV for analysis

**Analytics:**
- Track form submission rate
- Monitor spam submissions
- Analyze common inquiries

---

## ✅ Current Status

- [x] Form validation implemented
- [x] Error handling implemented
- [x] Loading states implemented
- [x] Success states implemented
- [x] Accessibility implemented
- [ ] Formspree Form ID needed (replace YOUR_FORM_ID)
- [ ] Test form submission
- [ ] Configure email notifications

**Next:** Get your Formspree Form ID and update ContactPage.tsx
