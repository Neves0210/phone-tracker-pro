# 📱 Phone Tracker PRO

<div align="center">

A **cyberpunk-inspired phone number intelligence web app** built with **HTML, CSS and Vanilla JavaScript**, featuring animated scan effects, region inference, carrier heuristics, local history, and interactive map visualization.

![License](https://img.shields.io/badge/license-MIT-00ff41?style=for-the-badge)
![Frontend](https://img.shields.io/badge/frontend-vanilla_js-111111?style=for-the-badge)
![Status](https://img.shields.io/badge/status-portfolio_project-00ff41?style=for-the-badge)
![Leaflet](https://img.shields.io/badge/map-leaflet-111111?style=for-the-badge)

</div>

---

## ⚠️ Disclaimer

This project **does not perform real phone tracking** or live geolocation.

It is a **frontend intelligence simulation tool** that uses:
- country calling codes
- DDD / area code inference
- carrier heuristics
- region + timezone mapping

It was built as a **UI/UX + frontend engineering portfolio project**.

---

## ✨ Overview

**Phone Tracker PRO** simulates a futuristic number lookup interface with a hacker / terminal aesthetic.

Users can:
- input a phone number
- infer its likely region
- identify country and possible carrier
- view the approximate location on a dark interactive map
- watch a cinematic scan animation
- save recent lookups locally
- export a shareable result card

---
---

## 🚀 Features

### 🎨 UI / UX
- Dark hacker-themed interface
- Neon green cyberpunk accent palette
- Glassmorphism cards
- JetBrains Mono font
- Matrix-style animated background
- Glitch text title animation
- Smooth hover and reveal transitions
- Fully responsive design

### 🔎 Number Intelligence
- Country code parsing
- Phone number auto-formatting
- Length validation by country
- Region detection by DDD / area code
- Carrier heuristic inference
- Number type detection:
  - Mobile
  - Landline
  - VoIP
  - Toll-free

### 🌍 Map Visualization
- Interactive map powered by **Leaflet.js**
- **CartoDB Dark Matter** tiles
- Pulsing marker
- Animated scan radius circle
- Automatic recentering

### 🛰️ Scan Simulation
- Full-screen cinematic scanning overlay
- Animated radar sweep
- Fake terminal output
- Progress bar with scan stages:
  - `SCANNING...`
  - `LOCATING...`
  - `TRIANGULATING...`
  - `TARGET FOUND`

### 🧠 Extra Features
- Search history with `localStorage`
- Copy coordinates to clipboard
- Share / export result as image
- Web Audio API generated sound effects
- Easter egg support

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **Vanilla JavaScript**
- **Leaflet.js**
- **OpenStreetMap / CartoDB Dark Tiles**
- **Web Audio API**
- **html2canvas** (lazy-loaded only when sharing)

No frameworks. No build tools. No backend.

---

## 📂 Project Structure

```bash
phone-tracker-pro/
│
├── index.html
├── README.md
├── LICENSE
├── .gitignore
│
├── css/
│   ├── styles.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── data.js
│   ├── parser.js
│   ├── map.js
│   ├── history.js
│   ├── audio.js
│   ├── scanner.js
│   └── share.js
│
└── assets/
    └── screenshots/
```

---

## ▶️ Running Locally

### Option 1 — Open directly
You can open `index.html` directly in your browser.

### Option 2 — Recommended
Use a local server for best compatibility, especially for:
- image export
- clipboard behavior
- browser security consistency

### VS Code + Live Server
1. Open the project in **VS Code**
2. Install the **Live Server** extension
3. Right-click `index.html`
4. Click **Open with Live Server**

---

## 📦 Supported Parsing Logic

### Country support
Includes:

- 🇧🇷 Brazil
- 🇺🇸 / 🇨🇦 USA / Canada
- 🇬🇧 United Kingdom
- 🇮🇳 India
- 🇪🇸 Spain
- 🇩🇪 Germany
- 🇫🇷 France
- 🇦🇺 Australia
- 🇯🇵 Japan
- 🇰🇷 South Korea
- 🇵🇹 Portugal
- 🇦🇷 Argentina
- 🇲🇽 Mexico
- 🇮🇹 Italy

### Region detection
Includes:
- **Extensive Brazilian DDD mapping**
- **Top U.S. area code mapping**
- Country-level fallback intelligence for other supported regions

### Carrier heuristics
Examples:
- Brazil:
  - Vivo
  - Claro
  - TIM
  - Oi
- Other countries:
  - generic / heuristic detection

---

## 🧪 Example Inputs

### Brazil
- `+55 11 98765-4321`
- `+55 21 99876-5432`
- `+55 31 3456-7890`

### USA
- `+1 2125550123`
- `+1 4155550199`
- `+1 3055550144`

### Easter Egg
- `000000000`

---

## ⚠️ Limitations

This app **does not**:
- locate real devices
- access GPS from the target phone
- perform telecom triangulation
- connect to mobile carriers
- track live SIMs
- retrieve real-time device movement

This is a **simulation + educational frontend project**.

---

## 💡 Possible Future Improvements

- More countries and prefixes
- Better carrier heuristics
- Confidence score / match score
- Risk level / signal strength panel
- Clear history button
- PWA support
- Better screenshot export
- GitHub Pages live deployment
- Consent-based real location sharing module

---

## 🌐 Deploy to GitHub Pages

This project can be deployed easily with **GitHub Pages**.

### Steps:
1. Push this repository to GitHub
2. Open the repository on GitHub
3. Go to **Settings**
4. Open **Pages**
5. Under **Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
6. Save

---

## 👨‍💻 Author

**Gabriel Neves**

You can customize this section with your real links:

```markdown
## 👨‍💻 Author

**Gabriel Neves**  
[GitHub](https://github.com/Neves0210) • [LinkedIn](https://www.linkedin.com/in/gabriel-neves-dev-ti/)
```

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](./LICENSE) file for details.