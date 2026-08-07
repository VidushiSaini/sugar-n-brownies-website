document.addEventListener('DOMContentLoaded', () => {
    fetch('content_data.json?t=' + new Date().getTime())
        .then(res => {
            if (!res.ok) throw new Error("Content data not found");
            return res.json();
        })
        .then(content => {
            // Render Bestsellers (index.html)
            const bestsellersGrid = document.getElementById('bestsellers-grid');
            if (bestsellersGrid && content.bestsellers) {
                bestsellersGrid.innerHTML = '';
                content.bestsellers.forEach(item => {
                    const imgSrc = item.image.startsWith('/') ? item.image.substring(1) : item.image;
                    const card = `
                    <div class="bg-brand-light rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <img src="${imgSrc}?t=${new Date().getTime()}" alt="${item.title}" class="w-full h-64 object-cover object-center">
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">${item.title}</h3>
                            <p class="text-gray-700">${item.desc}</p>
                        </div>
                    </div>
                    `;
                    bestsellersGrid.innerHTML += card;
                });
            }

            // Render About Us (about.html)
            const aboutTitle = document.getElementById('about-title');
            const aboutParagraphs = document.getElementById('about-paragraphs');
            const aboutImagesContainer = document.getElementById('about-images-container');

            if (content.about_us) {
                if (aboutTitle) {
                    aboutTitle.textContent = content.about_us.title || "Our Story";
                }
                
                if (aboutParagraphs && content.about_us.paragraphs) {
                    aboutParagraphs.innerHTML = '';
                    content.about_us.paragraphs.forEach(para => {
                        aboutParagraphs.innerHTML += `<p class="text-lg text-gray-700 leading-relaxed mb-6">${para}</p>`;
                    });
                }

                if (aboutImagesContainer && content.about_us.images && content.about_us.images.length === 3) {
                    const img1 = content.about_us.images[0].startsWith('/') ? content.about_us.images[0].substring(1) : content.about_us.images[0];
                    const img2 = content.about_us.images[1].startsWith('/') ? content.about_us.images[1].substring(1) : content.about_us.images[1];
                    const img3 = content.about_us.images[2].startsWith('/') ? content.about_us.images[2].substring(1) : content.about_us.images[2];
                    
                    aboutImagesContainer.innerHTML = `
                        <img src="${img1}?t=${new Date().getTime()}" alt="About Image 1" class="rounded-xl shadow-md w-full h-48 object-cover object-center mt-8">
                        <img src="${img2}?t=${new Date().getTime()}" alt="About Image 2" class="rounded-xl shadow-md w-full h-64 object-cover object-center">
                        <img src="${img3}?t=${new Date().getTime()}" alt="About Image 3" class="rounded-xl shadow-md w-full h-48 object-cover object-center col-span-2">
                    `;
                }
            }
        })
        .catch(err => console.error('Failed to load content_data.json:', err));
});
