# Pune Artisan Bakehouse 🍰

A custom, high-performance web application and digital storefront built for a local home bakery in Pune. 

## Features
* **Interactive Menu & Catalog:** Organized categories for brownies, specialty cakes, cupcakes, and desserts.
* **Direct WhatsApp Pre-ordering:** Customers can instantly generate pre-formatted order details for custom items directly to WhatsApp.
* **Smart Filtering:** Instant search bar and dietary tags (like dairy-free options).
* **Admin Management:** Secure backend structure to manage items, pricing, and business settings seamlessly.
* **Zomato Integration:** Quick redirection links for instant delivery orders.

## Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Tailwind CSS
* **Backend:** Netlify Serverless Functions (Node.js 18+)
* **Data Storage:** GitHub Contents API (JSON-based persistence)

## Admin Features & Important Notes
* **Zero-Cost CMS:** The custom `admin.html` dashboard natively updates the repository's JSON files via Netlify Functions, eliminating the need for paid databases.
* **CI/CD Build Latency:** Any time a user clicks "Save" in the admin panel, Netlify rebuilds the site. **Users must wait ~60 seconds before refreshing the live site** to see their changes. We enforce instant visibility post-build using cache-busting `fetch()` headers.
* **Global Alert Banners:** The admin can toggle "Temporarily Closed" or "Traffic / Disruption" banners. These are mutually exclusive. Leaving the text empty will gracefully inject fallback strings, and the traffic notice auto-prepends "Traffic / Disruption Notice: ".
* **Operating Hours / Closed Days:** The frontend dynamically handles "Closed" days. If the admin sets both the Open and Close time for a specific day to the exact same value (e.g., `00:00`), the site will read "Closed" for that day.
