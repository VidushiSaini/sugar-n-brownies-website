# Internal Developer Portal (IDP) Documentation
**Project:** Sugar 'n Brownies Bakery Website
**Tech Stack:** Vanilla HTML/JS, Tailwind CSS, Node.js (Zero-dependency backend)

This document outlines the final project architecture and summarizes the key data pipelines and features implemented in the latest release to assist future maintainers.

## Architecture Overview
The application follows a lightweight, server-rendered configuration approach. The frontend is fully static HTML/JS/CSS served by a custom Node.js server (`server.js`). Data persistence is handled via local JSON files, acting as a flat-file database.

### Core Files
- **Backend:** `server.js` (Handles API routes, multipart form parsing, and static file serving).
- **Data Stores:** `menu_data.json`, `business_settings.json`, `content_data.json`, `gallery_data.json`.
- **Frontend (Public):** `index.html`, `menu.html`, `about.html`, `gallery.html`, `menu.js`, `banner.js`.
- **Frontend (Admin):** `admin.html`, `custom_admin.js`.

## Key Features & Pipelines

### 1. Dynamic Banner Pipeline
Banners are uploaded via the Admin Dashboard and dynamically injected into the public UI.
- **Upload Flow:** The frontend sends a `FormData` object containing the image to `POST /api/upload-image`.
- **Sanitization:** `server.js` parses the raw multipart boundary, extracts the file, and sanitizes the filename by replacing spaces/special characters with underscores and appending `Date.now()` to prevent directory traversal and caching issues.
- **Storage:** The file is saved to the `/Images/` directory, and its path is saved to `business_settings.json`.
- **Injection (`banner.js`):** A lightweight script fetches `business_settings.json` on page load and dynamically updates the `src` or `style.backgroundImage` of the hero elements on `index.html` and `menu.html`.

### 2. Isolated DELETE Endpoints
To resolve earlier race conditions with the monolithic "Update Item" POST route, deletion logic has been strictly isolated.
- **Endpoints:** `DELETE /api/delete-menu-item` and `DELETE /api/delete-category`.
- **Logic:** The frontend sends a targeted payload (e.g., `{ categoryName, itemIndex }`). The backend reads the JSON, uses `Array.prototype.splice()` to cleanly remove the target, and writes the file back.
- **UI Reactivity:** The frontend (`custom_admin.js`) awaits a `200 OK` response before splicing its local `menuData` array and immediately calling `renderMenuEditor()`. This bypasses the heavy POST route entirely.

### 3. Frontend Search & Filter Logic (`menu.js`)
The public menu features a robust client-side filtering engine.
- **Global State:** Menu data is fetched once and stored in a `globalMenuData` variable.
- **Category Pills:** Buttons are generated dynamically based on the available categories in the JSON. Clicking one sets the `activeCategory` state.
- **Search Engine:** An event listener on the search input triggers `renderMenu()` on every keystroke.
- **Dietary Tag Intersection:** The `.filter()` logic evaluates a boolean OR across the item's title, description, and an array of active dietary tags. 
- *Implementation Note:* Checkbox booleans (e.g., `contains_milk`, `eggless`) are translated into string arrays (e.g., `['milk']`, `['eggless']`) during the filter loop so they can be matched against the user's raw text string using `.includes()`.

## Maintenance Notes
- **Tailwind:** Utility classes must be injected directly into DOM template literals. Avoid `<style>` blocks in JS as they suffer from specificity conflicts.
- **Cache Busting:** If modifying image paths manually, ensure query strings (e.g., `?t=12345`) are used on the frontend to bypass aggressive browser caching.
- **JSON Safety:** Always use `JSON.parse` and `JSON.stringify(data, null, 2)` when modifying the backend database to prevent corruption.
