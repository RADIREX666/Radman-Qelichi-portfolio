# Radman-Qelichi-portfolio
Radman Qelichi | رادمان قلیچی portfolio : radmanqelichi.ir
# ✨ Radirex Portfolio

<div align="center">

![Status](https://img.shields.io/badge/status-active-ffc107?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bilingual](https://img.shields.io/badge/EN%20%2F%20FA-bilingual-0f172a?style=for-the-badge)
![SEO](https://img.shields.io/badge/SEO-optimized-16a34a?style=for-the-badge)
![Deploy](https://img.shields.io/badge/deploy-ready-2563eb?style=for-the-badge)

### A fast, bilingual, SEO-focused portfolio for **Radman Qelichi**

Built to showcase work, case studies, insights, and a polished personal brand experience on `radirex.ir`.

[Live Website](https://radirex.ir) • [Features](#-features) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## 🪩 Vibe

This is not just a portfolio site — it is a **modern personal product**:

- 🌍 **Bilingual by design** — English + Persian with RTL support
- ⚡ **Fast and lightweight** — static-first architecture with Vite
- 🔎 **SEO-aware** — structured data, metadata, sitemap, robots, verification
- 🎯 **Conversion-focused** — contact flow, call-to-action paths, credibility sections
- 🎨 **Polished interactions** — typed hero, theme toggle, command menu, motion details

## 📸 Snapshot

> A sleek developer portfolio experience focused on performance, trust, and discoverability.

**Includes:**

- Hero landing page
- Case studies
- Insight/article pages
- Testimonials and FAQ
- Contact form workflow
- CV download flow
- Alternate CloudLinux deployment build

## 🧠 Why This Project Feels Special

- **Personal branding + engineering** in one codebase
- **Persian localization** with thoughtful RTL handling
- **Static simplicity** without unnecessary framework overhead
- **Production-minded structure** with deploy outputs and supporting docs
- **SEO and content strategy** built right into the repository

## 🛠 Tech Stack

<div align="center">

![HTML](https://img.shields.io/badge/HTML-111827?style=flat-square&logo=html5&logoColor=E34F26)
![CSS](https://img.shields.io/badge/CSS-111827?style=flat-square&logo=css&logoColor=1572B6)
![JavaScript](https://img.shields.io/badge/JavaScript-111827?style=flat-square&logo=javascript&logoColor=F7DF1E)
![Vite](https://img.shields.io/badge/Vite-111827?style=flat-square&logo=vite&logoColor=646CFF)
![PostCSS](https://img.shields.io/badge/PostCSS-111827?style=flat-square&logo=postcss&logoColor=DD3A0A)
![Tailwind](https://img.shields.io/badge/Tailwind_Tooling-111827?style=flat-square&logo=tailwindcss&logoColor=06B6D4)
![PHP](https://img.shields.io/badge/PHP-111827?style=flat-square&logo=php&logoColor=777BB4)

</div>

- `HTML`, `CSS`, `JavaScript`
- `Vite` for local development and production builds
- `PostCSS` and Tailwind-related tooling
- `Sharp` for image optimization scripts
- `PHP` endpoint for contact form handling in `public/api/contact.php`

## 🎭 Features

### ✨ Experience

- Typed hero animation
- Theme toggle with stored preference
- Scroll progress bar
- Quick command menu
- Responsive navigation and mobile interactions

### 🌐 Localization

- English / Persian toggle
- RTL layout support
- Persian-friendly font handling
- Stored language preference with `localStorage`

### 📚 Content System

- Portfolio landing page
- Project showcase section
- Static case study pages
- Static insights/articles
- Testimonials
- FAQ
- Contact section

### 🔍 SEO & Discoverability

- Rich metadata
- Open Graph + Twitter cards
- JSON-LD structured data
- `robots.txt`
- `sitemap.xml`
- `humans.txt`
- Google site verification support

### 🚀 Deployment

- Standard production build in `dist/`
- Alternate deployment build in `dist-cloudlinux/`
- Static assets and CV files in `public/`
- Safer relative-path handling for subfolder deployment cases

## 🗂 Project Structure

```text
.
├── index.html
├── main.js
├── style.css
├── public/
│   ├── api/
│   ├── case-studies/
│   ├── insights/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── *.pdf / *.svg / *.txt
├── scripts/
├── dist/
├── dist-cloudlinux/
└── README.md
```

### 📌 Important Files

- `index.html` — main landing page
- `main.js` — interactive behavior and UI logic
- `style.css` — global styling
- `public/api/contact.php` — contact form backend handler
- `public/insights/` — article pages and insight assets
- `public/case-studies/` — case study pages
- `scripts/` — helper automation for assets and deployment

## 🚀 Getting Started

### Prerequisites

- `Node.js`
- `npm`

### Install dependencies

```bash
npm install
```

### Start development

```bash
npm run dev
```

### Build production output

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Build CloudLinux version

```bash
npm run build:cloudlinux
```

## 🧪 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local Vite dev server |
| `npm run build` | Builds production output into `dist/` |
| `npm run preview` | Previews the production build |
| `npm run build:cloudlinux` | Builds alternate output into `dist-cloudlinux/` |
| `npm run images:optimize` | Optimizes images using `Sharp` |
| `npm run sync:cloudlinux` | Syncs CloudLinux deployment assets |
| `npm run pack:cloudlinux` | Packages the CloudLinux build |

## 🎨 Design Notes

This project leans into:

- dark luxury-style UI
- warm accent color branding
- motion without heavy frameworks
- clean typography
- developer credibility mixed with client-facing clarity

## 📈 SEO & Content Docs

This repo includes extra documentation for growth and search visibility:

- `START-HERE.md`
- `SEO-SUMMARY.md`
- `SEO-IMPLEMENTATION-GUIDE.md`
- `SEO-CHECKLIST.md`
- `SEO-7-LAYER-PLAN.md`
- `GOOGLE-VERIFICATION-STEPS.md`
- `BILINGUAL-FEATURE.md`
- `BILINGUAL-SUMMARY.md`
- `COMPLETE-SUMMARY.txt`

## 💌 Contact Flow

The site uses:

- frontend validation in `main.js`
- server-side handling in `public/api/contact.php`
- a `mailto:` fallback for resilience when direct delivery fails

## 🧭 Deployment Notes

- `dist/` is the standard production output
- `dist-cloudlinux/` is the alternate deployment target
- `public/` contains static files copied into builds
- relative-path fixes help the site behave better outside strict root-domain deployments

## 🌟 Ideal Use Case

This repo is great if you want inspiration for a:

- developer portfolio
- bilingual personal brand site
- SEO-aware static marketing site
- lightweight case-study-driven showcase

## 🤝 Contributing

This is a personal portfolio project, so contributions are selective. If you fork it for your own use, make sure to replace:

- branding
- content
- SEO metadata
- personal links
- CV files
- contact details

## 📄 License

No license is currently specified in `package.json`.

If you plan to open this repo for reuse, add a clear license before publishing broadly.

## 👨‍💻 Author

**Radman Qelichi**

- Website: `https://radmanqelichi.ir`
- GitHub: `https://github.com/RADIREX666`

---

<div align="center">

### 💛 Built with taste, speed, and intention

If you want, the next upgrade can be:

**repo banner • screenshot gallery • GIF previews • contribution guide • release notes**

</div>

