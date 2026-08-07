import json
import re

def parse_menu():
    with open('sample_menu.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    categories = []
    current_category = None

    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        if line.startswith('###'):
            cat_name = line.replace('###', '').strip()
            current_category = {'name': cat_name, 'items': []}
            categories.append(current_category)
        elif line.startswith('*'):
            item_text = line.replace('*', '').strip()
            parts = item_text.split('-', 1)
            if len(parts) > 1:
                name = parts[0].strip()
                rest = parts[1].strip()
                rest_parts = rest.split('-', 1)
                if len(rest_parts) > 1:
                    price = rest_parts[0].strip()
                    details = rest_parts[1].strip()
                else:
                    price = rest_parts[0].strip()
                    details = ""
                
                if current_category is not None:
                    current_category['items'].append({
                        'name': name,
                        'price': price,
                        'details': details
                    })

    data = {'categories': categories}
    with open('menu_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    parse_menu()
    print("Successfully created menu_data.json")
