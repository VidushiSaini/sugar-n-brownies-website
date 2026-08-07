document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const phoneNumber = '919870198838'; // India code + number

    // Modal Elements
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    // Close Modal Function
    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };

    // Event Listeners for Closing
    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    const openModal = (item) => {
        // Build the inner HTML for the modal
        let html = '';

        // Header (Title & Price)
        html += `
            <div class="mb-4 pr-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-1">${item.title}</h2>
                <span class="text-xl font-bold text-brand-accent inline-block">${item.price}</span>
            </div>
        `;

        // Description
        const descText = item.description || item.details;
        if (descText) {
            html += `<p class="text-gray-700 mb-4 text-base leading-relaxed">${descText}</p>`;
        }

        // Specs (Quantity, Weight)
        if (item.quantity || item.weight) {
            html += `<div class="flex gap-4 text-sm text-gray-500 font-medium mb-4">`;
            if (item.quantity) {
                html += `<span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> ${item.quantity}</span>`;
            }
            if (item.weight) {
                html += `<span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg> ${item.weight}</span>`;
            }
            html += `</div>`;
        }

        // Dietary Tags
        let tagsHtml = '';
        const addTag = (text, bgColor, textColor) => {
            tagsHtml += `<span class="px-3 py-1 text-xs font-bold rounded-full ${bgColor} ${textColor}">${text}</span>`;
        };

        if (item.dietary) {
            if (item.dietary.contains_milk) addTag('Contains Milk', 'bg-blue-100', 'text-blue-700');
            if (item.dietary.contains_nuts) addTag('Contains Nuts', 'bg-orange-100', 'text-orange-700');
            if (item.dietary.vegan) addTag('Vegan', 'bg-green-100', 'text-green-700');
            if (item.dietary.gluten_free) addTag('Gluten-Free', 'bg-yellow-100', 'text-yellow-700');
            if (item.dietary.sugar_free) addTag('Sugar-Free', 'bg-teal-100', 'text-teal-700');
            if (item.dietary.eggless) addTag('Eggless', 'bg-purple-100', 'text-purple-700');
            if (item.dietary.custom_tag) addTag(item.dietary.custom_tag, 'bg-[#FAF3E0]', 'text-[#603809] border border-[#D4A373]');
        }

        if (tagsHtml) {
            html += `<div class="flex flex-wrap gap-2 mb-6">${tagsHtml}</div>`;
        }

        // Image
        if (item.image) {
            const imgSrc = item.image.startsWith('/') ? item.image.substring(1) : item.image;
            html += `<img src="${imgSrc}" alt="${item.title}" class="w-full h-64 object-cover object-center rounded-xl mb-6 shadow-sm bg-gray-50">`;
        }

        // WhatsApp Button
        const message = encodeURIComponent(`Hi, I would like to pre-order: ${item.title} (${item.price}).`);
        const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        html += `
            <a href="${waUrl}" target="_blank" class="block w-full text-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-lg">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.39 0 0 5.39 0 12.031c0 2.115.549 4.17 1.594 5.996L.142 23.473l5.586-1.464a12.016 12.016 0 006.303 1.776h.005c6.638 0 12.029-5.391 12.029-12.032C24.065 5.391 18.673 0 12.031 0zM12.031 21.758c-1.785 0-3.535-.48-5.074-1.39l-.364-.216-3.771.989.999-3.676-.237-.377A10.02 10.02 0 012.01 12.031c0-5.526 4.498-10.023 10.021-10.023 5.525 0 10.022 4.498 10.022 10.023 0 5.526-4.497 10.024-10.022 10.024zm5.503-7.518c-.302-.151-1.784-.881-2.062-.981-.277-.101-.48-.151-.681.151-.202.302-.782.981-.958 1.182-.177.202-.354.227-.655.076-1.461-.735-2.527-1.411-3.486-2.923-.254-.397.251-.368.835-1.543.076-.151.038-.277-.038-.428-.076-.151-.681-1.637-.933-2.242-.246-.591-.497-.512-.681-.522-.177-.01-.38-.01-.581-.01-.202 0-.53.076-.807.378-.277.302-1.059 1.034-1.059 2.521 0 1.487 1.084 2.923 1.236 3.124.151.202 2.128 3.25 5.155 4.556 2.016.868 2.822.933 3.905.782 1.236-.177 3.771-1.538 4.301-3.025.53-1.487.53-2.773.378-3.025-.151-.252-.555-.403-.857-.554z"/></svg>
                Pre-order via WhatsApp
            </a>
        `;

        modalBody.innerHTML = html;
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    };

    let globalMenuData = null;
    let activeCategory = 'All';
    const searchInput = document.getElementById('menu-search');
    const categoryFiltersContainer = document.getElementById('category-filters');

    const renderMenu = () => {
        if (!globalMenuData) return;
        
        menuContainer.innerHTML = '';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        globalMenuData.categories.forEach(category => {
            // Category Filter
            if (activeCategory !== 'All' && category.name !== activeCategory) return;

            // Search filter
            const filteredItems = category.items.filter(item => {
                if (!searchTerm) return true;
                
                const titleMatch = item.title.toLowerCase().includes(searchTerm);
                const descMatch = (item.description || item.details || '').toLowerCase().includes(searchTerm);
                
                let tagsMatch = false;
                if (item.dietary) {
                    const dietaryValues = [];
                    if (item.dietary.contains_milk) dietaryValues.push('milk', 'contains milk');
                    if (item.dietary.contains_nuts) dietaryValues.push('nuts', 'contains nuts');
                    if (item.dietary.vegan) dietaryValues.push('vegan');
                    if (item.dietary.gluten_free) dietaryValues.push('gluten-free', 'gf');
                    if (item.dietary.sugar_free) dietaryValues.push('sugar-free');
                    if (item.dietary.eggless) dietaryValues.push('eggless');
                    if (item.dietary.custom_tag) dietaryValues.push(item.dietary.custom_tag.toLowerCase());
                    
                    tagsMatch = dietaryValues.some(tag => tag.includes(searchTerm));
                }
                
                return titleMatch || descMatch || tagsMatch;
            });

            if (filteredItems.length === 0) return;

            const section = document.createElement('section');
            section.className = 'mb-12';

            const headerContainer = document.createElement('div');
            headerContainer.className = 'flex items-center gap-6 mb-8 mt-4';

            const title = document.createElement('h2');
            title.className = 'text-3xl font-heading font-bold text-brand-dark';
            title.textContent = category.name;
            
            const divider = document.createElement('div');
            divider.className = 'flex-grow h-px bg-brand-light';

            headerContainer.appendChild(title);
            headerContainer.appendChild(divider);
            section.appendChild(headerContainer);

            const grid = document.createElement('div');
            grid.className = 'menu-grid';

            filteredItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer group';
                
                let tagsHtml = '';
                if (item.dietary) {
                    const addTag = (text) => {
                        tagsHtml += `<span class="inline-block bg-[#FAF3E0] text-[#603809] text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-[#D4A373] mr-1 mt-2">${text}</span>`;
                    };
                    if (item.dietary.contains_milk) addTag('Milk');
                    if (item.dietary.contains_nuts) addTag('Nuts');
                    if (item.dietary.vegan) addTag('Vegan');
                    if (item.dietary.gluten_free) addTag('GF');
                    if (item.dietary.sugar_free) addTag('Sugar-Free');
                    if (item.dietary.eggless) addTag('Eggless');
                    if (item.dietary.custom_tag) addTag(item.dietary.custom_tag);
                }

                const imgSrc = item.image ? (item.image.startsWith('/') ? item.image.substring(1) : item.image) : '';
                
                card.innerHTML = `
                    <div class="w-full h-48 bg-[#F4F1EA] flex justify-center items-center relative border-b border-gray-100 overflow-hidden">
                        <img src="${imgSrc}" alt="${item.title}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.onerror=null; this.src='Images/Logo 3.jpg'; this.className='w-full h-full object-contain opacity-30 scale-75 group-hover:scale-90 transition-transform duration-500';">
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-between relative">
                        <div>
                            <div class="flex justify-between items-start gap-4 mb-1">
                                <h3 class="text-xl font-bold text-gray-800 group-hover:text-brand-accent transition-colors leading-tight">${item.title}</h3>
                                <span class="font-bold text-brand-dark text-xl whitespace-nowrap">${item.price}</span>
                            </div>
                            <div class="flex flex-wrap">${tagsHtml}</div>
                        </div>
                        <div class="mt-4 text-brand opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-widest text-right flex justify-end items-center gap-1">
                            View Details <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => {
                    openModal(item);
                });

                grid.appendChild(card);
            });

            section.appendChild(grid);
            menuContainer.appendChild(section);
        });

        if (menuContainer.innerHTML === '') {
            menuContainer.innerHTML = `
                <div class="bg-brand-light text-brand-dark p-8 rounded-xl text-center shadow-inner">
                    <p class="font-bold text-xl mb-2">No items found</p>
                    <p class="text-gray-600">Try adjusting your search or category filter.</p>
                </div>
            `;
        }
    };

    const renderCategoryFilters = () => {
        if (!globalMenuData || !categoryFiltersContainer) return;
        categoryFiltersContainer.innerHTML = '';

        const categories = ['All', ...globalMenuData.categories.map(c => c.name)];
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat;
            btn.className = `px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors border ${activeCategory === cat ? 'bg-brand text-white border-brand shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`;
            btn.addEventListener('click', () => {
                activeCategory = cat;
                renderCategoryFilters();
                renderMenu();
            });
            categoryFiltersContainer.appendChild(btn);
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderMenu();
        });
    }

    // Load Menu Data
    fetch(`/menu_data.json?t=${Date.now()}`, { cache: 'no-store' })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            globalMenuData = data;
            renderCategoryFilters();
            renderMenu();
        })
        .catch(error => {
            console.error('Error fetching menu data:', error);
            menuContainer.innerHTML = `
                <div class="bg-red-50 text-red-600 p-6 rounded-lg text-center">
                    <p class="font-bold text-lg mb-2">Oops!</p>
                    <p>We couldn't load the menu right now. Please try again later or call us to place an order.</p>
                </div>
            `;
        });
});
