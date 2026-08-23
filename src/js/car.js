document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // 1. FLATPICKR LOADER & INISIALISASI (KHUSUS CAR RENTAL)
    // =========================================================================
    let flatpickrLoaded = false;

    const loadFlatpickr = () => {
        if (flatpickrLoaded) {
            if (typeof flatpickr !== 'undefined') initFlatpickrElements();
            return;
        }
        
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
        document.head.appendChild(link);
        
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
        script.onload = () => { 
            flatpickrLoaded = true;
            initFlatpickrElements();
        };
        document.body.appendChild(script);
    };

    function initFlatpickrElements() {
        const isMobile = window.innerWidth <= 768;
        const commonDateConfig = {
            dateFormat: "Y-m-d", altInput: true, altFormat: "j M Y",
            minDate: "today", allowInput: !isMobile, disableMobile: true
        };

        const pickupEl = document.getElementById('carPickupDate');
        const dropoffEl = document.getElementById('carDropoffDate');

        // Pengaturan kalender Tanggal Jemput Mobil dengan validasi minDate Tanggal Kembali
        if (pickupEl && !pickupEl._flatpickr) {
            pickupEl.classList.remove("lazy-date");
            flatpickr(pickupEl, {
                ...commonDateConfig,
                onChange: function(selectedDates, dateStr) {
                    if (dropoffEl && dropoffEl._flatpickr && dateStr) {
                        dropoffEl._flatpickr.set("minDate", dateStr);
                        const currentDrop = dropoffEl._flatpickr.selectedDates[0];
                        if (currentDrop && currentDrop < selectedDates[0]) {
                            dropoffEl._flatpickr.setDate(dateStr, true);
                        }
                    }
                }
            });
        }
        
        // Pengaturan kalender Tanggal Kembali Mobil
        if (dropoffEl && !dropoffEl._flatpickr) {
            dropoffEl.classList.remove("lazy-date");
            flatpickr(dropoffEl, commonDateConfig);
        }
        
        // Inisialisasi Jam / Waktu Rental Mobil
        document.querySelectorAll(".flatpickr-time:not(.flatpickr-input)").forEach(input => {
            if (!input._flatpickr) {
                flatpickr(input, { 
                    enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, 
                    allowInput: !isMobile, defaultHour: 10, defaultMinute: 0, disableMobile: true 
                });
            }
        });

        // PENGAMAN ABSOLUT: Cabut ".lazy-date" agar Flatpickr tidak reset berulang
        document.querySelectorAll(".lazy-date").forEach(input => {
            input.classList.remove("lazy-date");
            flatpickr(input, commonDateConfig);
        });
    }

    // Trigger Flatpickr saat interaksi pertama (Lazy Load)
    document.querySelectorAll(".lazy-date, .flatpickr-date, .flatpickr-time").forEach(input => {
        input.addEventListener("mouseover", loadFlatpickr);
        input.addEventListener("focus", loadFlatpickr);
        input.addEventListener("click", loadFlatpickr);
        input.addEventListener("touchstart", loadFlatpickr, { passive: true });
    });


    // =========================================================================
    // 2. RENTAL MOBIL (TOGGLE DROP-OFF LOKASI BERBEDA)
    // =========================================================================
    const diffLocationToggle = document.getElementById('diffLocationToggle');
    const pickupCol = document.getElementById('pickupCol');
    const dropoffCol = document.getElementById('dropoffCol');
    const dropoffInput = document.getElementById('dropoffInput');

    if (diffLocationToggle && pickupCol && dropoffCol) {
        diffLocationToggle.addEventListener('change', function() {
            if (this.checked) {
                dropoffCol.classList.remove('d-none');
                pickupCol.classList.remove('col-12'); 
                pickupCol.classList.add('col-12', 'col-md-6');
                dropoffCol.classList.add('col-12', 'col-md-6'); 
                if (dropoffInput) dropoffInput.setAttribute('required', 'true');
            } else {
                pickupCol.classList.remove('col-md-6');
                pickupCol.classList.add('col-12'); 
                dropoffCol.classList.add('d-none'); 
                if (dropoffInput) {
                    dropoffInput.removeAttribute('required');
                    dropoffInput.value = '';
                }
            }
        });
    }

});