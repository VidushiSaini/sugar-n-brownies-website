document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('offers-slider');
    const offersSection = document.getElementById('offers-section');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    let currentIndex = 0;
    let slides = [];
    let autoSlideInterval;

    // Load Offers Data
    fetch(`/offers_data.json?t=${Date.now()}`, { cache: 'no-store' })
        .then(res => {
            if (!res.ok) throw new Error("Could not fetch offers");
            return res.json();
        })
        .then(data => {
            const offers = data.offers_list;
            if (!offers || offers.length === 0) return; // leave hidden if no offers

            offersSection.classList.remove('hidden');

            offers.forEach(offer => {
                const slide = document.createElement('div');
                slide.className = 'min-w-full relative flex-shrink-0';
                
                const imgSrc = offer.image.startsWith('/') ? offer.image.substring(1) : offer.image;
                
                let ctaHtml = '';
                if (offer.cta_type && offer.cta_type !== "None") {
                    let link = offer.custom_link || "#";
                    if (offer.cta_type === "Order via WhatsApp") {
                        link = `https://wa.me/919870198838?text=${encodeURIComponent('Hi, I am interested in the offer: ' + (offer.title || offer.description))}`;
                    } else if (offer.cta_type === "View Menu") {
                        link = "menu.html";
                    } else if (offer.cta_type === "Order on Zomato") {
                        link = "https://zomato.onelink.me/xqzv/lvqo7o1h";
                    }
                    
                    const ctaClass = offer.cta_type === "Order on Zomato" 
                        ? "bg-[#E23744] hover:bg-red-700 text-white border-2 border-transparent hover:border-white" 
                        : "bg-brand hover:bg-brand-accent text-white";
                    
                    ctaHtml = `<a href="${link}" ${link.startsWith('http') ? 'target="_blank"' : ''} class="mt-8 inline-block font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1 text-lg ${ctaClass}">${offer.cta_type}</a>`;
                }

                const titleHtml = offer.title ? `<h3 class="text-brand text-lg md:text-xl font-heading font-bold mb-3 tracking-widest uppercase shadow-black drop-shadow-md">${offer.title}</h3>` : '';
                
                slide.innerHTML = `
                    <img src="${imgSrc}" class="w-full h-[28rem] object-cover rounded-xl" alt="${offer.title || 'Special Offer'}">
                    <div class="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded-xl p-8 text-center">
                        ${titleHtml}
                        <p class="text-white text-3xl md:text-5xl font-extrabold drop-shadow-xl max-w-4xl leading-tight">${offer.description}</p>
                        ${ctaHtml}
                    </div>
                `;
                sliderContainer.appendChild(slide);
            });

            slides = Array.from(sliderContainer.children);
            
            if (slides.length > 1) {
                startAutoSlide();
                prevBtn.addEventListener('click', () => { showPrev(); resetAutoSlide(); });
                nextBtn.addEventListener('click', () => { showNext(); resetAutoSlide(); });
            } else {
                // hide buttons if only 1 slide
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        })
        .catch(err => console.error("Error loading offers:", err));

    function updateSlider() {
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function showNext() {
        if (slides.length <= 1) return;
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    function showPrev() {
        if (slides.length <= 1) return;
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(showNext, 5000); // every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
});
