# AYA Informatica Website

A modern, production-ready website for AYA Informatica — built with React + Vite + TypeScript.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 5
- **Routing**: React Router v6
- **Fonts**: Syne (display) + DM Sans (body) via Google Fonts
- **Styling**: Pure CSS with CSS custom properties (no CSS framework)

## Brand Colors

| Role | Color | Hex |
|------|-------|-----|
| Primary / Navy | Deep Navy | `#001529` |
| Background | Soft Light | `#F5F5F5` |
| Accent | Tech Blue | `#0A84FF` |
| Dark Text | Dark Gray | `#1A1A1A` |
| Supporting | Medium Gray | `#A0A0A0` |

## Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | First impression + positioning |
| `/about` | About | Trust + story |
| `/products` | Products | Power + vision |
| `/services` | Services | Revenue |
| `/contact` | Contact | Action |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx / .css
│   └── Footer.tsx / .css
├── pages/
│   ├── HomePage.tsx / .css
│   ├── AboutPage.tsx / .css
│   ├── ProductsPage.tsx / .css
│   ├── ServicesPage.tsx / .css
│   └── ContactPage.tsx / .css
├── hooks/
│   └── useScrollReveal.ts
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
```

## Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ SEO optimized (meta tags, OG tags, structured data, canonical URLs)
- ✅ Accessible (semantic HTML, ARIA labels, focus states, alt text)
- ✅ Smooth scroll-reveal animations
- ✅ Mobile hamburger navigation
- ✅ Working contact form with success/error states
- ✅ Brand-consistent design system via CSS variables

## Deployment

This is a standard Vite SPA. Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop the `dist/` folder, or connect via Git
- **GitHub Pages**: Use the `vite-plugin-gh-pages` package
- **Any CDN**: Run `npm run build` and serve the `dist/` folder

> ⚠️ **Note**: The contact form currently simulates submission. To make it functional,
> integrate with a backend service (e.g., EmailJS, Formspree, or a custom API endpoint).

## Contact

AYA Informatica · Kigali, Rwanda  
📧 ay.company.andy@gmail.com  
📱 +250 787 891 746
