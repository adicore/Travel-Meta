document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================================
    // 1. AUTOCOMPLETE LOKASI HOTEL (DESAIN DIPERLEBAR)
    // =========================================================================
    const setupHotelAutocomplete = (input) => {
        const listContainer = document.createElement('ul');
        listContainer.className = 'autocomplete-list-hotel-' + (input.id || Math.random());
        
        listContainer.style.cssText = `position:absolute;background:#fff;z-index:9999999;border:1px solid #ccc;border-radius:4px;max-height:250px;overflow-y:auto;box-shadow:0 8px 16px rgba(0,0,0,0.2);list-style:none;padding:0;margin:0;display:none;`;
        
        document.body.appendChild(listContainer);

        const updateDropdownPosition = () => {
            const rect = input.getBoundingClientRect();
            listContainer.style.top = (rect.bottom + window.scrollY) + 'px';
            listContainer.style.left = (rect.left + window.scrollX) + 'px';
            // Memperlebar dropdown minimal 340px atau mengikuti lebar input
            listContainer.style.width = Math.max(rect.width, 340) + 'px';
        };

        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = input.value.trim();
            if (query.length < 2) { 
                listContainer.style.display = 'none'; 
                return; 
            }

            debounceTimer = setTimeout(async () => {
                try {
                    // Menggunakan endpoint autocomplete travel (cocok untuk pencarian kota destinasi hotel)
                    const url = `https://autocomplete.travelpayouts.com/jravia?with_countries=true&locale=en&service=aviasales&q=${encodeURIComponent(query)}`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Gagal menghubungi server API");
                    const data = await response.json();

                    listContainer.innerHTML = '';
                    if (!data || data.length === 0) { 
                        listContainer.style.display = 'none'; 
                        return; 
                    }

                    data.forEach(v => {
                        let item = null;
                        
                        // Menampilkan hasil Kota dan Bandara sebagai destinasi utama
                        if (v._type === "airport" || v._type === "city") {
                            const iconSvg = v._type === "city" 
                            ? `<svg fill='#000000' width='14px' height='14px' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><path d='M12 3.6132812L12 28L9 28L9 23L7 23L7 28L4 28L4 46L21 46L35 46L46 46L46 15L35 15L35 11.279297L32 10.279297L32 4L30 4L30 9.6113281L28 8.9453125L28 4L26 4L26 8.2792969L12 3.6132812 z M 14 6.3886719L33 12.720703L33 44L28 44L28 40.855469C29.715786 40.405591 31 38.850301 31 37C31 34.802706 29.197294 33 27 33C24.802706 33 23 34.802706 23 37C23 38.850301 24.284214 40.405591 26 40.855469L26 44L21 44L21 28L14 28L14 6.3886719 z'/></svg>`
                            : `<svg fill='#000000' width='14px' height='14px' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><path d='M13 1.9980469L13 7.9980469L8 7.9980469 A 1.0001 1.0001 0 0 0 7 8.9980469L7 12.998047 A 1.0001 1.0001 0 0 0 7.1425781 13.513672L9.2324219 16.998047L8 16.998047 A 1.0001 1.0001 0 0 0 7 17.998047L7 30.998047L4 30.998047 A 1.0001 1.0001 0 0 0 3 31.998047L3 44.998047 A 1.0001 1.0001 0 0 0 4 45.998047L45 45.998047 A 1.0001 1.0001 0 0 0 46 44.998047L46 31.998047 A 1.0001 1.0001 0 0 0 45 30.998047L21 30.998047L21 17.998047 A 1.0001 1.0001 0 0 0 20 16.998047L18.767578 16.998047L20.857422 13.513672 A 1.0001 1.0001 0 0 0 21 12.998047L21 8.9980469 A 1.0001 1.0001 0 0 0 20 7.9980469L15 7.9980469L15 1.9980469L13 1.9980469 z'/></svg>`;

                            item = {
                                label: v.city_fullname || v.name,
                                code: v.code,
                                name: v.name || v.city_fullname,
                                icon: iconSvg
                            };
                        }

                        if (item) {
                            const li = document.createElement('li');
                            li.style.cssText = "display: flex; align-items: center; padding: 10px; cursor: pointer; border-bottom: 1px solid #eee; color: #333;";
                            
                            li.addEventListener('mouseenter', () => li.style.background = '#f5f5f5');
                            li.addEventListener('mouseleave', () => li.style.background = 'transparent');
                            
                            li.innerHTML = `${item.icon} <div style="flex-grow:1;margin-left:10px"><div style="font-weight:bold;font-size:14px">${item.label}</div><div style="font-size:12px;color:#777">${item.name}</div></div><span style="font-size:12px;background:#eaeaea;padding:2px 6px;border-radius:4px;font-weight:bold;color:#555">${item.code}</span>`;

                            li.addEventListener('click', function(e) {
                                e.preventDefault();
                                input.value = `${item.label}`;
                                listContainer.style.display = 'none';
                            });

                            listContainer.appendChild(li);
                        }
                    });

                    updateDropdownPosition();
                    listContainer.style.display = 'block';

                } catch (error) {
                    console.error("Gagal mendapatkan data API", error);
                }
            }, 300);
        });

        input.addEventListener('focus', () => {
            if (listContainer.children.length > 0 && input.value.trim().length >= 2) {
                updateDropdownPosition();
                listContainer.style.display = 'block';
            }
        });

        window.addEventListener('resize', () => {
            if (listContainer.style.display === 'block') updateDropdownPosition();
        });

        document.addEventListener('click', function(e) {
            if (e.target !== input && !listContainer.contains(e.target)) {
                listContainer.style.display = 'none';
            }
        });
    };

    document.querySelectorAll('#page-hotels .autocomplete-input').forEach(input => setupHotelAutocomplete(input));

    // =========================================================================
    // 2. LOGIKA ATURAN TAMU & KAMAR HOTEL
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

    // Event listener global untuk tombol Plus/Minus dan Apply khusus Hotel
    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            if (incBtn.disabled) return;

            const targetId = incBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            // Validasi khusus untuk id hotelRoom, hotelAdult, hotelChild
            if (input && (targetId === "hotelRoom" || targetId === "hotelAdult" || targetId === "hotelChild")) {
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
            
            if (input && (targetId === "hotelRoom" || targetId === "hotelAdult" || targetId === "hotelChild")) {
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

    // Inisialisasi awal UI tamu saat halaman dimuat
    updateHotelSummaries();


    // =========================================================================
    // 3. FLATPICKR LOADER & INISIALISASI (DIPERBAIKI UNTUK MENCEGAH BUG BERTUMPUK)
    // =========================================================================
    let flatpickrLoaded = false;
    let isFetchingFlatpickr = false; // Mencegah load ganda saat event mouseover & click berjalan bersamaan

    const loadFlatpickr = (e) => {
        // Cegah eksekusi jika input yang di-hover/diklik sudah memiliki kalender aktif
        if (e && e.target && e.target._flatpickr) return;

        if (flatpickrLoaded) {
            if (typeof flatpickr !== 'undefined') initFlatpickrElements();
            return;
        }
        
        // Kunci pengaman
        if (isFetchingFlatpickr) return; 
        isFetchingFlatpickr = true;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
        document.head.appendChild(link);
        
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
        script.onload = () => { 
            flatpickrLoaded = true;
            isFetchingFlatpickr = false; // Lepas kunci
            initFlatpickrElements();
            
            // Buka kalender otomatis jika pemicunya adalah klik
            if (e && (e.type === 'click' || e.type === 'focus') && e.target && e.target._flatpickr) {
                e.target._flatpickr.open();
            }
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

        // Pengaman ekstra: Cabut class lazy-date untuk elemen lain yang mungkin menduplikasi
        document.querySelectorAll(".lazy-date").forEach(input => {
            if (!input._flatpickr) { 
                input.classList.remove("lazy-date");
                flatpickr(input, commonDateConfig);
            }
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