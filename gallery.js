document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const loading = document.getElementById('gallery-loading');
    const phoneNumber = '919870198838'; // India code + number

    fetch('gallery_data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (loading) loading.remove();
            const galleryList = data.gallery_list;

            if (!galleryList || galleryList.length === 0) {
                galleryContainer.innerHTML = `
                    <div class="col-span-full bg-white text-gray-600 p-8 rounded-lg shadow text-center">
                        <p class="text-lg">Our gallery is currently being updated. Check back soon for beautiful cake designs!</p>
                    </div>
                `;
                return;
            }

            galleryList.forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl';

                const imgSrc = item.image.startsWith('/') ? item.image.substring(1) : item.image;

                const imgContainer = document.createElement('div');
                imgContainer.className = 'relative h-64 w-full overflow-hidden';
                imgContainer.innerHTML = `<img src="${imgSrc}" alt="${item.title}" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110">`;

                const content = document.createElement('div');
                content.className = 'p-6 flex flex-col flex-grow';

                const title = document.createElement('h3');
                title.className = 'text-xl font-bold text-brand-dark mb-4 text-center';
                title.textContent = item.title;

                // WhatsApp Button
                const waBtn = document.createElement('a');
                const message = encodeURIComponent(`Hi, I would like to pre-order a custom cake similar to the one in your gallery: "${item.title}".`);
                waBtn.href = `https://wa.me/${phoneNumber}?text=${message}`;
                waBtn.target = '_blank';
                waBtn.className = 'mt-auto block w-full text-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2';
                waBtn.innerHTML = `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.39 0 0 5.39 0 12.031c0 2.115.549 4.17 1.594 5.996L.142 23.473l5.586-1.464a12.016 12.016 0 006.303 1.776h.005c6.638 0 12.029-5.391 12.029-12.032C24.065 5.391 18.673 0 12.031 0zM12.031 21.758c-1.785 0-3.535-.48-5.074-1.39l-.364-.216-3.771.989.999-3.676-.237-.377A10.02 10.02 0 012.01 12.031c0-5.526 4.498-10.023 10.021-10.023 5.525 0 10.022 4.498 10.022 10.023 0 5.526-4.497 10.024-10.022 10.024zm5.503-7.518c-.302-.151-1.784-.881-2.062-.981-.277-.101-.48-.151-.681.151-.202.302-.782.981-.958 1.182-.177.202-.354.227-.655.076-1.461-.735-2.527-1.411-3.486-2.923-.254-.397.251-.368.835-1.543.076-.151.038-.277-.038-.428-.076-.151-.681-1.637-.933-2.242-.246-.591-.497-.512-.681-.522-.177-.01-.38-.01-.581-.01-.202 0-.53.076-.807.378-.277.302-1.059 1.034-1.059 2.521 0 1.487 1.084 2.923 1.236 3.124.151.202 2.128 3.25 5.155 4.556 2.016.868 2.822.933 3.905.782 1.236-.177 3.771-1.538 4.301-3.025.53-1.487.53-2.773.378-3.025-.151-.252-.555-.403-.857-.554z"/></svg>
                    Pre-order via WhatsApp
                `;

                content.appendChild(title);
                content.appendChild(waBtn);
                
                card.appendChild(imgContainer);
                card.appendChild(content);

                galleryContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching gallery data:', error);
            if (loading) loading.remove();
            galleryContainer.innerHTML = `
                <div class="col-span-full bg-red-50 text-red-600 p-6 rounded-lg text-center">
                    <p class="font-bold text-lg mb-2">Oops!</p>
                    <p>We couldn't load the gallery right now. Please try again later.</p>
                </div>
            `;
        });
});
