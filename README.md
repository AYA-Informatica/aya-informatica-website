# AYA Informatica — Next.js Website

A modern, production-ready website for AYA Informatica built on the full Next.js 14 App Router stack.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Shadcn UI (Radix UI primitives) |
| Icons | Lucide React |
| Animations | Framer Motion |
| Global State | Zustand |
| Forms | React Hook Form + Zod |
| Fonts | @fontsource/syne + @fontsource/dm-sans (self-hosted) |

## Brand Colors

| Role | Name | Hex |
|---|---|---|
| Primary | Deep Navy | `#001529` |
| Background | Soft Light | `#F5F5F5` |
| Accent | Tech Blue | `#0A84FF` |
| Text | Dark Gray | `#1A1A1A` |
| Muted | Medium Gray | `#A0A0A0` |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Home page
│   ├── about/page.tsx      # About page
│   ├── products/page.tsx   # Products page
│   ├── services/page.tsx   # Services page
│   ├── contact/page.tsx    # Contact page (Server Component)
│   ├── not-found.tsx       # 404 page
│   ├── globals.css         # Tailwind + base styles
│   └── api/contact/        # API route for form submission
├── components/
│   ├── ui/                 # Shadcn primitives (Button, Input, etc.)
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # ContactForm (Client Component)
│   └── shared/             # MotionDiv, SectionHeader
├── hooks/
│   └── use-scrolled.ts     # Navbar scroll detection
├── lib/
│   ├── constants.ts        # All site content data
│   ├── utils.ts            # cn() utility
│   └── validations.ts      # Zod schemas
├── store/
│   └── ui.ts               # Zustand UI store (mobile menu)
└── types/
    └── index.ts            # Shared TypeScript types
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# → Edit .env.local and add your Formspree URL

# 3. Run development server
npm run dev
# → Visit http://localhost:3000

# 4. Build for production
npm run build
npm start
```

## Activating the Contact Form

The contact form uses a **custom Nodemailer SMTP solution** — no paid third-party service required.

### Quickstart with Gmail (free, takes 5 minutes)

1. Enable 2FA on your Google account (required by Google for App Passwords)
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an App Password called "AYA Website"
4. Copy `.env.local.example` to `.env.local` and fill in:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ay.company.andy@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="AYA Informatica" <ay.company.andy@gmail.com>
CONTACT_TO=ay.company.andy@gmail.com
```

### Other free SMTP providers
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Zoho Mail** (free custom domain): `smtp.zoho.com:587`
- **Resend** (3,000/month free, scales well): `smtp.resend.com:587`

## Deployment

### Vercel (recommended)
```bash
npx vercel --prod
```
Set environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

### Other platforms
```bash
npm run build
# Serve the .next/ output or export as static if needed
```

## Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero, pillars, products preview, approach, CTA |
| `/about` | About | Story, vision/mission, team, roadmap |
| `/products` | Products | RAY detail + mockup, features, Humura, ecosystem |
| `/services` | Services | 3 service sections, process steps, why AYA |
| `/contact` | Contact | Sidebar info + validated form |
| `*` | 404 | Branded not-found page |

## Contact

AYA Informatica · Kigali, Rwanda  
📧 ay.company.andy@gmail.com  
📱 +250 787 891 746
