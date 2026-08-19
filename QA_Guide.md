# Technical Testing Document (QA Guide)
**Project:** Pune Artisan Bakehouse Bakery Website
**Date:** August 2026

This guide provides a step-by-step checklist for verifying the technical integrity of the backend endpoints, JSON persistence, file uploads, and DOM manipulation logic.

## 1. Backend API Endpoints (Netlify Serverless Functions)
- **POST `/api/save-menu`**:
  - [ ] Submit a valid JSON payload with category and item modifications.
  - [ ] Verify `menu_data.json` is correctly updated on GitHub without data corruption.
  - [ ] Verify the Netlify CI/CD pipeline triggers successfully.
  - [ ] Attempt to submit malformed JSON and verify the serverless function responds with a `400 Bad Request` or `500 Server Error`.

## 2. CI/CD Build Latency & Caching
- **Cache Busting**:
  - [ ] Save an update in the admin dashboard and wait exactly 60 seconds.
  - [ ] Refresh the live site ONCE. Verify the changes are instantly visible due to `?t=timestamp` and `no-store` cache headers.
  - [ ] Verify that refreshing before the 60-second mark does not permanently cache the old version.

## 3. Live Alerts & Banner Logic
- **Mutual Exclusivity**:
  - [ ] In the Operations tab, check "Temporarily Closed". Verify "Traffic / Disruption" is unchecked and cleared.
  - [ ] Check "Traffic / Disruption". Verify "Temporarily Closed" is unchecked and cleared.
- **Fallbacks & Prefixes**:
  - [ ] Save "Temporarily Closed" with an empty text box. Verify the live site defaults to "We are temporarily closed."
  - [ ] Save "Traffic / Disruption" with a custom message. Verify the live site prepends "Traffic / Disruption Notice: " to the custom message.
  
## 4. Operating Hours Workaround
- **Closed Day Logic**:
  - [ ] Set Monday's Open and Close times to exactly the same value (e.g., `00:00` and `00:00`).
  - [ ] Save Operations. Wait for the CI/CD build.
  - [ ] Hover over the "Weekly Hours" dropdown on the live site. Verify Monday strictly reads "Closed" rather than "00:00 - 00:00".

## 5. Immediate DOM Deletion Logic
- **Item Deletion**:
  - [ ] Click the red trash icon on a menu item in the admin dashboard.
  - [ ] Cancel the `window.confirm()` prompt; verify no network request is sent and the DOM remains unchanged.
  - [ ] Click again and confirm; verify the network request is sent, succeeds, and the item card immediately disappears from the grid without requiring a manual page reload.
- **Category Deletion**:
  - [ ] Click the red 'Delete Category' pill.
  - [ ] Cancel the prompt; verify safety.
  - [ ] Confirm the prompt; verify the category pill and all its rendered item cards are removed from the DOM instantly.

## 4. Search and Filter Logic (`menu.js`)
- **Category Filtering**:
  - [ ] Click a category filter pill (e.g., "Brownies"); verify only items from that category render.
  - [ ] Click "All" to reset.
- **Text Search**:
  - [ ] Type "chocolate" into the search bar; verify items with "chocolate" in the title or description render.
- **Dietary Tag Search**:
  - [ ] Type "eggless" or "vegan"; verify that items checking the corresponding dietary boolean are returned, even if the text isn't in their description.
  - [ ] Type a custom tag string; verify it correctly matches.
- **Combined Filtering**:
  - [ ] Select the "Cakes" category AND type "vegan" in the search bar. Verify the intersection works correctly (only Vegan Cakes display).

## 5. Edge Cases
- [ ] Attempt to delete an item from an empty category.
- [ ] Upload an extremely large image file to verify server stability.
- [ ] Refresh the page while an upload or save is in progress.
- [ ] Attempt to save a menu item with an empty title or price.
