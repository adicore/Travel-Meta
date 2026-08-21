document.addEventListener("DOMContentLoaded", () => {
    // SET DEFAULT CHECK-IN & CHECK-OUT DATES (+3 DAYS & +5 DAYS)
    (function setInitialHotelDates() {
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + 3);
        
        const checkOutDate = new Date();
        checkOutDate.setDate(checkOutDate.getDate() + 5);

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const checkInInput = document.getElementById("hotelCheckIn");
        const checkOutInput = document.getElementById("hotelCheckOut");
        if (checkInInput) checkInInput.value = formatDate(checkInDate);
        if (checkOutInput) checkOutInput.value = formatDate(checkOutDate);
    })();

    // HOTEL LOCATION AUTOCOMPLETE
    const hotelLocationInput = document.getElementById('hotelLocation');
    if (hotelLocationInput) {
        let container = hotelLocationInput.parentNode.querySelector('.autocomplete-suggestions');
        if (!container) {
            container = document.createElement('div');
            container.className = 'autocomplete-suggestions';
            hotelLocationInput.parentNode.appendChild(container);
        }

        let debounceTimer;
        hotelLocationInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = hotelLocationInput.value.trim();
            if (query.length < 2) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }

            debounceTimer = setTimeout(() => {
                // Contoh dummy atau endpoint pencarian hotel/kota
                fetch(`https://autocomplete.travelpayouts.com/places?locale=en&types[]=city&term=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(data => {
                        container.innerHTML = '';
                        if (!data || data.length === 0) {
                            container.style.display = 'none';
                            return;
                        }
                        data.forEach(item => {
                            const div = document.createElement('div');
                            div.className = 'autocomplete-suggestion-item';
                            div.innerHTML = `<strong>${item.name || item.city_name}</strong> <br><small class="text-muted">${item.country_name || ''}</small>`;
                            div.addEventListener('click', () => {
                                hotelLocationInput.value = `${item.name || item.city_name}, ${item.country_name || ''}`;
                                container.innerHTML = '';
                                container.style.display = 'none';
                            });
                            container.appendChild(div);
                        });
                        container.style.display = 'block';
                    })
                    .catch(() => {
                        container.style.display = 'none';
                    });
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!hotelLocationInput.contains(e.target) && !container.contains(e.target)) {
                container.style.display = 'none';
            }
        });
    }

    // UPDATE HOTEL ROOM & GUEST SUMMARY
    function updateHotelSummary() {
        const roomInput = document.getElementById("hotelRoom");
        const adultInput = document.getElementById("hotelAdult");
        const childInput = document.getElementById("hotelChild");
        
        const rooms = roomInput ? parseInt(roomInput.value) || 1 : 1;
        const adults = adultInput ? parseInt(adultInput.value) || 2 : 2;
        const children = childInput ? parseInt(childInput.value) || 0 : 0;
        const totalGuests = adults + children;

        const summaryText = document.getElementById("hotelSummaryText");
        if (summaryText) {
            summaryText.textContent = `${rooms} Room${rooms > 1 ? 's' : ''}, ${totalGuests} Guest${totalGuests > 1 ? 's' : ''}`;
        }
    }

    // FLATPICKR LAZY LOADER FOR HOTEL DATES
    let flatpickrLoaded = false;
    const loadFlatpickr = () => {
        if (flatpickrLoaded) {
            if (typeof flatpickr !== 'undefined') {
                flatpickr(".lazy-date:not(.flatpickr-input)", { dateFormat: "Y-m-d", altInput: true, altFormat: "j M Y" });
            }
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
            flatpickr(".lazy-date", { dateFormat: "Y-m-d", altInput: true, altFormat: "j M Y" }); 
        };
        document.body.appendChild(script);
    };

    document.querySelectorAll(".lazy-date").forEach(input => {
        input.addEventListener("mouseover", loadFlatpickr);
        input.addEventListener("focus", loadFlatpickr);
        input.addEventListener("click", loadFlatpickr);
        input.addEventListener("touchstart", loadFlatpickr, { passive: true });
    });

    // EVENT DELEGATION FOR HOTEL COUNTERS (+ / -)
    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            const targetId = incBtn.getAttribute('data-target');
            if (targetId && (targetId.startsWith('hotel'))) {
                const input = document.getElementById(targetId);
                if (input) {
                    input.value = parseInt(input.value) + 1;
                    updateHotelSummary();
                }
            }
            return;
        }
        
        const decBtn = e.target.closest('.decrease-count');
        if (decBtn) {
            e.preventDefault(); e.stopPropagation();
            const targetId = decBtn.getAttribute('data-target');
            if (targetId && (targetId.startsWith('hotel'))) {
                const input = document.getElementById(targetId);
                if (input) {
                    const minValue = (targetId === 'hotelRoom' || targetId === 'hotelAdult') ? 1 : 0;
                    if (parseInt(input.value) > minValue) {
                        input.value = parseInt(input.value) - 1;
                        updateHotelSummary();
                    }
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

    // SEARCH ACTION BUTTON
    document.querySelectorAll(".search-action-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Mencari ketersediaan hotel secara real-time...");
        });
    });
});