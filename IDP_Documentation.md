# Internal Developer Portal (IDP) Documentation
**Project:** Sugar 'n Brownies Bakery Website
**Tech Stack:** Vanilla HTML/JS, Tailwind CSS, Node.js (Zero-dependency backend)

This document outlines the final project architecture and summarizes the key data pipelines and features implemented in the latest release to assist future maintainers.

## Architecture Overview
The application follows a lightweight, serverless architecture deployed on Netlify. The frontend is fully static HTML/JS/CSS. Data persistence is handled via Netlify Serverless Functions interacting directly with the GitHub Contents API, committing changes back to the repository's local JSON files.

### Core Files
- **Backend (Serverless):** `/netlify/functions/*.js` (Handles API routes, security, and GitHub API commits).
- **Data Stores:** `menu_data.json`, `business_settings.json`, `content_data.json`, `gallery_data.json`.
- **Frontend (Public):** `index.html`, `menu.html`, `about.html`, `gallery.html`, `menu.js`, `banner.js`.
- **Frontend (Admin):** `admin.html`, `custom_admin.js`.

## Key Features & Pipelines

### 1. Serverless GitHub Persistence & CI/CD
To avoid external database costs, the CMS runs natively off the GitHub repository.
- **Commit Flow:** The admin dashboard sends payloads to Netlify Functions (e.g., `save-operations.js`), which authenticate via a `GITHUB_TOKEN` and PUT changes directly to the target `.json` file in the repo.
- **Build Latency:** Because every data save triggers a Git commit, Netlify must re-run the CI/CD build pipeline. There is an approximate **60-second latency** between clicking "Save" and the changes reflecting on the live site. SREs and Admins must wait one full minute before refreshing the site. Aggressive `Cache-Control: no-store` headers on `fetch` calls guarantee instant visibility post-build.

### 2. Live Status & Alert Banner Logic
The `banner.js` script handles dynamic injection of global alerts (stored in `business_settings.json`).
- **Mutual Exclusivity:** The "Temporarily Closed" and "Traffic / Disruption" banners are mutually exclusive. Selecting one instantly deselects and clears the other in `custom_admin.js`.
- **Fallbacks & Prefixes:** Empty string payloads are gracefully handled. If 'Closed' is true but blank, it falls back to `"We are temporarily closed."`. If 'Traffic' is true, it always prepends `"Traffic / Disruption Notice: "` to the text (or uses a default).

### 3. Operating Hours Workaround ("Closed" Days)
The frontend (`banner.js`) dynamically detects closed days without requiring a dedicated boolean field per day.
- **Logic:** If an admin sets a specific day's `open` and `close` time to the exact same string (e.g., `00:00` and `00:00`), the frontend strictly evaluates `h.open === h.close` and overrides the UI string to read `"Closed"` instead of a time range.

### 4. Frontend Search & Filter Logic (`menu.js`)
The public menu features a robust client-side filtering engine.
- **Global State:** Menu data is fetched once and stored in a `globalMenuData` variable.
- **Category Pills:** Buttons are generated dynamically based on the available categories in the JSON. Clicking one sets the `activeCategory` state.
- **Search Engine:** An event listener on the search input triggers `renderMenu()` on every keystroke.
- **Dietary Tag Intersection:** The `.filter()` logic evaluates a boolean OR across the item's title, description, and an array of active dietary tags. 

## Maintenance Notes
- **Tailwind:** Utility classes must be injected directly into DOM template literals. Avoid `<style>` blocks in JS as they suffer from specificity conflicts.
- **Cache Busting:** All frontend `fetch()` calls for JSON data must strictly include `?t=${Date.now()}` and `{ cache: 'no-store' }` to bypass Netlify edge caching. Node 18 `fetch` on the backend must also bypass cache for GitHub GET requests.
- **JSON Safety:** Always use `JSON.parse` and `JSON.stringify(data, null, 2)` when modifying the backend database to prevent corruption.
