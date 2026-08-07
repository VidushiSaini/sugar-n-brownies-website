import json
import os

def update_menu():
    if not os.path.exists('menu_data.json'):
        print("menu_data.json not found")
        return
        
    with open('menu_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for category in data.get('categories', []):
        for item in category.get('items', []):
            item.setdefault('image', '')
            item.setdefault('contains_milk', False)
            item.setdefault('contains_nuts', False)
            item.setdefault('vegan', False)
            item.setdefault('gluten_free', False)
            item.setdefault('sugar_free', False)

    with open('menu_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Updated menu_data.json")

def create_offers_gallery():
    offers = {"offers_list": []}
    gallery = {"gallery_list": []}

    with open('offers_data.json', 'w', encoding='utf-8') as f:
        json.dump(offers, f, indent=2)
    with open('gallery_data.json', 'w', encoding='utf-8') as f:
        json.dump(gallery, f, indent=2)
    print("Created offers_data.json and gallery_data.json")

if __name__ == '__main__':
    update_menu()
    create_offers_gallery()
