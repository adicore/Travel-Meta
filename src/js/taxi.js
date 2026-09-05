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
                        
                        if (v._type === "airport" || v._type === "city") {
                            const iconSvg = v._type === "city" 
                            ? `<svg fill='#000000' width='14px' height='14px' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><path d='M12 3.6132812L12 28L9 28L9 23L7 23L7 28L4 28L4 46L21 46L35 46L46 46L46 15L35 15L35 11.279297L32 10.279297L32 4L30 4L30 9.6113281L28 8.9453125L28 4L26 4L26 8.2792969L12 3.6132812 z'/></svg>`
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
            const luggage = parseInt(lugInput.value) || 0; // Diperbaiki dari bug penugasan variabel sebelumnya

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
    // 3. FLATPICKR LOADER & INISIALISASI (DENGAN SAFEGUARD)
    // =========================================================================
    let flatpickrLoaded = false;
    let isFetchingFlatpickr = false;

    const loadFlatpickr = (e) => {
        if (e && e.target && e.target._flatpickr) return;

        if (flatpickrLoaded) {
            if (typeof flatpickr !== 'undefined') initFlatpickrElements();
            return;
        }
        
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
            isFetchingFlatpickr = false;
            initFlatpickrElements();

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

        const taxiDateEl = document.getElementById('taxiDate');
        if (taxiDateEl && !taxiDateEl._flatpickr) {
            taxiDateEl.classList.remove("lazy-date");
            flatpickr(taxiDateEl, commonDateConfig);
        }
        
        const taxiTimeEl = document.getElementById('taxiTime');
        if (taxiTimeEl && !taxiTimeEl._flatpickr) {
            flatpickr(taxiTimeEl, { 
                enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, 
                allowInput: !isMobile, defaultHour: 10, defaultMinute: 0, disableMobile: true 
            });
        }

        document.querySelectorAll(".lazy-date").forEach(input => {
            if (!input._flatpickr) {
                input.classList.remove("lazy-date");
                flatpickr(input, commonDateConfig);
            }
        });
    }

    document.querySelectorAll("#taxiDate, #taxiTime, .lazy-date, .flatpickr-date, .flatpickr-time").forEach(input => {
        input.addEventListener("mouseover", loadFlatpickr);
        input.addEventListener("focus", loadFlatpickr);
        input.addEventListener("click", loadFlatpickr);
        input.addEventListener("touchstart", loadFlatpickr, { passive: true });
    });

});