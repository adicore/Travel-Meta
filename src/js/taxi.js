document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // 1. FLATPICKR LOADER (KHUSUS TAXI)
    // =========================================================================
    const isMobile = window.innerWidth <= 768;
    const commonDateConfig = {
        dateFormat: "Y-m-d", altInput: true, altFormat: "j M Y",
        minDate: "today", allowInput: !isMobile, disableMobile: true
    };

    const taxiDateEl = document.getElementById('taxiDate');
    const taxiTimeEl = document.getElementById('taxiTime');

    if (taxiDateEl) {
        flatpickr(taxiDateEl, commonDateConfig);
    }
    
    if (taxiTimeEl) {
        flatpickr(taxiTimeEl, { 
            enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, 
            allowInput: !isMobile, defaultHour: 10, defaultMinute: 0, disableMobile: true 
        });
    }


    // =========================================================================
    // 2. LOGIKA PENUMPANG & BAGASI
    // =========================================================================
    function updateTaxiSummary() {
        const passengerInput = document.getElementById("taxiPassenger");
        const luggageInput = document.getElementById("taxiLuggage");

        if (passengerInput && luggageInput) {
            const passengers = parseInt(passengerInput.value) || 1;
            const luggages = parseInt(luggageInput.value) || 1;

            const summary = document.getElementById("taxiSummaryText");
            if (summary) summary.textContent = `${passengers} Penumpang, ${luggages} Koper`;

            const incPass = document.querySelector('.increase-count[data-target="taxiPassenger"]');
            const decPass = document.querySelector('.decrease-count[data-target="taxiPassenger"]');
            const incLug = document.querySelector('.increase-count[data-target="taxiLuggage"]');
            const decLug = document.querySelector('.decrease-count[data-target="taxiLuggage"]');

            if (incPass) incPass.disabled = (passengers >= 12);
            if (decPass) decPass.disabled = (passengers <= 1);
            if (incLug) incLug.disabled = (luggages >= 10);
            if (decLug) decLug.disabled = (luggages <= 0);
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
                if (targetId === "taxiPassenger" && val >= 12) return;
                if (targetId === "taxiLuggage" && val >= 10) return;
                
                input.value = val + 1;
                updateTaxiSummary();
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
                    updateTaxiSummary();
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

    updateTaxiSummary();

    // =========================================================================
    // 4. AUTOCOMPLETE LOKASI & TOMBOL SWAP (INTERAKTIF)
    // =========================================================================
    const setupTravelAutocomplete = (input) => {
        const listContainer = document.createElement('ul');
        listContainer.className = 'autocomplete-list-' + (input.id || Math.random());
        
        // Styling dasar untuk dropdown autocomplete
        listContainer.style.cssText = `position:absolute;background:#fff;z-index:9999999;border:1px solid #ccc;border-radius:8px;max-height:250px;overflow-y:auto;box-shadow:0 10px 20px rgba(0,0,0,0.15);list-style:none;padding:0;margin:0;display:none;`;
        document.body.appendChild(listContainer);

        const updateDropdownPosition = () => {
            const rect = input.getBoundingClientRect();
            listContainer.style.top = (rect.bottom + window.scrollY + 5) + 'px';
            listContainer.style.left = (rect.left + window.scrollX) + 'px';
            // Sesuaikan lebar dropdown
            listContainer.style.width = Math.max(rect.width, 300) + 'px';
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
                    // Endpoint autocomplete yang sama dengan penerbangan (mencakup kota & bandara)
                    const url = `https://autocomplete.travelpayouts.com/jravia?with_countries=true&locale=en&service=aviasales&q=${encodeURIComponent(query)}`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("API Gagal");
                    const data = await response.json();

                    listContainer.innerHTML = '';
                    if (!data || data.length === 0) { 
                        listContainer.style.display = 'none'; 
                        return; 
                    }

                    data.forEach(v => {
                        let item = null;
                        
                        // Icon pesawat untuk bandara, Icon kota untuk kota
                        const airportIcon = `<i class="bi bi-airplane text-muted fs-5"></i>`;
                        const cityIcon = `<i class="bi bi-buildings text-muted fs-5"></i>`;

                        if (v._type === "airport") {
                            item = { label: v.city_fullname, code: v.code, name: v.name, icon: airportIcon };
                        } else if (v._type === "city") {
                            item = { label: v.city_fullname, code: v.code, name: v.city_fullname, icon: cityIcon };
                        }

                        if (item) {
                            const li = document.createElement('li');
                            li.style.cssText = "display: flex; align-items: center; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f1f1f1; color: #333; transition: background 0.2s;";
                            
                            li.addEventListener('mouseenter', () => li.style.background = '#f8f9fa');
                            li.addEventListener('mouseleave', () => li.style.background = 'transparent');
                            
                            li.innerHTML = `${item.icon} 
                                <div style="flex-grow:1; margin-left:12px;">
                                    <div style="font-weight:600; font-size:14px;">${item.label}</div>
                                    <div style="font-size:12px; color:#6c757d;">${item.name}</div>
                                </div>
                                <span class="badge bg-light text-secondary border">${item.code}</span>`;

                            li.addEventListener('click', (e) => {
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
                    console.error("Gagal mendapatkan data lokasi", error);
                }
            }, 300); // 300ms delay agar tidak spam API
        });

        // Tutup dropdown jika klik di luar
        document.addEventListener('click', (e) => {
            if (e.target !== input && !listContainer.contains(e.target)) {
                listContainer.style.display = 'none';
            }
        });

        window.addEventListener('resize', () => {
            if (listContainer.style.display === 'block') updateDropdownPosition();
        });
    };

    // Jalankan setup pada semua input yang memiliki class autocomplete-input
    document.querySelectorAll('.autocomplete-input').forEach(input => {
        setupTravelAutocomplete(input);
    });

    // Logika Tombol Swap (Tukar Lokasi Penjemputan dan Tujuan)
    const swapBtn = document.querySelector('.swap-inputs-btn');
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const pickupInput = document.getElementById('taxiPickup');
            const dropoffInput = document.getElementById('taxiDropoff');
            
            if (pickupInput && dropoffInput) {
                // Beri efek rotasi kecil pada tombol agar terlihat interaktif
                swapBtn.style.transform = 'translateY(-50%) rotate(180deg)';
                swapBtn.style.transition = 'transform 0.3s ease';
                
                // Tukar nilainya
                const tempVal = pickupInput.value;
                pickupInput.value = dropoffInput.value;
                dropoffInput.value = tempVal;

                // Kembalikan rotasi tombol setelah animasi selesai
                setTimeout(() => {
                    swapBtn.style.transform = 'translateY(-50%) rotate(0deg)';
                }, 300);
            }
        });
    }

});