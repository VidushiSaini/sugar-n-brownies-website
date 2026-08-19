# Pune Artisan Bakehouse - Website User Manual

Welcome to your new Bakery Admin Dashboard! This guide will show you how to easily update your bakery's menu, change prices, and add new delicious items without touching any code.

## 1. How to Access Your Dashboard

1. Go to your live website address and add `/admin.html` to the end of the URL (e.g., `https://sugar-n-brownies.com/admin.html`).
2. You will be greeted by a secure PIN lock screen.
3. Enter your secret 4-digit PIN to unlock the dashboard.

## 2. Navigating the Dashboard

Once you are in the dashboard, you will see a simple interface with tabs at the top:
- **Menu Editor:** Manage your products, prices, dietary tags, and images.
- **Gallery Manager:** Add or remove photos from your homepage showcase.
- **Page Content:** Update your logo, homepage banners, and "About Us" text.
- **Operations:** Manage your store hours, contact info, and live site alerts.

## 3. How to Edit the Menu

> **IMPORTANT TIP FOR IMAGES**: Ensure your photos are cropped to a nice square or rectangle before uploading so they look perfectly proportioned on the website!

- **Changing Details:** Inside the Menu Editor, simply click into any text box (Title, Price, Details) on a product card and type your changes.
- **Adding Items/Categories:** Use the **"+ Add Item"** and **"+ New Category"** buttons at the top of the grid.
- **Dietary Tags:** Check the boxes for Vegan, Gluten-Free, Eggless, etc., or add your own custom tag.

## 4. Business Operations & Live Alerts

The Operations tab lets you control exactly what your customers see regarding your availability.

- **Store Hours:** Update your opening and closing times.
  > **Marking a Day as Closed:** To mark the bakery as closed for a specific day, set both the Open and Close times to the exact same value (e.g., `00:00` to `00:00`). The frontend logic will automatically detect this zero-minute window and display "Closed" for that day.
- **Live Alerts:** Toggle the "Temporarily Closed" or "Traffic / Disruption Notice" banners.
  - These banners are mutually exclusive.
  - Leaving the custom text box blank is perfectly fine; the system will automatically inject a default fallback message.
  - The Traffic banner automatically prepends the text "Traffic / Disruption Notice: " to your message.

## 5. Saving Your Changes (Important!)

When you are finished making changes on any tab, click the **Save** or **Update** button.

> **CRITICAL REFRESH TIMING:** 
> After clicking "Save", you **MUST wait approximately 60 seconds** for the Netlify CI/CD pipeline to rebuild the site. Please wait a full minute before refreshing the live site to see your changes, rather than refreshing multiple times. The aggressive cache-busting headers guarantee that your changes will appear instantly on that single refresh!

---

*Enjoy managing your new website!*
