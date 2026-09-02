document.addEventListener("DOMContentLoaded", function() {
        const disqusSection = document.getElementById('disqus-section');
        
        if (disqusSection) {
            const loadDisqus = () => {
                // Cegah agar skrip tidak dimuat dua kali
                if (window.disqusLoaded) return;
                window.disqusLoaded = true;

                var d = document, s = d.createElement('script');
                s.src = 'https://travego.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                
                // Konfigurasi dinamis (opsional, sesuaikan dengan URL/Identifier halaman Anda)
                window.disqus_config = function () {
                    this.page.url = window.location.href;  
                    this.page.identifier = window.location.pathname; 
                };

                (d.head || d.body).appendChild(s);
            };

            // Menggunakan Intersection Observer untuk mendeteksi saat user mendekati area komentar
            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    // Ketika elemen sudah mulai masuk ke dalam viewport (dengan margin 200px sebelum terlihat)
                    if (entry.isIntersecting) {
                        loadDisqus();
                        observerInstance.unobserve(entry.target); // Hentikan pengamatan setelah dimuat
                    }
                });
            }, {
                rootMargin: '0px 0px 300px 0px' // Muat sedikit lebih awal 300px sebelum elemen benar-benar terlihat di layar
            });

            observer.observe(disqusSection);
        }
    });