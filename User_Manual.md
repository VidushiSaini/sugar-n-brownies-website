# Sugar 'n Brownies - Website User Manual

Welcome to your new website dashboard! This guide will show you how to easily update your bakery's menu, change prices, and add new delicious items without touching any code.

## 1. How to Access Your Dashboard

To update your menu, you need to log into your Content Management System (CMS) dashboard.

1. First, make sure your website is running locally (this is for local testing). 
   - Open your terminal or command prompt in the `Bakery_Website` folder.
   - Run the command: `npx decap-server`
   - Open a *new* terminal window in the same folder and run: `npx serve` or `python -m http.server 8000`
2. Open your web browser and go to your website address, followed by `/admin`. 
   - For example: `http://localhost:3000/admin` (or whichever port the server is running on).
3. You will see the **Content Manager** screen. Because we are testing locally, it will let you right in without a password.

## 2. Navigating the Dashboard

Once you are in the dashboard, you will see a simple interface.
- On the left side, under **Collections**, you will see **Menu Data**.
- Click on **Menu Data**. 
- You will see a single entry called **Menu Categories and Items**. Click on it to edit your menu.

## 3. How to Edit the Menu

> **IMPORTANT TIP FOR IMAGES**: The CMS does not crop images for you. Before uploading a photo for a new menu item or gallery cake, please ensure it is already cropped to a nice square or rectangle on your phone or computer so it looks perfectly proportioned on the website!

The menu is organized into **Categories** (like "Brownies", "Premium Cakes") and the **Items** inside them.

### Changing a Price or Details
1. Scroll down to find the Category containing the item you want to change.
2. Inside that Category, scroll to find the specific Item.
3. Click into the **Price** box and type the new price.
4. (Optional) You can also edit the **Description/Details** box to add things like "Available from pack of 4".

### Adding a New Item to an Existing Category
1. Find the Category where you want to add the item (e.g., "Cupcakes").
2. At the bottom of the items list in that category, click the **Add Items** button.
3. A new blank item will appear. Fill in the **Name**, **Price**, and **Description/Details**.

### Adding a Brand New Category
1. Scroll all the way to the very bottom of the entire Categories list.
2. Click the **Add Categories** button.
3. Type the **Category Name** (e.g., "Seasonal Specials").
4. Underneath your new category name, click **Add Items** to start adding pastries to it.

## 4. Saving Your Changes

When you are finished making changes:
1. Look at the top right corner of the screen.
2. Click the **Publish** button.
3. In the dropdown menu that appears, click **Publish now**.
4. Wait a few seconds for the green success message.

## 5. Seeing Your Changes Live

1. Go back to your actual website's Menu page (e.g., `http://localhost:3000/menu.html`).
2. Refresh the page in your browser.
3. You will instantly see your newly added items and price changes!

---

*Enjoy managing your new website!*
