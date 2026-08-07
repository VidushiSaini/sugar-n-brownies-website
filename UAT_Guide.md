# User Acceptance Testing (UAT) Guide
**Target Audience:** Tanvi (Bakery Owner) / Client

Welcome to the testing guide for your new Bakery Website! This document will walk you through the core business features to ensure everything works exactly as you expect before you launch.

## 1. Updating Website Banners
**Goal:** Verify you can easily change the large hero images on your website.
- Go to the **Admin Dashboard** (`admin.html`) and open the **Page Content** tab.
- Scroll down to the **Website Banners** section.
- Upload a new image for the **Homepage Hero Banner** and click **Update Content**.
- Open the **Home Page** (`index.html`) in a new tab and verify the new image appears at the top.
- Repeat the process for the **Menu Page Banner** and check `menu.html`.

## 2. Managing the Menu (Adding & Editing)
**Goal:** Ensure you can easily add new treats or update prices.
- Go to the **Menu Editor** tab in the Admin Dashboard.
- **Edit an Item:** Change the price of an existing brownie, check the "Eggless" box, and type "Bestseller" into the Custom Tag field. Click the **Update Item** button.
- **Add an Item:** Click "+ Add Item" under any category. Fill out a name, price, and upload an image. Click **Update Item**.
- Open the **Menu Page** (`menu.html`) and verify your new item and the price/tag changes are visible.

## 3. Deleting Items Safely
**Goal:** Ensure you can permanently remove discontinued items.
- In the **Menu Editor**, locate a test item and click the **Red Trash Icon**.
- A warning popup will ask if you are sure. Click **OK**.
- Verify the item instantly disappears from the admin screen.
- Refresh your public Menu Page to confirm it is gone for customers.

## 4. Testing the Public Search & Filter
**Goal:** Ensure customers can easily find what they want to order.
- Open the **Menu Page** (`menu.html`).
- Click the **"Cakes"** filter pill. Verify only cakes are shown.
- In the search bar, type a keyword like **"Vegan"** or **"Eggless"**.
- Verify that the menu instantly filters down to show only the items that have those specific dietary tags or words in their description.

> **CRITICAL REFRESH TIMING:** 
> Before testing any changes you save, you **MUST wait 60 seconds** for the site to rebuild on Netlify. After a full minute, refresh the live page exactly once.

## 5. Business Operations
**Goal:** Ensure you can update your opening hours, alerts, and contact info.
- In the **Admin Dashboard**, go to the **Operations** tab.
- **Testing Closed Days:** Change Sunday's opening time to `00:00` and its closing time to `00:00`. Save, wait 60 seconds, and verify the Weekly Hours tooltip on the live site reads "Closed" for Sunday.
- **Testing Banners:** Check "Temporarily Closed" but leave the message empty. Save, wait 60 seconds, and verify the live site shows a red banner saying "We are temporarily closed."
- **Testing Mutual Exclusivity:** Go back to the Admin Dashboard. Check "Traffic / Disruption Notice". Notice that "Temporarily Closed" automatically unchecks. Type "Heavy traffic on Baner road" in the box. Save, wait 60 seconds, and verify the live site now shows a yellow banner starting with "Traffic / Disruption Notice: Heavy traffic...".
