document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // 1. AUTOCOMPLETE LOKASI & TOMBOL SWAP (DARI POLA HOMEPAGE)
    // =========================================================================
    const taxiPickup = document.getElementById('taxiPickup');
    const taxiDropoff = document.getElementById('taxiDropoff');

    const setupTravelAutocomplete = (input) => {
        if (!input) return;
        const listContainer = document.createElement('ul');
        listContainer.className = 'autocomplete-list-' + (input.id || Math.random());
        
        listContainer.style.cssText = `position:absolute;background:#fff;z-index:9999999;border:1px solid #ccc;border-radius:4px;max-height:250px;overflow-y:auto;box-shadow:0 8px 16px rgba(0,0,0,0.2);list-style:none;padding:0;margin:0;display:none;`;
        document.body.appendChild(listContainer);

        const updateDropdownPosition = () => {
            const rect = input.getBoundingClientRect();
            listContainer.style.top = (rect.bottom + window.scrollY) + 'px';
            listContainer.style.left = (rect.left + window.scrollX) + 'px';
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
                        
                        if (v._type === "airport") {
                            item = {
                                label: v.city_fullname,
                                code: v.code,
                                name: v.name,
                                icon: `<svg fill='#000000' width='14px' height='14px' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><path d='M13 1.9980469L13 7.9980469L8 7.9980469 A 1.0001 1.0001 0 0 0 7 8.9980469L7 12.998047 A 1.0001 1.0001 0 0 0 7.1425781 13.513672L9.2324219 16.998047L8 16.998047 A 1.0001 1.0001 0 0 0 7 17.998047L7 30.998047L4 30.998047 A 1.0001 1.0001 0 0 0 3 31.998047L3 44.998047 A 1.0001 1.0001 0 0 0 4 45.998047L45 45.998047 A 1.0001 1.0001 0 0 0 46 44.998047L46 31.998047 A 1.0001 1.0001 0 0 0 45 30.998047L21 30.998047L21 17.998047 A 1.0001 1.0001 0 0 0 20 16.998047L18.767578 16.998047L20.857422 13.513672 A 1.0001 1.0001 0 0 0 21 12.998047L21 8.9980469 A 1.0001 1.0001 0 0 0 20 7.9980469L15 7.9980469L15 1.9980469L13 1.9980469 z M 30.318359 3.7363281L37.087891 10.556641L33.582031 12.052734L29 10.769531L31.462891 14.033203L32.101562 18.074219L34.353516 13.878906L37.863281 12.382812L38.072266 21.998047L42.783203 10.283203L46.427734 8.7285156C46.930734 8.5145156 47.165172 7.9317344 46.951172 7.4277344C46.737172 6.9237344 46.157344 6.6872969 45.652344 6.9042969L42.007812 8.4589844L30.318359 3.7363281 z M 9 9.9980469L19 9.9980469L19 12.722656L16.433594 16.998047L11.566406 16.998047L9 12.722656L9 9.9980469 z M 9 18.998047L10.970703 18.998047L17 18.998047L19 18.998047L19 30.998047L9 30.998047L9 18.998047 z M 5 32.998047L8 32.998047L20 32.998047L44 32.998047L44 43.998047L40 43.998047L40 35.998047L35 35.998047L35 43.998047L5 43.998047L5 32.998047 z M 8 35.998047L8 39.998047L19 39.998047L19 35.998047L8 35.998047 z M 21 35.998047L21 39.998047L32 39.998047L32 35.998047L21 35.998047 z'/></svg>`
                            };
                        } else if (v._type === "city") {
                            item = {
                                label: v.city_fullname,
                                code: v.code,
                                name: v.city_fullname,
                                icon: `<svg fill='#000000' width='14px' height='14px' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><path d='M12 3.6132812L12 28L9 28L9 23L7 23L7 28L4 28L4 46L21 46L35 46L46 46L46 15L35 15L35 11.279297L32 10.279297L32 4L30 4L30 9.6113281L28 8.9453125L28 4L26 4L26 8.2792969L12 3.6132812 z M 14 6.3886719L33 12.720703L33 44L28 44L28 40.855469C29.715786 40.405591 31 38.850301 31 37C31 34.802706 29.197294 33 27 33C24.802706 33 23 34.802706 23 37C23 38.850301 24.284214 40.405591 26 40.855469L26 44L21 44L21 28L14 28L14 6.3886719 z M 16 12L16 14L22 14L22 12L16 12 z M 16 16L16 18L31 18L31 16L16 16 z M 37 19L42 19L42 22L37 22L37 19 z M 16 20L16 22L24 22L24 20L16 20 z M 26 20L26 22L31 22L31 20L26 20 z M 16 24L16 26L31 26L31 24L16 24 z M 37 24L42 24L42 27L37 27L37 24 z M 23 28L23 30L31 30L31 28L23 28 z M 37 29L42 29L42 32L37 32L37 29 z M 8 32L11 32L11 34L8 34L8 32 z M 14 32L17 32L17 34L14 34L14 32 z M 37 34L42 34L42 37L37 37L37 34 z M 8 36L11 36L11 38L8 38L8 36 z M 14 36L17 36L17 38L14 38L14 36 z M 37 39L42 39L42 42L37 42L37 39 z M 8 40L11 40L11 42L8 42L8 40 z M 14 40L17 40L17 42L14 42L14 40 z'/></svg>`
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
                                input.value = `${item.label} (${item.code})`;
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

    document.querySelectorAll('.autocomplete-input').forEach(input => setupTravelAutocomplete(input));

    // Tombol Swap Lokasi Penjemputan dan Tujuan
    const swapBtn = document.querySelector('.swap-inputs-btn');
    if (swapBtn && taxiPickup && taxiDropoff) {
        swapBtn.addEventListener('click', () => {
            const temp = taxiPickup.value;
            taxiPickup.value = taxiDropoff.value;
            taxiDropoff.value = temp;
        });
    }


    // =========================================================================
    // 2. LOGIKA ATURAN JUMLAH PENUMPANG & BAGASI TAKSI
    // =========================================================================
    function updateTaxiSummaries() {
        const passInput = document.getElementById("taxiPassenger");
        const lugInput = document.getElementById("taxiLuggage");

        if (passInput && lugInput) {
            const passengers = parseInt(passInput.value) || 1;
            const luggage = parseInt(lug_input = lugInput.value) || 0; // standard parser

            const summary = document.getElementById("taxiSummaryText");
            if (summary) summary.textContent = `${passengers} Penumpang, ${luggage} Bagasi`;

            const incPass = document.querySelector('.increase-count[data-target="taxiPassenger"]');
            const decPass = document.querySelector('.decrease-count[data-target="taxiPassenger"]');
            const incLug = document.querySelector('.increase-count[data-target="taxiLuggage"]');
            const decLug = document.querySelector('.decrease-count[data-target="taxiLuggage"]');

            if (incPass) incPass.disabled = (passengers >= 15);
            if (decPass) decPass.disabled = (passengers <= 1);
            if (incLug) incLug.disabled = (luggage >= 10);
            if (decLug) decLug.disabled = (luggage <= 0);
        }
    }

    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            if (incBtn.disabled) return;

            const targetId = incBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                let val = parseInt(input.value) || 0;
                if (targetId === "taxiPassenger" && val >= 15) return;
                if (targetId === "taxiLuggage" && val >= 10) return;

                input.value = val + 1;
                updateTaxiSummaries();
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
                let minValue = targetId.includes('Passenger') ? 1 : 0;

                if (val > minValue) {
                    input.value = val - 1;
                    updateTaxiSummaries();
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

    updateTaxiSummaries();


    // =========================================================================
    // 3. FLATPICKR LOADER & INISIALISASI (DENGAN initFlatpickrElements)
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

        const taxiDateEl = document.getElementById('taxiDate');
        if (taxiDateEl && !taxiDateEl._flatpickr) {
            taxiDateEl.classList.remove("lazy-date");
            flatpickr(taxiDateEl, commonDateConfig);
        }
        
        // Inisialisasi Jam / Waktu Taksi
        document.querySelectorAll(".flatpickr-time:not(.flatpickr-input)").forEach(input => {
            if (!input._flatpickr) {
                flatpickr(input, { 
                    enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, 
                    allowInput: !isMobile, defaultHour: 10, defaultMinute: 0, disableMobile: true 
                });
            }
        });

        document.querySelectorAll(".lazy-date").forEach(input => {
            input.classList.remove("lazy-date");
            flatpickr(input, commonDateConfig);
        });
    }

    document.querySelectorAll(".lazy-date, .flatpickr-date, .flatpickr-time").forEach(input => {
        input.addEventListener("mouseover", loadFlatpickr);
        input.addEventListener("focus", loadFlatpickr);
        input.addEventListener("click", loadFlatpickr);
        input.addEventListener("touchstart", loadFlatpickr, { passive: true });
    });

});