# CyberWatch Website

Official static website for the CyberWatch Personal Windows Security Monitor.
This is a completely static frontend built with HTML, CSS, and Vanilla JavaScript.

## 🚀 Deployment Guide

This folder is designed to be instantly deployable to any static hosting provider.

### Option 1: Deploy to Vercel (Recommended)

Vercel is the fastest and easiest way to host this website.

1. Create a new repository on your GitHub account (e.g., `cyberwatch-web`).
2. Upload all the contents of this `deploy/website/` folder to that repository.
   *(Make sure `index.html` is at the root of the repository).*
3. Log in to [Vercel](https://vercel.com/) and click **Add New → Project**.
4. Import your newly created GitHub repository.
5. Vercel will auto-detect that it is a static site. You don't need to configure any build commands.
6. Click **Deploy**. Your website will be live in seconds!

### Option 2: Deploy to GitHub Pages

If you prefer to host directly on GitHub Pages for free:

1. Create a new repository on your GitHub account.
2. Upload the contents of this `deploy/website/` folder to the repository.
3. Go to the repository **Settings** in GitHub.
4. On the left sidebar, click on **Pages**.
5. Under **Build and deployment**, set the Source to **Deploy from a branch**.
6. Select your `main` (or `master`) branch and the `/ (root)` folder, then click **Save**.
7. GitHub will build the site and provide you with a live URL (e.g., `https://yourusername.github.io/cyberwatch-web/`).

## 📁 File Structure

```text
.
├── index.html              # Main single-page website
├── README.md               # This file
├── css/
│   └── style.css           # Complete design system with CSS variables
├── js/
│   └── main.js             # Three.js hero + GSAP animations + Lenis scroll
├── docs/                   # Documentation hub
│   ├── index.html          
│   ├── installation.html   
│   ├── configuration.html  
│   ├── privacy.html        
│   ├── troubleshooting.html
│   └── faq.html
└── downloads/
    └── user-guide.html     # HTML version of the setup guide
```

## 📦 Note on the Installer

The website's download button links to `downloads/CyberWatch-Setup.exe`. 
Before deploying to production, make sure you place your actual generated installer `.exe` into the `downloads/` folder, or update the download links in `index.html` to point to a direct download URL.

## 🎨 Modifying the Theme

The website is styled entirely with CSS variables. To change the core colors or fonts, edit the `:root` variables at the top of `css/style.css`:

```css
:root {
  --accent: #3b82f6;        /* Primary Blue */
  --accent-bright: #60a5fa; /* Hover Blue */
  --bg-base: #030712;       /* Background */
}
```

## 🛠️ Technology

- HTML5 + Vanilla CSS + Vanilla JS
- [Three.js](https://threejs.org/) (CDN) — 3D hero visual
- [GSAP](https://greensock.com/gsap/) (CDN) — scroll animations
- [Lenis](https://github.com/studio-freight/lenis) (CDN) — smooth scroll
- Google Fonts (Inter, JetBrains Mono)
- No build tools, no Node.js, no npm required.
