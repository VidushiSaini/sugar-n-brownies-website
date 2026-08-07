# Technical Testing Document (QA Guide)
**Project:** Sugar 'n Brownies Bakery Website
**Date:** August 2026

This guide provides a step-by-step checklist for verifying the technical integrity of the backend endpoints, JSON persistence, file uploads, and DOM manipulation logic.

## 1. Backend API Endpoints (server.js)
- **POST `/api/save-menu`**:
  - [ ] Submit a valid JSON payload with category and item modifications.
  - [ ] Verify `menu_data.json` is correctly updated on disk without data corruption.
  - [ ] Attempt to submit malformed JSON and verify the server responds with a `400 Bad Request` or `500 Server Error` and does not crash.
- **DELETE `/api/delete-menu-item`**:
  - [ ] Send a `DELETE` request with `{ "categoryName": "Cakes", "itemIndex": 0 }`.
  - [ ] Verify a `200 OK` response and that the item is spliced from `menu_data.json`.
- **DELETE `/api/delete-category`**:
  - [ ] Send a `DELETE` request with `{ "categoryName": "Test Category" }`.
  - [ ] Verify a `200 OK` response and that the entire category block is removed from `menu_data.json`.

## 2. Image Upload Sanitization
- **POST `/api/upload-image`**:
  - [ ] Upload a file with spaces and special characters (e.g., `my beautiful banner (1).jpeg`).
  - [ ] Verify the backend sanitizes the filename to remove unsafe characters.
  - [ ] Verify a unique timestamp is appended to the filename to prevent caching collisions.
  - [ ] Check the `/Images/` directory to confirm the file was written successfully.

## 3. Immediate DOM Deletion Logic
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
