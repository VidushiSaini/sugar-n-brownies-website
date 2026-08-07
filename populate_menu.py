import json
import os

def populate_menu():
    if not os.path.exists('menu_data.json'):
        return
        
    with open('menu_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for category in data.get('categories', []):
        if category['name'] == 'Brownies':
            for i, item in enumerate(category.get('items', [])):
                if i == 0:
                    item['description'] = 'Rich, gooey chocolate brownies baked fresh daily.'
                    item['quantity'] = 'Pack of 4'
                    item['weight'] = '400g'
                    item['image'] = 'Images/cake7.jpeg'
                elif i == 1:
                    item['description'] = 'Loaded with premium chocolate chips.'
                    item['quantity'] = 'Pack of 4'
                    item['weight'] = '400g'
                    item['image'] = 'Images/cake8.jpeg'
                elif i == 2:
                    item['description'] = 'A perfect blend of coffee and chocolate.'
                    item['quantity'] = 'Pack of 4'
                    item['weight'] = '400g'
                    item['image'] = 'Images/cake9.jpeg'
                else:
                    item.setdefault('quantity', '')
                    item.setdefault('weight', '')
                    item.setdefault('description', '')
        else:
            for item in category.get('items', []):
                item.setdefault('quantity', '')
                item.setdefault('weight', '')
                item.setdefault('description', '')

    with open('menu_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Populated menu_data.json")

if __name__ == '__main__':
    populate_menu()
