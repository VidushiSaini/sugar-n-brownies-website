import json
import os

def standardize_menu():
    if not os.path.exists('menu_data.json'):
        return
        
    with open('menu_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for category in data.get('categories', []):
        for item in category.get('items', []):
            # Extract the old name
            title = item.get('name') or item.get('title') or "Item"
            
            # Clear old keys and set exactly as requested
            item.clear()
            item['title'] = title
            item['price'] = "₹120"
            item['description'] = "Rich, gooey chocolate goodness baked fresh daily. Click to pre-order!"
            item['image'] = "./images/jar cake.jpeg"
            item['quantity'] = "Pack of 4"
            item['weight'] = "500g"
            item['dietary'] = {
                "vegan": False,
                "gluten_free": False,
                "contains_nuts": True
            }

    with open('menu_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Standardized menu_data.json")

if __name__ == '__main__':
    standardize_menu()
