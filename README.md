# OUAC Portal Redesign

A modern, student-friendly redesign of the Ontario Universities' Application Centre (OUAC) portal.

Built with vanilla **HTML**, **CSS**, and **JavaScript** — no frameworks required. Deployable directly to GitHub Pages.

---

## Features

- **Dashboard** — Application progress, checklist, university status cards, deadlines & quick actions
- **Program Explorer** — Search + filter 12 real Ontario programs with save/apply functionality
- **Application Builder** — 5-step guided application with form validation states
- **Application Tracker** — Per-university event timelines and document status
- **AI Assistant Panel** — Sidebar chatbot that answers OUAC and program questions

## Design

- **Color palette**: Beige & Forest Green — calm, natural, approachable
- **Typography**: Fraunces (display) + DM Sans (body)
- **Aesthetic**: Notion/Linear/Stripe-inspired — clean cards, generous spacing, subtle animations
- **Responsive**: Mobile-first, works on all screen sizes

---

## Project Structure

```
ouac-portal/
├── index.html    # All pages and components (single-page app)
├── styles.css    # CSS variables, layout, components, animations
├── app.js        # Navigation, program data, AI logic, interactions
└── README.md
```

## Running Locally

Just open `index.html` in any modern browser — no build step needed.

```bash
# Option 1: Direct open
open index.html

# Option 2: Local server (recommended for full experience)
npx serve .
# or
python3 -m http.server 8080
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your portal will be live at `https://yourusername.github.io/repo-name`

## Tech Stack

| Tool | Purpose |
|------|---------|
| HTML5 | Semantic structure |
| CSS3 (custom properties) | Theming, layout, animations |
| Vanilla JavaScript (ES6+) | Routing, data, interactions |
| [Lucide Icons](https://lucide.dev) | Icon system |
| Google Fonts | Fraunces + DM Sans typography |

---

*This is a concept redesign and is not affiliated with the official OUAC.*
