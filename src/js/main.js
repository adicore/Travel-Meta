document.addEventListener("DOMContentLoaded", () => {
    // SCROLL REVEAL ANIMATION
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // BACK TO TOP BUTTON LOGIC
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const startY = window.scrollY || window.pageYOffset;
            if (startY === 0) return;
            const duration = 1200; 
            const startTime = performance.now();

            function scrollStep(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                window.scrollTo(0, startY * (1 - easeProgress));

                if (progress < 1) {
                    requestAnimationFrame(scrollStep);
                }
            }
            requestAnimationFrame(scrollStep);
        });
    }

    // VANILLA CAROUSEL CLASS
    class VanillaCarousel {
        constructor(selector, options = {}) {
            this.carousel = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (!this.carousel) return;

            this.track = this.carousel.querySelector('.vc-track');
            if (!this.track) return;

            this.items = Array.from(this.track.children);
            this.prevBtn = this.carousel.querySelector('.vc-prev');
            this.nextBtn = this.carousel.querySelector('.vc-next');
            this.dotsContainer = this.carousel.querySelector('.vc-dots');

            this.options = Object.assign({
                items: 1,
                loop: false,
                autoplay: false,
                autoplayTimeout: 3000,
                dots: true,
                nav: true,
                responsive: {}
            }, options);

            this.currentIndex = 0;
            this.itemsPerView = this.options.items;
            this.isDragging = false;
            this.isMoved = false; 
            this.startX = 0;
            this.currentX = 0;
            this.animationID = null;
            this.autoplayTimer = null;

            this.init();
        }

        init() {
            this.updateResponsive();
            this.setupDots();
            this.updateCarousel();
            this.bindEvents();

            if (!this.options.nav) {
                if (this.prevBtn) this.prevBtn.style.display = 'none';
                if (this.nextBtn) this.nextBtn.style.display = 'none';
            }

            if (this.options.autoplay) this.startAutoplay();
        }

        updateResponsive() {
            const width = this.carousel.offsetWidth || window.innerWidth;
            this.itemsPerView = this.options.items;

            if (this.options.responsive) {
                let activeBreakpoint = 0;
                for (const breakpoint in this.options.responsive) {
                    if (width >= parseInt(breakpoint)) {
                        activeBreakpoint = breakpoint;
                    }
                }
                if (activeBreakpoint > 0) {
                    this.itemsPerView = this.options.responsive[activeBreakpoint].items;
                }
            }
        }

        updateCarousel() {
            const itemWidth = 100 / this.itemsPerView;
            this.items.forEach(item => {
                item.style.flex = `0 0 ${itemWidth}%`;
                item.style.maxWidth = `${itemWidth}%`;
            });

            const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
            if (this.currentIndex > maxIndex) this.currentIndex = maxIndex;
            if (this.currentIndex < 0) this.currentIndex = 0;

            this.track.style.transform = `translateX(-${this.currentIndex * (100 / this.itemsPerView)}%)`;
            this.updateDots();
            this.updateNavVisibility();
        }

        updateNavVisibility() {
            if (!this.options.nav) return;
            const maxIndex = Math.max(0, this.items.length - this.itemsPerView);

            if (maxIndex === 0 && !this.options.loop) {
                if (this.prevBtn) this.prevBtn.classList.add('is-hidden');
                if (this.nextBtn) this.nextBtn.classList.add('is-hidden');
                return;
            }

            if (!this.options.loop) {
                if (this.prevBtn) this.prevBtn.classList.toggle('is-hidden', this.currentIndex <= 0);
                if (this.nextBtn) this.nextBtn.classList.toggle('is-hidden', this.currentIndex >= maxIndex);
            } else {
                if (this.prevBtn) this.prevBtn.classList.remove('is-hidden');
                if (this.nextBtn) this.nextBtn.classList.remove('is-hidden');
            }
        }

        slideNext() {
            const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
            if (this.currentIndex < maxIndex) {
                this.currentIndex += this.itemsPerView;
                if (this.currentIndex > maxIndex) this.currentIndex = maxIndex;
            } else if (this.options.loop) {
                this.currentIndex = 0;
            }
            this.updateCarousel();
        }

        slidePrev() {
            if (this.currentIndex > 0) {
                this.currentIndex -= this.itemsPerView;
                if (this.currentIndex < 0) this.currentIndex = 0;
            } else if (this.options.loop) {
                this.currentIndex = Math.max(0, this.items.length - this.itemsPerView);
            }
            this.updateCarousel();
        }

        setupDots() {
            if (!this.dotsContainer || !this.options.dots) return;
            this.dotsContainer.innerHTML = '';
            const totalPages = Math.ceil(this.items.length / this.itemsPerView);
            if (totalPages <= 1) return;

            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.classList.add('vc-dot');
                dot.addEventListener('click', () => {
                    this.currentIndex = i * this.itemsPerView;
                    const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
                    if (this.currentIndex > maxIndex) this.currentIndex = maxIndex;
                    this.updateCarousel();
                });
                this.dotsContainer.appendChild(dot);
            }
        }

        updateDots() {
            if (!this.dotsContainer || !this.options.dots) return;
            const dots = Array.from(this.dotsContainer.children);
            const activePage = Math.round(this.currentIndex / this.itemsPerView);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activePage);
            });
        }

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayTimer = setInterval(() => this.slideNext(), this.options.autoplayTimeout);
        }

        stopAutoplay() {
            if (this.autoplayTimer) clearInterval(this.autoplayTimer);
        }

        bindEvents() {
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.slideNext(); this.startAutoplay(); });
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.slidePrev(); this.startAutoplay(); });

            if (this.options.autoplay) {
                this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
                this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
                this.carousel.addEventListener('touchstart', () => this.stopAutoplay(), { passive: true });
            }

            if (window.ResizeObserver) {
                new ResizeObserver(() => {
                    this.updateResponsive();
                    this.setupDots();
                    this.updateCarousel();
                }).observe(this.carousel);
            } else {
                window.addEventListener('resize', () => {
                    this.updateResponsive();
                    this.setupDots();
                    this.updateCarousel();
                });
            }

            this.track.addEventListener('dragstart', (e) => e.preventDefault());

            const dragStart = (e) => {
                if (e.type === 'mousedown') e.preventDefault();
                this.isDragging = true;
                this.isMoved = false; 
                if (this.animationID) cancelAnimationFrame(this.animationID);
                this.track.style.transition = 'none';
                this.track.style.cursor = 'grabbing';
                this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            };

            const dragMove = (e) => {
                if (!this.isDragging) return;
                const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                this.currentX = x - this.startX;
                if (Math.abs(this.currentX) > 5) this.isMoved = true;
                
                const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
                if ((this.currentIndex === 0 && this.currentX > 0) || (this.currentIndex === maxIndex && this.currentX < 0)) {
                    this.currentX = this.currentX * 0.3; 
                }

                if (this.animationID) cancelAnimationFrame(this.animationID);
                this.animationID = requestAnimationFrame(() => {
                    const diffPercent = (this.currentX / this.track.offsetWidth) * 100;
                    const baseTranslate = -(this.currentIndex * (100 / this.itemsPerView));
                    this.track.style.transform = `translateX(${baseTranslate + diffPercent}%)`;
                });
            };

            const dragEnd = () => {
                if (!this.isDragging) return;
                this.isDragging = false;
                if (this.animationID) cancelAnimationFrame(this.animationID);
                this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                this.track.style.cursor = 'grab';

                if (Math.abs(this.currentX) > 75) {
                    if (this.currentX < 0) this.slideNext();
                    else this.slidePrev();
                } else {
                    this.updateCarousel(); 
                }
                setTimeout(() => { this.currentX = 0; this.isMoved = false; }, 150);
            };

            this.track.addEventListener('click', (e) => {
                if (this.isMoved) { e.preventDefault(); e.stopPropagation(); }
            }, true); 

            this.track.addEventListener('touchstart', dragStart, { passive: true });
            this.track.addEventListener('touchmove', dragMove, { passive: true });
            this.track.addEventListener('touchend', dragEnd);
            this.track.addEventListener('mousedown', dragStart);
            this.track.addEventListener('mousemove', dragMove);
            this.track.addEventListener('mouseup', dragEnd);
            this.track.addEventListener('mouseleave', dragEnd);
        }
    }

    // Initialize Carousels
    document.querySelectorAll('.vanilla-carousel').forEach(carouselEl => {
        new VanillaCarousel(carouselEl, {
            items: 1, 
            loop: true,
            autoplay: true,
            autoplayTimeout: 4000,
            dots: true,
            nav: true,
            responsive: {
                576: { items: 2 },
                768: { items: 2 },
                992: { items: 3 },
                1200: { items: 3 }
            }
        });
    });

    // Currency & Language Selectors Sync
    document.querySelectorAll(".currency-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const txt = e.target.textContent;
            const deskBtn = document.getElementById("selectedCurrencyBtnDesk");
            if (deskBtn) deskBtn.innerHTML = `<i class="bi bi-coin text-warning"></i> ${txt}`;
            const mobCurrencyTxt = document.getElementById("mobCurrText");
            if (mobCurrencyTxt) mobCurrencyTxt.textContent = txt.split(' ')[0];
            
            const currModal = bootstrap.Modal.getInstance(document.getElementById('currencyModal'));
            if (currModal) currModal.hide();
            const mobSettingsModal = bootstrap.Modal.getInstance(document.getElementById('mobileSettingsModal'));
            if (mobSettingsModal) mobSettingsModal.hide();
        });
    });

    document.querySelectorAll(".lang-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const txt = e.target.textContent;
            const deskBtn = document.getElementById("selectedLangBtnDesk");
            if (deskBtn) deskBtn.innerHTML = `<i class="bi bi-globe text-info"></i> ${txt}`;
            const mobLangTxt = document.getElementById("mobLangText");
            const langCode = txt.match(/\(([^)]+)\)/);
            if (mobLangTxt && langCode) mobLangTxt.textContent = langCode[1];

            const langModal = bootstrap.Modal.getInstance(document.getElementById('langModal'));
            if (langModal) langModal.hide();
            const mobSettingsModal = bootstrap.Modal.getInstance(document.getElementById('mobileSettingsModal'));
            if (mobSettingsModal) mobSettingsModal.hide();
        });
    });

    // Newsletter Form
    const subForm = document.getElementById("subscribeForm");
    if (subForm) {
        subForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Terima kasih telah berlangganan! Kupon diskon 10% telah dikirimkan ke email Anda.");
            subForm.reset();
        });
    }

    // 1. Logika Pemilihan Mata Uang (Currency)
    const currencyButtons = document.querySelectorAll('.currency-option');
    currencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas aktif dari semua tombol mata uang
            currencyButtons.forEach(btn => {
                btn.classList.remove('btn-outline-primary', 'active', 'border-2');
                btn.classList.add('btn-light');
            });
            
            // Tambahkan kelas aktif ke tombol yang diklik
            this.classList.remove('btn-light');
            this.classList.add('btn-outline-primary', 'active', 'border-2');

            // Ambil kode mata uang (contoh: "USD" dari "USD ($)")
            const selectedCurrency = this.textContent.split(' ')[0];
            
            // Perbarui teks ringkasan di Desktop DAN Mobile sekaligus
            const currencyElements = document.querySelectorAll('#mobCurrText, #deskCurrText');
            currencyElements.forEach(el => {
                if (el) el.textContent = selectedCurrency;
            });
        });
    });

    // 2. Logika Pemilihan Bahasa (Language)
    const langButtons = document.querySelectorAll('.lang-option');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas aktif dari semua tombol bahasa
            langButtons.forEach(btn => {
                btn.classList.remove('btn-outline-primary', 'active', 'border-2');
                btn.classList.add('btn-light');
            });
            
            // Tambahkan kelas aktif ke tombol yang diklik
            this.classList.remove('btn-light');
            this.classList.add('btn-outline-primary', 'active', 'border-2');

            // Ambil singkatan bahasa di dalam kurung (contoh: "EN" dari "English (EN)")
            const match = this.textContent.match(/\(([^)]+)\)/);
            const selectedLang = match ? match[1] : this.textContent;

            // Perbarui teks ringkasan di Desktop DAN Mobile sekaligus
            const langElements = document.querySelectorAll('#mobLangText, #deskLangText');
            langElements.forEach(el => {
                if (el) el.textContent = selectedLang;
            });
        });
    });
});
