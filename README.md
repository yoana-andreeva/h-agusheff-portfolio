# H.Agusheff — Concert & Event Photography Portfolio

A responsive, dark and editorial portfolio website for concert and event photographer **Hristiyan Agusheff (H.Agusheff)**, built with plain HTML, CSS and JavaScript.

**🔗 Live site: [h-agusheff.netlify.app](https://h-agusheff.netlify.app/)**

<!--
Add 2-3 screenshots of the live site here once you have them, for example:

<p align="center">
  <img src="screenshots/home.png" alt="Home page" width="48%">
  <img src="screenshots/project.png" alt="Project gallery" width="48%">
</p>
-->

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Projects Featured](#projects-featured)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Deployment](#deployment)
- [Copyright](#copyright)
- [Author](#author)

---

## About

The goal of this project was to create a clean, fast and visually impactful online portfolio that lets the photographer's work speak for itself. The site presents live music, festival and nightlife photography as a set of project "folders", each opening into its own full gallery page.

The design is dark and editorial, inspired by contemporary photography portfolios, and optimized for both phone and laptop screens.

## Features

- **Responsive design:** layouts adapted for mobile, tablet and desktop.
- **Project covers on the home page:** projects are shown as horizontal cover photos in a staggered, editorial arrangement, with a hover arrow and "View project" label.
- **Individual project pages:** each project opens as its own page with the event name, year and a full photo gallery.
- **Justified gallery layout:** photos are arranged in rows that keep their original proportions.
- **All Projects page:** a single page that shows all photos together.
- **Ambient color glow:** a soft glow behind the page that changes color based on the dominant color of the photo currently in view, like stage light bleeding through a dark room.
- **Subtle scroll effects:** the hero text fades and moves on scroll, and content reveals as it enters the viewport (using `IntersectionObserver`).
- **Navigation helpers:** previous/next project arrows and a back-to-top button.
- **Instagram link** in the header and a contact section in the footer.
- **Performance-minded:** all images are in WebP format, with long-lived cache headers configured for Netlify.
- **SEO basics:** page titles, meta descriptions, `sitemap.xml` and `robots.txt`.
- **No framework and no build step:** only static files.

## Projects Featured

| Project | Page |
|---------|------|
| Burrata Fashion Show (2026) | [View](https://h-agusheff.netlify.app/work/burrata-fashion-show.html) |
| Casa de Cuba Rum & Cigar Tasting (2026) | [View](https://h-agusheff.netlify.app/work/casa-de-cuba-rum-cigar-tasting.html) |
| Kapana Fest 2025 | [View](https://h-agusheff.netlify.app/work/kapana-fest-2025.html) |
| Shake That Hill 2025 | [View](https://h-agusheff.netlify.app/work/shake-that-hill-2025.html) |
| Cotton Candy Party | [View](https://h-agusheff.netlify.app/work/cotton-candy-party.html) |
| Tony Dimitrova Live | [View](https://h-agusheff.netlify.app/work/tony-dimitrova-live.html) |

## Tech Stack

- **HTML5**: semantic page structure
- **CSS3**: custom properties, Grid and Flexbox, responsive layouts, animations
- **JavaScript (vanilla)**: gallery layout, scroll effects, dominant-color glow
- **Google Fonts**: Bebas Neue, Inter, JetBrains Mono, Instrument Serif and Playfair Display
- **Netlify**: hosting and deployment

## Project Structure

```
h-agusheff-portfolio/
├── index.html              # Home page
├── all-projects.html       # Page with all photos
├── work/                   # One page per project
│   ├── burrata-fashion-show.html
│   ├── casa-de-cuba-rum-cigar-tasting.html
│   ├── cotton-candy-party.html
│   ├── kapana-fest-2025.html
│   ├── shake-that-hill-2025.html
│   └── tony-dimitrova-live.html
├── css/
│   └── style.css           # All styles
├── js/
│   └── main.js             # Gallery, scroll effects and glow
├── images/                 # Project photos (WebP), one folder per project
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── netlify.toml            # Netlify build and cache settings
```

## Run Locally

No installation is needed. The site is made of static files.

**Option 1: open the file**
Open `index.html` in your browser.

**Option 2: local server (recommended)**
```bash
# with Python
python -m http.server 8000

# or with Node.js
npx serve
```
Then open `http://localhost:8000`.

## Deployment

The site is hosted on [Netlify](https://www.netlify.com/) and requires no build step (`publish = "."` in `netlify.toml`).

To deploy your own copy:

1. Fork or clone this repository.
2. In Netlify, choose **Add new site → Import an existing project** and connect the GitHub repository.
3. Leave the build command empty and set the publish directory to `.`.
4. Deploy. Every push to `main` will update the site automatically.

## Copyright

- **Photographs:** © H.Agusheff. All rights reserved. The photos may not be copied, reused or distributed without the photographer's permission.
- **Website design and code:** created by Yoana Andreeva.

## Author

**Yoana Andreeva** — [GitHub](https://github.com/yoana-andreeva)

Photography by **Hristiyan Agusheff** — [Instagram @h.agusheff](https://www.instagram.com/h.agusheff/)
