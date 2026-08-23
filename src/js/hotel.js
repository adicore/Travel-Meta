document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================================
    // 1. LOGIKA ATURAN TAMU & KAMAR HOTEL
    // =========================================================================
    function updateHotelSummaries() {
        const hotelRoomInput = document.getElementById("hotelRoom");
        const hotelAdultInput = document.getElementById("hotelAdult");
        const hotelChildInput = document.getElementById("hotelChild");

        if (hotelRoomInput && hotelAdultInput && hotelChildInput) {
            const rooms = parseInt(hotelRoomInput.value) || 1;
            const adults = parseInt(hotelAdultInput.value) || 2;
            const children = parseInt(hotelChildInput.value) || 0;
            const guests = adults + children;

            const summary = document.getElementById("hotelSummaryText");
            if (summary) summary.textContent = `${rooms} Room, ${guests} Guests`;

            const incRoom = document.querySelector('.increase-count[data-target="hotelRoom"]');
            const decRoom = document.querySelector('.decrease-count[data-target="hotelRoom"]');
            const incHAdult = document.querySelector('.increase-count[data-target="hotelAdult"]');
            const decHAdult = document.querySelector('.decrease-count[data-target="hotelAdult"]');
            const incHChild = document.querySelector('.increase-count[data-target="hotelChild"]');
            const decHChild = document.querySelector('.decrease-count[data-target="hotelChild"]');

            // Aturan Batas Maksimal (Kamar 10, Dewasa 20, Anak 20)
            if (incRoom) incRoom.disabled = (rooms >= 10);
            if (decRoom) decRoom.disabled = (rooms <= 1);
            if (incHAdult) incHAdult.disabled = (adults >= 20);
            if (decHAdult) decHAdult.disabled = (adults <= 1);
            if (incHChild) incHChild.disabled = (children >= 20);
            if (decHChild) decHChild.disabled = (children <= 0);
        }
    }

    // Event listener global untuk tombol Plus/Minus dan Apply
    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            if (incBtn.disabled) return;

            const targetId = incBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                let val = parseInt(input.value) || 0;
                
                // Mencegah penambahan melebihi batas
                if (targetId === "hotelRoom" && val >= 10) return;
                if ((targetId === "hotelAdult" || targetId === "hotelChild") && val >= 20) return;

                input.value = val + 1;
                updateHotelSummaries();
            }
            return;
        }
        
        const decBtn = e.target.closest('.decrease-count');
        if (decBtn) {
            e.preventDefault(); e.stopPropagation();
            if (decBtn.disabled) return;

            const targetId = decBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                let val = parseInt(input.value) || 0;
                // Nilai minimal kamar dan dewasa adalah 1, anak adalah 0
                let minValue = (targetId.includes('Adult') || targetId.includes('Room')) ? 1 : 0;

                if (val > minValue) {
                    input.value = val - 1;
                    updateHotelSummaries();
                }
            }
            return;
        }

        const applyBtn = e.target.closest('.apply-btn');
        if (applyBtn) {
            e.preventDefault(); e.stopPropagation();
            const toggleEl = applyBtn.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]');
            if (toggleEl) {
                const bsDropdown = bootstrap.Dropdown.getInstance(toggleEl) || new bootstrap.Dropdown(toggleEl);
                bsDropdown.hide();
            }
        }
    });

    // Inisialisasi awal UI saat halaman dimuat
    updateHotelSummaries();


    // =========================================================================
    // 2. FLATPICKR LOADER & INISIALISASI (KHUSUS HOTEL)
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

        const hotelInEl = document.getElementById('hotelCheckIn');
        const hotelOutEl = document.getElementById('hotelCheckOut');

        // Pengaturan kalender Check-In
        if (hotelInEl && !hotelInEl._flatpickr) {
            hotelInEl.classList.remove("lazy-date");
            flatpickr(hotelInEl, {
                ...commonDateConfig,
                onChange: function(selectedDates, dateStr) {
                    // Jika Check-out sudah aktif, set minimal tanggalnya sesuai Check-in baru
                    if (hotelOutEl && hotelOutEl._flatpickr && dateStr) {
                        hotelOutEl._flatpickr.set("minDate", dateStr);
                        const currentOut = hotelOutEl._flatpickr.selectedDates[0];
                        // Jika tanggal Check-out sebelumnya mendahului Check-in yang baru, geser otomatis
                        if (currentOut && currentOut < selectedDates[0]) {
                            hotelOutEl._flatpickr.setDate(dateStr, true);
                        }
                    }
                }
            });
        }
        
        // Pengaturan kalender Check-Out
        if (hotelOutEl && !hotelOutEl._flatpickr) {
            hotelOutEl.classList.remove("lazy-date");
            flatpickr(hotelOutEl, commonDateConfig);
        }

        // =========================================================================
        // PENGAMAN ABSOLUT: Cabut ".lazy-date" agar Flatpickr tidak reset berulang!
        // =========================================================================
        document.querySelectorAll(".lazy-date").forEach(input => {
            // Kita menghapus class lazy-date TEPAT SEBELUM fungsi flatpickr dijalankan.
            input.classList.remove("lazy-date");
            flatpickr(input, commonDateConfig);
        });
    }

    // Trigger Flatpickr hanya jika pengguna berinteraksi (Lazy Load performa)
    document.querySelectorAll(".lazy-date, .flatpickr-date").forEach(input => {
        input.addEventListener("mouseover", loadFlatpickr);
        input.addEventListener("focus", loadFlatpickr);
        input.addEventListener("click", loadFlatpickr);
        input.addEventListener("touchstart", loadFlatpickr, { passive: true });
    });

});