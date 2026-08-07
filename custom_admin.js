document.addEventListener('DOMContentLoaded', () => {
    // PIN Logic
    const pinInputs = [
        document.getElementById('pin1'),
        document.getElementById('pin2'),
        document.getElementById('pin3'),
        document.getElementById('pin4')
    ];
    const unlockBtn = document.getElementById('unlock-btn');
    const pinError = document.getElementById('pin-error');
    const pinScreen = document.getElementById('pin-screen');
    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logout-btn');

    // Auto-advance PIN inputs
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < 3) {
                pinInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                pinInputs[index - 1].focus();
            }
            if (e.key === 'Enter' && index === 3) {
                unlockBtn.click();
            }
        });
    });

    const unlock = async () => {
        const enteredPin = pinInputs.map(i => i.value).join('');
        const btnSpinner = unlockBtn.querySelector('.spinner');
        btnSpinner.classList.remove('hidden');
        unlockBtn.disabled = true;

        try {
            const res = await fetch('/api/verify-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: enteredPin })
            });
            const data = await res.json();

            if (data.success) {
                pinScreen.style.opacity = '0';
                setTimeout(() => {
                    pinScreen.classList.add('hidden');
                    dashboard.classList.remove('hidden');
                    loadData();
                }, 500);
            } else {
                pinError.classList.remove('hidden');
                pinInputs.forEach(i => i.value = '');
                pinInputs[0].focus();
            }
        } catch (e) {
            alert('Server error verifying PIN. Is server.js running?');
        } finally {
            btnSpinner.classList.add('hidden');
            unlockBtn.disabled = false;
        }
    };

    unlockBtn.addEventListener('click', unlock);
    logoutBtn.addEventListener('click', () => {
        dashboard.classList.add('hidden');
        pinScreen.classList.remove('hidden');
        pinScreen.style.opacity = '1';
        pinInputs.forEach(i => i.value = '');
        pinError.classList.add('hidden');
        pinInputs[0].focus();
    });

    // Navigation
    const navs = [
        { btn: document.getElementById('nav-menu'), sec: document.getElementById('section-menu') },
        { btn: document.getElementById('nav-gallery'), sec: document.getElementById('section-gallery') },
        { btn: document.getElementById('nav-content'), sec: document.getElementById('section-content') },
        { btn: document.getElementById('nav-ops'), sec: document.getElementById('section-ops') }
    ];

    navs.forEach(nav => {
        nav.btn.addEventListener('click', () => {
            navs.forEach(n => {
                n.sec.classList.add('hidden');
                n.btn.classList.remove('text-brand-accent', 'border-b-2', 'border-brand-accent');
                n.btn.classList.add('text-gray-500', 'hover:text-brand-dark');
            });
            nav.sec.classList.remove('hidden');
            nav.btn.classList.add('text-brand-accent', 'border-b-2', 'border-brand-accent');
            nav.btn.classList.remove('text-gray-500', 'hover:text-brand-dark');
        });
    });

    // Notification
    const showNotification = (msg, isError = false) => {
        const notif = document.getElementById('notification');
        document.getElementById('notification-text').textContent = msg;
        notif.className = `fixed top-24 right-8 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 font-bold flex items-center gap-2 ${isError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`;
        
        notif.classList.remove('translate-x-[150%]');
        setTimeout(() => {
            notif.classList.add('translate-x-[150%]');
        }, 3000);
    };

    // Upload Helper
    const uploadImage = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const base64 = reader.result;
                    const res = await fetch('/api/upload-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename: file.name, base64: base64 })
                    });
                    const data = await res.json();
                    if (data.success) {
                        resolve(data.filePath);
                    } else {
                        reject(new Error(data.error || 'Upload failed'));
                    }
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    // Data Management
    let menuData = null;
    let galleryData = null;
    let settingsData = null;
    let contentData = null;

    let currentCategoryFilter = 'All';
    const searchInput = document.getElementById('menu-search');
    
    searchInput.addEventListener('input', () => {
        renderMenuEditor();
    });

    const loadData = async () => {
        try {
            const mRes = await fetch('menu_data.json?t=' + new Date().getTime());
            menuData = await mRes.json();
            renderMenuFilters();
            renderMenuEditor();

            const gRes = await fetch('gallery_data.json?t=' + new Date().getTime());
            galleryData = await gRes.json();
            renderGalleryEditor();

            const sRes = await fetch('business_settings.json?t=' + new Date().getTime());
            if (sRes.ok) {
                settingsData = await sRes.json();
            } else {
                settingsData = { logo: "Images/Logo 4.jpg", phone: "", website: "", address: "", closed: false, closed_msg: "", alert: false, alert_msg: "", hours: {} };
            }
            renderSettingsEditor();

            const cRes = await fetch('content_data.json?t=' + new Date().getTime());
            if (cRes.ok) {
                contentData = await cRes.json();
                renderContentEditor();
            }

        } catch (e) {
            console.error('Failed to load data', e);
            showNotification('Could not load data. Ensure server is running.', true);
        }
    };

    const renderMenuFilters = () => {
        const filterContainer = document.getElementById('category-filters');
        filterContainer.innerHTML = '';
        
        const categories = ['All', ...menuData.categories.map(c => c.name)];
        categories.forEach(cat => {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'inline-flex items-center group relative';

            const btn = document.createElement('button');
            btn.className = `px-4 py-2 rounded-full text-sm font-bold transition-colors ${currentCategoryFilter === cat ? 'bg-brand text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                currentCategoryFilter = cat;
                renderMenuFilters();
                renderMenuEditor();
            });
            btnContainer.appendChild(btn);

            if (cat !== 'All' && currentCategoryFilter === cat) {
                const delBtn = document.createElement('button');
                delBtn.className = 'absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity';
                delBtn.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
                delBtn.title = `Delete ${cat} Category`;
                delBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete the "${cat}" category? WARNING: This will also permanently delete all menu items inside this category.`)) {
                        try {
                            const res = await fetch('/api/delete-category', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ categoryName: cat })
                            });
                            if (res.ok) {
                                menuData.categories = menuData.categories.filter(c => c.name !== cat);
                                currentCategoryFilter = 'All';
                                showNotification(`Category "${cat}" deleted successfully.`);
                                renderMenuFilters();
                                renderMenuEditor();
                            } else {
                                const err = await res.json();
                                showNotification('Failed to delete category: ' + (err.error || 'Unknown error'), true);
                            }
                        } catch (err) {
                            showNotification('Error deleting category: ' + err.message, true);
                        }
                    }
                });
                btnContainer.appendChild(delBtn);
            }

            filterContainer.appendChild(btnContainer);
        });
    };

    const renderMenuEditor = () => {
        const grid = document.getElementById('menu-editor-grid');
        grid.innerHTML = '';
        
        const searchTerm = searchInput.value.toLowerCase();

        menuData.categories.forEach((category, cIndex) => {
            if (currentCategoryFilter !== 'All' && category.name !== currentCategoryFilter) return;

            category.items.forEach((item, iIndex) => {
                if (searchTerm && !item.title.toLowerCase().includes(searchTerm) && !(item.description || '').toLowerCase().includes(searchTerm)) return;

                const card = document.createElement('div');
                card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6';

                const imgSrc = item.image.startsWith('/') ? item.image.substring(1) : item.image;
                
                card.innerHTML = `
                    <div class="w-full sm:w-1/3 flex flex-col gap-3">
                        <img id="m-img-preview-${cIndex}-${iIndex}" src="${imgSrc}" class="w-full h-40 object-cover rounded-lg border bg-gray-50">
                        <div>
                            <input type="file" id="m-img-file-${cIndex}-${iIndex}" class="hidden" accept="image/*">
                            <button id="m-img-btn-${cIndex}-${iIndex}" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm text-sm transition-colors">
                                Change Image
                            </button>
                            <input type="hidden" id="m-img-${cIndex}-${iIndex}" value="${item.image}">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                            <select id="m-cat-${cIndex}-${iIndex}" class="w-full text-sm border-gray-300 rounded shadow-sm p-2 bg-white">
                                ${menuData.categories.map(c => `<option value="${c.name}" ${c.name === category.name ? 'selected' : ''}>${c.name}</option>`).join('')}
                                <option value="__NEW__">+ Add New Category...</option>
                            </select>
                            <input type="text" id="m-new-cat-${cIndex}-${iIndex}" placeholder="New Category Name" class="hidden w-full text-sm border-gray-300 rounded shadow-sm p-2 mt-2">
                        </div>
                    </div>
                    <div class="w-full sm:w-2/3 flex flex-col gap-3">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                            <input type="text" id="m-title-${cIndex}-${iIndex}" value="${item.title}" class="w-full border-gray-300 rounded shadow-sm p-2 font-bold text-gray-800">
                        </div>
                        
                        <div class="flex flex-wrap sm:flex-nowrap gap-3">
                            <div class="flex-1 min-w-[100px]">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                                <input type="text" id="m-price-${cIndex}-${iIndex}" value="${item.price}" class="w-full border-gray-300 rounded shadow-sm p-2 font-bold text-brand-accent">
                            </div>
                            <div class="flex-1 min-w-[100px]">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                                <input type="text" id="m-qty-${cIndex}-${iIndex}" value="${item.quantity || ''}" class="w-full text-sm border-gray-300 rounded shadow-sm p-2">
                            </div>
                            <div class="flex-1 min-w-[100px]">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Weight</label>
                                <input type="text" id="m-wt-${cIndex}-${iIndex}" value="${item.weight || ''}" class="w-full text-sm border-gray-300 rounded shadow-sm p-2">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea id="m-desc-${cIndex}-${iIndex}" rows="2" class="w-full border-gray-300 rounded shadow-sm p-2 text-sm">${item.description || ''}</textarea>
                        </div>
                        
                        <div class="mt-1">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Dietary Tags</label>
                            <div class="flex flex-wrap gap-2">
                                <label class="flex items-center text-xs cursor-pointer"><input type="checkbox" id="m-milk-${cIndex}-${iIndex}" ${item.dietary?.contains_milk ? 'checked' : ''} class="diet-checkbox hidden"><span class="px-2 py-1 border rounded-full text-blue-700 bg-white border-blue-200 transition-colors">Contains Milk</span></label>
                                <label class="flex items-center text-xs cursor-pointer"><input type="checkbox" id="m-nuts-${cIndex}-${iIndex}" ${item.dietary?.contains_nuts ? 'checked' : ''} class="diet-checkbox hidden"><span class="px-2 py-1 border rounded-full text-orange-700 bg-white border-orange-200 transition-colors">Contains Nuts</span></label>
                                <label class="flex items-center text-xs cursor-pointer"><input type="checkbox" id="m-veg-${cIndex}-${iIndex}" ${item.dietary?.vegan ? 'checked' : ''} class="diet-checkbox hidden"><span class="px-2 py-1 border rounded-full text-green-700 bg-white border-green-200 transition-colors">Vegan</span></label>
                                <label class="flex items-center text-xs cursor-pointer"><input type="checkbox" id="m-gf-${cIndex}-${iIndex}" ${item.dietary?.gluten_free ? 'checked' : ''} class="diet-checkbox hidden"><span class="px-2 py-1 border rounded-full text-yellow-700 bg-white border-yellow-300 transition-colors">Gluten-Free</span></label>
                                <label class="flex items-center text-xs cursor-pointer"><input type="checkbox" id="m-sf-${cIndex}-${iIndex}" ${item.dietary?.sugar_free ? 'checked' : ''} class="diet-checkbox hidden"><span class="px-2 py-1 border rounded-full text-teal-700 bg-white border-teal-200 transition-colors">Sugar-Free</span></label>
                                <label class="flex items-center text-xs cursor-pointer"><input type="checkbox" id="m-egg-${cIndex}-${iIndex}" ${item.dietary?.eggless ? 'checked' : ''} class="diet-checkbox hidden"><span class="px-2 py-1 border rounded-full text-purple-700 bg-white border-purple-200 transition-colors">Eggless</span></label>
                            </div>
                            <div class="mt-3">
                                <input type="text" id="m-custom-${cIndex}-${iIndex}" value="${item.dietary?.custom_tag || ''}" placeholder="+ Add Custom Tag (Optional)" class="w-full text-sm border-gray-300 rounded shadow-sm p-2">
                            </div>
                        </div>

                        <div class="mt-auto pt-4 flex justify-between items-center">
                            <button id="m-del-${cIndex}-${iIndex}" title="Delete Item" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded shadow-sm transition-colors flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                            <button id="m-save-${cIndex}-${iIndex}" class="bg-brand hover:bg-brand-accent text-white font-bold py-2 px-6 rounded shadow transition-colors flex items-center gap-2">
                                <span class="spinner hidden"><svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span> Update Item
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
                
                let selectedFile = null;

                // Image Selection
                document.getElementById(`m-img-btn-${cIndex}-${iIndex}`).addEventListener('click', () => {
                    document.getElementById(`m-img-file-${cIndex}-${iIndex}`).click();
                });

                document.getElementById(`m-img-file-${cIndex}-${iIndex}`).addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        selectedFile = file;
                        document.getElementById(`m-img-preview-${cIndex}-${iIndex}`).src = URL.createObjectURL(file);
                    }
                });

                // Category Selection
                document.getElementById(`m-cat-${cIndex}-${iIndex}`).addEventListener('change', (e) => {
                    const newCatInput = document.getElementById(`m-new-cat-${cIndex}-${iIndex}`);
                    if (e.target.value === '__NEW__') {
                        newCatInput.classList.remove('hidden');
                    } else {
                        newCatInput.classList.add('hidden');
                    }
                });

                // Delete Event
                document.getElementById(`m-del-${cIndex}-${iIndex}`).addEventListener('click', async () => {
                    if (confirm(`Are you sure you want to delete ${item.title}? This cannot be undone.`)) {
                        try {
                            const res = await fetch('/api/delete-menu-item', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ categoryName: category.name, itemIndex: iIndex })
                            });
                            if (res.ok) {
                                menuData.categories[cIndex].items.splice(iIndex, 1);
                                showNotification(`Item "${item.title}" deleted successfully.`);
                                renderMenuEditor();
                            } else {
                                const err = await res.json();
                                showNotification('Failed to delete item: ' + (err.error || 'Unknown error'), true);
                            }
                        } catch (err) {
                            showNotification('Error deleting item: ' + err.message, true);
                        }
                    }
                });

                // Save Event
                document.getElementById(`m-save-${cIndex}-${iIndex}`).addEventListener('click', async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.querySelector('.spinner').classList.remove('hidden');

                    let finalImagePath = document.getElementById(`m-img-${cIndex}-${iIndex}`).value;

                    try {
                        if (selectedFile) {
                            finalImagePath = await uploadImage(selectedFile);
                        }

                        let updatedItem = {
                            ...item,
                            title: document.getElementById(`m-title-${cIndex}-${iIndex}`).value,
                            price: document.getElementById(`m-price-${cIndex}-${iIndex}`).value,
                            quantity: document.getElementById(`m-qty-${cIndex}-${iIndex}`).value,
                            weight: document.getElementById(`m-wt-${cIndex}-${iIndex}`).value,
                            description: document.getElementById(`m-desc-${cIndex}-${iIndex}`).value,
                            image: finalImagePath,
                            dietary: {
                                contains_milk: document.getElementById(`m-milk-${cIndex}-${iIndex}`).checked,
                                contains_nuts: document.getElementById(`m-nuts-${cIndex}-${iIndex}`).checked,
                                vegan: document.getElementById(`m-veg-${cIndex}-${iIndex}`).checked,
                                gluten_free: document.getElementById(`m-gf-${cIndex}-${iIndex}`).checked,
                                sugar_free: document.getElementById(`m-sf-${cIndex}-${iIndex}`).checked,
                                eggless: document.getElementById(`m-egg-${cIndex}-${iIndex}`).checked,
                                custom_tag: document.getElementById(`m-custom-${cIndex}-${iIndex}`).value
                            }
                        };
                        
                        // Handle Category Logic
                        const catSelect = document.getElementById(`m-cat-${cIndex}-${iIndex}`).value;
                        let targetCategoryName = catSelect;
                        if (catSelect === '__NEW__') {
                            targetCategoryName = document.getElementById(`m-new-cat-${cIndex}-${iIndex}`).value.trim();
                            if (!targetCategoryName) {
                                alert("Please enter a category name");
                                btn.disabled = false;
                                btn.querySelector('.spinner').classList.add('hidden');
                                return;
                            }
                        }

                        // Remove item from old category
                        menuData.categories[cIndex].items.splice(iIndex, 1);
                        
                        // Find or create new category
                        let targetCategory = menuData.categories.find(c => c.name === targetCategoryName);
                        if (!targetCategory) {
                            targetCategory = { name: targetCategoryName, items: [] };
                            menuData.categories.push(targetCategory);
                        }
                        targetCategory.items.push(updatedItem);
                        
                        // Clean up empty old categories
                        if (menuData.categories[cIndex].items.length === 0) {
                            menuData.categories.splice(cIndex, 1);
                        }
                        
                        const res = await fetch('/api/save-menu', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(menuData)
                        });
                        
                        if(res.ok) {
                            showNotification('Menu Item Updated!');
                            renderMenuFilters();
                            renderMenuEditor();
                        } else {
                            showNotification('Failed to save JSON', true);
                        }
                    } catch(err) {
                        showNotification('Upload Error: ' + err.message, true);
                    } finally {
                        btn.disabled = false;
                        btn.querySelector('.spinner')?.classList.add('hidden');
                    }
                });
            });
        });
    };

    // Add New Menu Item Logic (Modal)
    const addMenuItemBtn = document.getElementById('add-menu-item-btn');
    const addItemModal = document.getElementById('add-item-modal');
    const closeAddModal = document.getElementById('close-add-modal');
    const saveNewItemBtn = document.getElementById('save-new-item-btn');
    const addCatSelect = document.getElementById('add-cat');
    const addNewCatInput = document.getElementById('add-new-cat');

    if (addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', () => {
            // Populate categories
            addCatSelect.innerHTML = menuData.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
            addCatSelect.innerHTML += `<option value="__NEW__">+ Add New Category...</option>`;
            addNewCatInput.classList.add('hidden');
            
            // Clear inputs
            document.getElementById('add-title').value = '';
            document.getElementById('add-price').value = '';
            document.getElementById('add-desc').value = '';
            document.getElementById('add-qty').value = '';
            document.getElementById('add-wt').value = '';
            document.getElementById('add-img-file').value = '';
            ['add-milk', 'add-nuts', 'add-veg', 'add-gf', 'add-sf'].forEach(id => document.getElementById(id).checked = false);

            addItemModal.classList.remove('hidden');
        });
    }

    if (closeAddModal) {
        closeAddModal.addEventListener('click', () => {
            addItemModal.classList.add('hidden');
        });
    }

    if (addCatSelect) {
        addCatSelect.addEventListener('change', (e) => {
            if (e.target.value === '__NEW__') addNewCatInput.classList.remove('hidden');
            else addNewCatInput.classList.add('hidden');
        });
    }

    if (saveNewItemBtn) {
        saveNewItemBtn.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            btn.disabled = true;
            btn.querySelector('.spinner').classList.remove('hidden');

            try {
                const fileInput = document.getElementById('add-img-file');
                let finalImagePath = 'Images/Logo 3.jpg';
                if (fileInput.files && fileInput.files[0]) {
                    finalImagePath = await uploadImage(fileInput.files[0]);
                }

                const newItem = {
                    title: document.getElementById('add-title').value || "Unnamed Item",
                    price: document.getElementById('add-price').value || "₹0",
                    description: document.getElementById('add-desc').value,
                    image: finalImagePath,
                    quantity: document.getElementById('add-qty').value,
                    weight: document.getElementById('add-wt').value,
                    dietary: {
                        contains_milk: document.getElementById('add-milk').checked,
                        contains_nuts: document.getElementById('add-nuts').checked,
                        vegan: document.getElementById('add-veg').checked,
                        gluten_free: document.getElementById('add-gf').checked,
                        sugar_free: document.getElementById('add-sf').checked,
                    }
                };

                // Handle Category Logic
                let targetCategoryName = addCatSelect.value;
                if (targetCategoryName === '__NEW__') {
                    targetCategoryName = addNewCatInput.value.trim();
                    if (!targetCategoryName) {
                        alert("Please enter a category name");
                        btn.disabled = false;
                        btn.querySelector('.spinner').classList.add('hidden');
                        return;
                    }
                }

                // Find or create category
                let targetCategory = menuData.categories.find(c => c.name === targetCategoryName);
                if (!targetCategory) {
                    targetCategory = { name: targetCategoryName, items: [] };
                    menuData.categories.push(targetCategory);
                }
                
                // Prepend item to category
                targetCategory.items.unshift(newItem);
                
                const res = await fetch('/api/save-menu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menuData)
                });
                
                if(res.ok) {
                    showNotification('New Item Successfully Added!');
                    addItemModal.classList.add('hidden');
                    currentCategoryFilter = targetCategoryName; // auto switch to see the new item
                    searchInput.value = '';
                    renderMenuFilters();
                    renderMenuEditor();
                    document.getElementById('section-menu').scrollIntoView({ behavior: 'smooth' });
                } else {
                    showNotification('Failed to save JSON', true);
                }
            } catch(err) {
                showNotification('Error: ' + err.message, true);
            } finally {
                btn.disabled = false;
                btn.querySelector('.spinner')?.classList.add('hidden');
            }
        });
    }

    const renderGalleryEditor = () => {
        const grid = document.getElementById('gallery-editor-grid');
        grid.innerHTML = '';

        galleryData.gallery_list.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white';
            const imgSrc = item.image.startsWith('/') ? item.image.substring(1) : item.image;
            
            card.innerHTML = `
                <img id="g-preview-${index}" src="${imgSrc}" class="w-full h-48 object-cover">
                <div class="p-3 border-t">
                    <input type="text" id="g-title-${index}" value="${item.title || ''}" class="w-full text-sm border-gray-300 rounded shadow-sm p-1 font-medium mb-2" placeholder="Title">
                    <input type="hidden" id="g-img-${index}" value="${item.image}">
                </div>
                <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button id="g-save-${index}" title="Save" class="bg-brand text-white p-2 rounded-full shadow hover:bg-brand-accent">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                    <button id="g-del-${index}" title="Delete" class="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-700">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `;
            grid.appendChild(card);

            document.getElementById(`g-save-${index}`).addEventListener('click', async () => {
                galleryData.gallery_list[index].title = document.getElementById(`g-title-${index}`).value;
                galleryData.gallery_list[index].image = document.getElementById(`g-img-${index}`).value;
                await saveGallery();
            });

            document.getElementById(`g-del-${index}`).addEventListener('click', async () => {
                if(confirm('Remove this image from gallery?')) {
                    galleryData.gallery_list.splice(index, 1);
                    await saveGallery();
                }
            });
        });
    };

    const saveGallery = async () => {
        try {
            const res = await fetch('/api/save-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(galleryData)
            });
            if(res.ok) {
                showNotification('Gallery Updated!');
                renderGalleryEditor();
            } else {
                showNotification('Failed to save', true);
            }
        } catch(e) {
            showNotification('Error saving. Is server running?', true);
        }
    };

    // Add new gallery image
    const addGalleryBtn = document.getElementById('add-gallery-btn');
    const addGalleryFile = document.getElementById('add-gallery-file');
    
    addGalleryBtn.addEventListener('click', () => {
        addGalleryFile.click();
    });

    addGalleryFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                showNotification('Uploading image...');
                const filePath = await uploadImage(file);
                galleryData.gallery_list.unshift({ image: filePath, title: "New Custom Cake" });
                await saveGallery();
            } catch (err) {
                showNotification('Upload Error: ' + err, true);
            }
        }
    });

    // Settings Editor
    let selectedLogoFile = null;

    const renderSettingsEditor = () => {
        if(!settingsData) return;
        
        // Populate logo
        if(settingsData.logo) {
            const logoImgs = document.querySelectorAll('.global-logo');
            logoImgs.forEach(img => {
                const imgSrc = settingsData.logo.startsWith('/') ? settingsData.logo.substring(1) : settingsData.logo;
                img.src = imgSrc + '?t=' + new Date().getTime();
            });
        }

        if(settingsData.homepage_banner) {
            const bannerSrc = settingsData.homepage_banner.startsWith('/') ? settingsData.homepage_banner.substring(1) : settingsData.homepage_banner;
            const heroPreview = document.getElementById('banner-hero-preview');
            if (heroPreview) {
                heroPreview.src = bannerSrc + '?t=' + new Date().getTime();
                document.getElementById('banner-hero-val').value = settingsData.homepage_banner;
            }
        }

        if(settingsData.menu_banner) {
            const menuBannerSrc = settingsData.menu_banner.startsWith('/') ? settingsData.menu_banner.substring(1) : settingsData.menu_banner;
            const menuPreview = document.getElementById('banner-menu-preview');
            if (menuPreview) {
                menuPreview.src = menuBannerSrc + '?t=' + new Date().getTime();
                document.getElementById('banner-menu-val').value = settingsData.menu_banner;
            }
        }

        document.getElementById('ops-phone').value = settingsData.phone || '';
        document.getElementById('ops-website').value = settingsData.website || '';
        document.getElementById('ops-address').value = settingsData.address || '';
        document.getElementById('ops-closed-toggle').checked = settingsData.closed || false;
        document.getElementById('ops-closed-msg').value = settingsData.closed_msg || '';
        document.getElementById('ops-alert-toggle').checked = settingsData.alert || false;
        document.getElementById('ops-alert-msg').value = settingsData.alert_msg || '';

        const hoursContainer = document.getElementById('ops-hours');
        hoursContainer.innerHTML = '';
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        days.forEach(day => {
            const h = settingsData.hours?.[day] || { open: '', close: '' };
            hoursContainer.innerHTML += `
                <div class="border rounded p-3 bg-gray-50">
                    <label class="block font-bold text-gray-700 mb-2">${day}</label>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500 w-10">Open</span>
                            <input type="time" id="ops-${day}-open" value="${h.open}" class="border rounded px-2 py-1 text-sm w-24">
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500 w-10">Close</span>
                            <input type="time" id="ops-${day}-close" value="${h.close}" class="border rounded px-2 py-1 text-sm w-24">
                        </div>
                    </div>
                </div>
            `;
        });
    };

    // Content Editor
    let selectedContentImages = { img1: null, img2: null, img3: null };
    let selectedBestsellerImages = [null, null, null];
    let selectedBannerHero = null;
    let selectedBannerMenu = null;

    const bannerHeroBtn = document.getElementById('banner-hero-btn');
    if (bannerHeroBtn) {
        bannerHeroBtn.addEventListener('click', () => {
            document.getElementById('banner-hero-file').click();
        });
        document.getElementById('banner-hero-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedBannerHero = file;
                document.getElementById('banner-hero-preview').src = URL.createObjectURL(file);
            }
        });

        const bannerMenuBtn = document.getElementById('banner-menu-btn');
        if (bannerMenuBtn) {
            bannerMenuBtn.addEventListener('click', () => {
                document.getElementById('banner-menu-file').click();
            });
            document.getElementById('banner-menu-file').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    selectedBannerMenu = file;
                    document.getElementById('banner-menu-preview').src = URL.createObjectURL(file);
                }
            });
        }

        document.getElementById('banner-save-btn').addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            btn.disabled = true;
            btn.querySelector('.spinner').classList.remove('hidden');
            try {
                if (selectedBannerHero) {
                    settingsData.homepage_banner = await uploadImage(selectedBannerHero);
                    selectedBannerHero = null;
                } else {
                    settingsData.homepage_banner = document.getElementById('banner-hero-val').value || "Images/banner1.jpeg";
                }

                if (selectedBannerMenu) {
                    settingsData.menu_banner = await uploadImage(selectedBannerMenu);
                    selectedBannerMenu = null;
                } else {
                    settingsData.menu_banner = document.getElementById('banner-menu-val').value || "Images/banner1.jpeg";
                }

                const res = await fetch('/api/save-operations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settingsData)
                });
                if (res.ok) {
                    showNotification('Website Banners Saved Successfully!');
                } else {
                    showNotification('Failed to save banners', true);
                }
            } catch (err) {
                showNotification('Error saving: ' + err.message, true);
            } finally {
                btn.disabled = false;
                btn.querySelector('.spinner').classList.add('hidden');
            }
        });
    }

    const renderContentEditor = () => {
        if (!contentData) return;

        // Bestsellers
        const bsGrid = document.getElementById('content-bestsellers-grid');
        bsGrid.innerHTML = '';
        contentData.bestsellers.forEach((item, index) => {
            const imgSrc = item.image.startsWith('/') ? item.image.substring(1) : item.image;
            bsGrid.innerHTML += `
                <div class="border rounded p-4 bg-gray-50 flex flex-col gap-3">
                    <img id="bs-preview-${index}" src="${imgSrc}?t=${new Date().getTime()}" class="w-full h-32 object-cover rounded border">
                    <input type="file" id="bs-file-${index}" class="hidden" accept="image/*">
                    <button id="bs-btn-${index}" class="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold py-1 px-2 rounded">Change Image</button>
                    <input type="hidden" id="bs-val-${index}" value="${item.image}">
                    
                    <label class="text-xs font-bold text-gray-500 uppercase">Title</label>
                    <input type="text" id="bs-title-${index}" value="${item.title}" class="w-full border border-gray-300 rounded p-1 text-sm font-bold">
                    
                    <label class="text-xs font-bold text-gray-500 uppercase mt-2">Description</label>
                    <textarea id="bs-desc-${index}" rows="2" class="w-full border border-gray-300 rounded p-1 text-sm">${item.desc}</textarea>
                </div>
            `;
        });

        // Attach bestseller image listeners
        contentData.bestsellers.forEach((item, index) => {
            document.getElementById(`bs-btn-${index}`).addEventListener('click', () => {
                document.getElementById(`bs-file-${index}`).click();
            });
            document.getElementById(`bs-file-${index}`).addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    selectedBestsellerImages[index] = file;
                    document.getElementById(`bs-preview-${index}`).src = URL.createObjectURL(file);
                }
            });
        });

        // About Us
        document.getElementById('content-about-title').value = contentData.about_us.title || '';
        document.getElementById('content-about-p1').value = contentData.about_us.paragraphs[0] || '';
        document.getElementById('content-about-p2').value = contentData.about_us.paragraphs[1] || '';
        document.getElementById('content-about-p3').value = contentData.about_us.paragraphs[2] || '';

        [1, 2, 3].forEach(num => {
            const imgPath = contentData.about_us.images[num - 1];
            const imgSrc = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
            document.getElementById(`content-about-img${num}-preview`).src = `${imgSrc}?t=${new Date().getTime()}`;
            document.getElementById(`content-about-img${num}-val`).value = imgPath;

            document.getElementById(`content-about-img${num}-btn`).addEventListener('click', () => {
                document.getElementById(`content-about-img${num}-file`).click();
            });

            document.getElementById(`content-about-img${num}-file`).addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    selectedContentImages[`img${num}`] = file;
                    document.getElementById(`content-about-img${num}-preview`).src = URL.createObjectURL(file);
                }
            });
        });
    };

    document.getElementById('content-save-btn').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.querySelector('.spinner').classList.remove('hidden');

        try {
            // Save Bestsellers
            for (let i = 0; i < 3; i++) {
                if (selectedBestsellerImages[i]) {
                    contentData.bestsellers[i].image = await uploadImage(selectedBestsellerImages[i]);
                    selectedBestsellerImages[i] = null;
                } else {
                    contentData.bestsellers[i].image = document.getElementById(`bs-val-${i}`).value;
                }
                contentData.bestsellers[i].title = document.getElementById(`bs-title-${i}`).value;
                contentData.bestsellers[i].desc = document.getElementById(`bs-desc-${i}`).value;
            }

            // Save About Us
            contentData.about_us.title = document.getElementById('content-about-title').value;
            contentData.about_us.paragraphs = [
                document.getElementById('content-about-p1').value,
                document.getElementById('content-about-p2').value,
                document.getElementById('content-about-p3').value
            ];

            for (let num of [1, 2, 3]) {
                if (selectedContentImages[`img${num}`]) {
                    contentData.about_us.images[num - 1] = await uploadImage(selectedContentImages[`img${num}`]);
                    selectedContentImages[`img${num}`] = null;
                } else {
                    contentData.about_us.images[num - 1] = document.getElementById(`content-about-img${num}-val`).value;
                }
            }

            const res = await fetch('/api/save-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contentData)
            });

            if (res.ok) {
                showNotification('Page Content Saved Successfully!');
                renderContentEditor();
            } else {
                showNotification('Failed to save Page Content', true);
            }
        } catch (err) {
            showNotification('Error saving: ' + err.message, true);
        } finally {
            btn.disabled = false;
            btn.querySelector('.spinner').classList.add('hidden');
        }
    });

    // Logo Upload Logic
    document.getElementById('ops-logo-btn').addEventListener('click', () => {
        document.getElementById('ops-logo-file').click();
    });

    document.getElementById('ops-logo-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedLogoFile = file;
            document.getElementById('ops-logo-preview').src = URL.createObjectURL(file);
        }
    });

    // Save Settings
    document.getElementById('ops-save-btn').addEventListener('click', async () => {
        if(!settingsData) return;
        
        try {
            if (selectedLogoFile) {
                showNotification('Uploading new logo...');
                settingsData.logo = await uploadImage(selectedLogoFile);
                selectedLogoFile = null; // reset
            }

            settingsData.phone = document.getElementById('ops-phone').value;
            settingsData.website = document.getElementById('ops-website').value;
            settingsData.address = document.getElementById('ops-address').value;
            settingsData.closed = document.getElementById('ops-closed-toggle').checked;
            settingsData.closed_msg = document.getElementById('ops-closed-msg').value;
            settingsData.alert = document.getElementById('ops-alert-toggle').checked;
            settingsData.alert_msg = document.getElementById('ops-alert-msg').value;

            if(!settingsData.hours) settingsData.hours = {};
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            days.forEach(day => {
                settingsData.hours[day] = {
                    open: document.getElementById(`ops-${day}-open`).value,
                    close: document.getElementById(`ops-${day}-close`).value
                };
            });

            const res = await fetch('/api/save-operations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settingsData)
            });
            if(res.ok) {
                showNotification('Business Operations Saved!');
                // visually update logos again
                renderSettingsEditor(); 
            } else {
                showNotification('Failed to save settings', true);
            }
        } catch(e) {
            showNotification('Error saving. Is server running?', true);
        }
    });

    // Update PIN Logic
    document.getElementById('ops-update-pin-btn').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const spinner = btn.querySelector('.spinner');
        const currentPin = document.getElementById('ops-current-pin').value;
        const newPin = document.getElementById('ops-new-pin').value;
        const confirmPin = document.getElementById('ops-confirm-pin').value;
        const msgEl = document.getElementById('pin-update-msg');
        
        msgEl.classList.remove('hidden', 'text-green-600', 'text-red-600');

        if (!currentPin || !newPin || !confirmPin) {
            msgEl.textContent = 'Please fill out all PIN fields.';
            msgEl.classList.add('text-red-600');
            return;
        }

        if (newPin !== confirmPin) {
            msgEl.textContent = 'New PINs do not match.';
            msgEl.classList.add('text-red-600');
            return;
        }

        btn.disabled = true;
        if (spinner) spinner.classList.remove('hidden');

        try {
            const res = await fetch('/api/update-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPin, newPin })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                msgEl.textContent = 'PIN updated successfully!';
                msgEl.classList.add('text-green-600');
                document.getElementById('ops-current-pin').value = '';
                document.getElementById('ops-new-pin').value = '';
                document.getElementById('ops-confirm-pin').value = '';
            } else {
                msgEl.textContent = data.error || 'Failed to update PIN.';
                msgEl.classList.add('text-red-600');
            }
        } catch(e) {
            msgEl.textContent = 'Server error.';
            msgEl.classList.add('text-red-600');
        } finally {
            btn.disabled = false;
            if (spinner) spinner.classList.add('hidden');
        }
    });
});
