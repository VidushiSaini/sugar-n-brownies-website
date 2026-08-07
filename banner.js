document.addEventListener('DOMContentLoaded', () => {
    fetch(`/business_settings.json?t=${Date.now()}`, { cache: 'no-store' })
        .then(res => {
            if (!res.ok) throw new Error("Settings not found");
            return res.json();
        })
        .then(settings => {
            const body = document.body;
            let bannerHtml = '';

            // Update Global Logo
            if (settings.logo) {
                const logoImgs = document.querySelectorAll('.global-logo, img[alt*="Logo"]');
                logoImgs.forEach(img => {
                    const imgSrc = settings.logo.startsWith('/') ? settings.logo.substring(1) : settings.logo;
                    img.src = imgSrc + '?t=' + new Date().getTime();
                });
            }

            // Update Homepage Hero Banner
            const heroSection = document.getElementById('hero-section');
            if (heroSection) {
                const bannerPath = settings.homepage_banner ? settings.homepage_banner : 'Images/banner1.jpeg';
                const cleanPath = bannerPath.startsWith('/') ? bannerPath.substring(1) : bannerPath;
                heroSection.style.backgroundImage = `url('${cleanPath}?t=${new Date().getTime()}')`;
            }

            // Update Menu Page Banner
            const menuHeroImg = document.getElementById('menu-hero-img');
            if (menuHeroImg) {
                const bannerPath = settings.menu_banner ? settings.menu_banner : 'Images/banner1.jpeg';
                const cleanPath = bannerPath.startsWith('/') ? bannerPath.substring(1) : bannerPath;
                menuHeroImg.src = `${cleanPath}?t=${new Date().getTime()}`;
            }

            // Update Footer Contact Info
            if (settings.phone) {
                const phoneLinks = document.querySelectorAll('footer a[href^="tel:"]');
                phoneLinks.forEach(link => {
                    link.href = `tel:${settings.phone}`;
                    link.textContent = settings.phone;
                });
            }
            
            const h3s = document.querySelectorAll('footer h3');
            h3s.forEach(h3 => {
                const addressP = h3.nextElementSibling;
                if (addressP && addressP.tagName === 'P') {
                    if (settings.address) addressP.textContent = settings.address;
                    
                    const hoursP = addressP.nextElementSibling;
                    if (hoursP && hoursP.tagName === 'P' && settings.hours) {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const today = days[new Date().getDay()];
                        const todayHours = settings.hours[today];
                        
                        let statusText = 'Closed Today';
                        if (todayHours && todayHours.open && todayHours.close) {
                            // simple check if closed based on global setting or hours
                            if (settings.closed) {
                                statusText = 'Currently Closed';
                            } else {
                                statusText = `Open Today: ${todayHours.open} - ${todayHours.close}`;
                            }
                        }

                        let tooltipHtml = '<div class="absolute bottom-full left-0 mb-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl p-3 text-sm hidden group-hover:block border border-gray-100 z-50 transform transition-all opacity-0 group-hover:opacity-100">';
                        tooltipHtml += '<p class="font-bold border-b pb-1 mb-2 text-brand-dark">Weekly Hours</p>';
                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(d => {
                            const h = settings.hours[d];
                            const timeStr = (h && h.open && h.close) ? `${h.open} - ${h.close}` : 'Closed';
                            const isToday = d === today ? 'font-bold text-brand' : 'text-gray-600';
                            tooltipHtml += `<div class="flex justify-between py-1 ${isToday}"><span>${d}</span><span>${timeStr}</span></div>`;
                        });
                        tooltipHtml += '</div>';

                        hoursP.outerHTML = `<div class="relative group inline-block cursor-help mt-1"><p class="text-brand font-semibold border-b border-dashed border-brand/50 inline-block transition-colors hover:text-white">${statusText}</p>${tooltipHtml}</div>`;
                    }
                }
            });

            if (settings.closed && settings.closed_msg && settings.closed_msg.trim() !== '') {
                bannerHtml += `
                    <div class="bg-red-600 text-white text-center py-3 px-4 shadow-md z-50 relative font-bold flex justify-center items-center gap-2">
                        <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span>${settings.closed_msg}</span>
                    </div>
                `;
            } else if (settings.alert && settings.alert_msg && settings.alert_msg.trim() !== '') {
                bannerHtml += `
                    <div class="bg-yellow-500 text-black text-center py-2 px-4 shadow-md z-50 relative font-semibold flex justify-center items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>${settings.alert_msg}</span>
                    </div>
                `;
            }

            if (bannerHtml) {
                const bannerContainer = document.createElement('div');
                bannerContainer.innerHTML = bannerHtml;
                body.insertBefore(bannerContainer, body.firstChild);
            }
        })
        .catch(err => console.error('Failed to load business settings for banner/logo:', err));
});
