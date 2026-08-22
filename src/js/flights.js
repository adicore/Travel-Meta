document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================================
    // 1. DIMANA SAYA API & AUTOCOMPLETE
    // =========================================================================
    let userOrigin = "SIN"; 
    let userOriginName = "Singapore";

    fetch("https://www.apistp.com/whereami?locale=en")
        .then(res => res.json())
        .then(locData => {
            if(locData) {
                userOrigin = locData.code || locData.iata || "SIN";
                userOriginName = locData.city || locData.name || userOrigin;
                const flightOriginInput = document.getElementById("flightOrigin");
                if(flightOriginInput) flightOriginInput.value = `${userOriginName} (${userOrigin})`;
            }
        })
        .catch(() => {
            const flightOriginInput = document.getElementById("flightOrigin");
            if(flightOriginInput) flightOriginInput.value = "Singapore (SIN)";
        });

    const setupTravelAutocomplete = (input) => {
        let container = input.parentNode.querySelector('.autocomplete-suggestions');
        if (!container) {
            container = document.createElement('div');
            container.className = 'autocomplete-suggestions';
            input.parentNode.appendChild(container);
        }

        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = input.value.trim();
            if (query.length < 2) { container.innerHTML = ''; container.style.display = 'none'; return; }

            debounceTimer = setTimeout(() => {
                fetch(`https://autocomplete.travelpayouts.com/jravia?with_countries=true&locale=en&service=aviasales&q=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(data => {
                        container.innerHTML = '';
                        if (!data || data.length === 0) { container.style.display = 'none'; return; }
                        data.forEach(item => {
                            const div = document.createElement('div');
                            div.className = 'autocomplete-suggestion-item';
                            div.innerHTML = `<strong>${item.name || item.city_name}</strong> (${item.code}) <br><small class="text-muted">${item.country_name || ''}</small>`;
                            div.addEventListener('click', () => {
                                input.value = `${item.name || item.city_name} (${item.code})`;
                                container.innerHTML = '';
                                container.style.display = 'none';
                            });
                            container.appendChild(div);
                        });
                        container.style.display = 'block';
                    });
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !container.contains(e.target)) container.style.display = 'none';
        });
    };

    document.querySelectorAll('.autocomplete-input').forEach(input => setupTravelAutocomplete(input));

    document.querySelectorAll('.swap-inputs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const boxItem = btn.closest('.search-box-item');
            const inputs = boxItem.querySelectorAll('.autocomplete-input');
            if (inputs.length === 2) {
                const temp = inputs[0].value;
                inputs[0].value = inputs[1].value;
                inputs[1].value = temp;
            }
        });
    });

    // =========================================================================
    // 2. LOGIKA PENUMPANG (MAX 9, ADULT MIN 1, INFANT <= ADULT)
    // =========================================================================
    function validateAndUpdatePassengers(adultId, childId, infantId, summarySelector) {
        const adultInput = document.getElementById(adultId);
        const childInput = document.getElementById(childId);
        const infantInput = document.getElementById(infantId);

        if (!adultInput || !childInput || !infantInput) return;

        const adults = parseInt(adultInput.value) || 1;
        const children = parseInt(childInput.value) || 0;
        const infants = parseInt(infantInput.value) || 0;
        const total = adults + children + infants;

        const incAdult = document.querySelector(`.increase-count[data-target="${adultId}"]`);
        const decAdult = document.querySelector(`.decrease-count[data-target="${adultId}"]`);
        const incChild = document.querySelector(`.increase-count[data-target="${childId}"]`);
        const decChild = document.querySelector(`.decrease-count[data-target="${childId}"]`);
        const incInfant = document.querySelector(`.increase-count[data-target="${infantId}"]`);
        const decInfant = document.querySelector(`.decrease-count[data-target="${infantId}"]`);

        if (incAdult) incAdult.disabled = (total >= 9);
        if (incChild) incChild.disabled = (total >= 9);
        if (incInfant) incInfant.disabled = (total >= 9 || infants >= adults);

        if (decAdult) decAdult.disabled = (adults <= 1 || adults - 1 < infants);
        if (decChild) decChild.disabled = (children <= 0);
        if (decInfant) decInfant.disabled = (infants <= 0);

        const totalKids = children + infants;
        const summaryText = totalKids > 0 ? `${adults} Adult, ${totalKids} Child` : `${adults} Adult, 0 Child`;
        
        document.querySelectorAll(summarySelector).forEach(el => {
            el.textContent = summaryText;
        });
    }

    function updateFlightSummaries() {
        validateAndUpdatePassengers('flightAdult', 'flightChild', 'flightInfant', '.travelers-summary-text:not(.mc-travelers-summary)');
        validateAndUpdatePassengers('mcAdult', 'mcChild', 'mcInfant', '.mc-travelers-summary');
    }

    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            if (incBtn.disabled) return;

            const targetId = incBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input && (targetId.startsWith('flight') || targetId.startsWith('mc'))) {
                const isMC = targetId.startsWith('mc');
                const adultId = isMC ? 'mcAdult' : 'flightAdult';
                const childId = isMC ? 'mcChild' : 'flightChild';
                const infantId = isMC ? 'mcInfant' : 'flightInfant';

                const adultIn = document.getElementById(adultId);
                const childIn = document.getElementById(childId);
                const infantIn = document.getElementById(infantId);

                if (adultIn && childIn && infantIn) {
                    const adults = parseInt(adultIn.value) || 1;
                    const children = parseInt(childIn.value) || 0;
                    const infants = parseInt(infantIn.value) || 0;
                    const total = adults + children + infants;

                    if (total >= 9) return;
                    if (targetId.includes('Infant') && infants >= adults) return;
                }

                input.value = parseInt(input.value) + 1;
                updateFlightSummaries();
            }
            return;
        }
        
        const decBtn = e.target.closest('.decrease-count');
        if (decBtn) {
            e.preventDefault(); e.stopPropagation();
            if (decBtn.disabled) return;

            const targetId = decBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input && (targetId.startsWith('flight') || targetId.startsWith('mc'))) {
                const isMC = targetId.startsWith('mc');
                const adultId = isMC ? 'mcAdult' : 'flightAdult';
                const infantId = isMC ? 'mcInfant' : 'flightInfant';

                const adultIn = document.getElementById(adultId);
                const infantIn = document.getElementById(infantId);
                let minValue = targetId.includes('Adult') ? 1 : 0;

                if (targetId.includes('Adult') && adultIn && infantIn) {
                    const adults = parseInt(adultIn.value) || 1;
                    const infants = parseInt(infantIn.value) || 0;
                    if (adults <= 1 || adults - 1 < infants) return;
                }

                if (parseInt(input.value) > minValue) {
                    input.value = parseInt(input.value) - 1;
                    updateFlightSummaries();
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

    document.querySelectorAll('.cabin-option').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cabinClassDropdownBtn').textContent = e.target.getAttribute('data-cabin');
        });
    });

    // =========================================================================
    // 3. FLATPICKR KALENDER & TOGGLE ONE-WAY / ROUNDTRIP
    // =========================================================================
    let flatpickrLoaded = false;

    const loadFlatpickr = () => {
        if (flatpickrLoaded) {
            if (typeof flatpickr !== 'undefined') initFlightFlatpickr();
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
            initFlightFlatpickr();
        };
        document.body.appendChild(script);
    };

    const oneWayTabBtn = document.getElementById('oneWayTabBtn');
    const roundTripTabBtn = document.getElementById('roundTripTabBtn');
    const flightDepCol = document.getElementById('flightDepCol');
    const flightReturnCol = document.getElementById('flightReturnCol');
    const flightTravelersCol = document.getElementById('flightTravelersCol');

    if (oneWayTabBtn && roundTripTabBtn && flightReturnCol) {
        oneWayTabBtn.addEventListener('click', () => {
            flightReturnCol.classList.add('flight-return-hidden');
            flightDepCol.className = 'col-lg-4 col-md-12';
            flightTravelersCol.className = 'col-lg-4 col-md-6';
        });

        roundTripTabBtn.addEventListener('click', () => {
            flightReturnCol.classList.remove('flight-return-hidden');
            flightDepCol.className = 'col-lg-2 col-md-6';
            flightTravelersCol.className = 'col-lg-4 col-md-6';
        });
    }

    function initFlightFlatpickr() {
        const isMobile = window.innerWidth <= 768;
        const commonDateConfig = {
            dateFormat: "Y-m-d", altInput: true, altFormat: "j M Y",
            minDate: "today", allowInput: !isMobile, disableMobile: true
        };

        const flightDepEl = document.getElementById('flightDepDate');
        const flightRetEl = document.getElementById('flightRetDate');

        if (flightDepEl && !flightDepEl._flatpickr) {
            flatpickr(flightDepEl, {
                ...commonDateConfig,
                onChange: function(selectedDates, dateStr) {
                    if (flightRetEl && flightRetEl._flatpickr && dateStr) {
                        flightRetEl._flatpickr.set("minDate", dateStr);
                        const currentRet = flightRetEl._flatpickr.selectedDates[0];
                        if (currentRet && currentRet < selectedDates[0]) {
                            flightRetEl._flatpickr.setDate(dateStr, true);
                        }
                    }
                }
            });
        }
        if (flightRetEl && !flightRetEl._flatpickr) flatpickr(flightRetEl, commonDateConfig);
        flatpickr(".lazy-date:not(.flatpickr-input):not(#flightDepDate):not(#flightRetDate)", commonDateConfig);
    }

    document.querySelectorAll(".lazy-date, .flatpickr-date").forEach(input => {
        input.addEventListener("mouseover", loadFlatpickr);
        input.addEventListener("focus", loadFlatpickr);
        input.addEventListener("click", loadFlatpickr);
        input.addEventListener("touchstart", loadFlatpickr, { passive: true });
    });

    // =========================================================================
    // 4. MULTI-CITY ROWS DYNAMIC ADDITION
    // =========================================================================
    const addFlightBtn = document.getElementById("addFlightBtn");
    const multiCityContainer = document.getElementById("multiCityContainer");

    function updateMultiCityButtons() {
        if(!multiCityContainer) return;
        const rows = multiCityContainer.querySelectorAll(".multicity-row");
        rows.forEach((row) => {
            const btn = row.querySelector(".remove-row");
            if (rows.length === 1) btn.setAttribute("disabled", "true"); 
            else btn.removeAttribute("disabled"); 
        });
        if(addFlightBtn) addFlightBtn.style.display = rows.length >= 4 ? "none" : "inline-flex";
    }

    if(addFlightBtn && multiCityContainer) {
        addFlightBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const rows = multiCityContainer.querySelectorAll(".multicity-row");
            if (rows.length >= 4) return;

            const rowCountLabel = rows.length + 1;
            const newRow = document.createElement("div");
            newRow.className = "row g-2 mb-2 multicity-row align-items-center";
            
            newRow.innerHTML = `
                <div class="col-lg-6 col-md-12">
                    <div class="search-box-item py-2 px-3 border rounded-3 bg-white" style="min-height: 58px; display: flex; flex-direction: column; justify-content: center;">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center flex-grow-1 position-relative pe-2">
                                <i class="bi bi-airplane-engines text-primary me-2"></i>
                                <input type="text" class="form-control form-control-sm border-0 p-0 fw-bold autocomplete-input shadow-none bg-transparent" placeholder="Penerbangan ${rowCountLabel}: Dari">
                            </div>
                            <div class="d-flex align-items-center flex-grow-1 position-relative ps-2 border-start">
                                <i class="bi bi-airplane-fill text-primary me-2"></i>
                                <input type="text" class="form-control form-control-sm border-0 p-0 fw-bold autocomplete-input shadow-none bg-transparent" placeholder="Penerbangan ${rowCountLabel}: Ke">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="search-box-item py-2 px-3 border rounded-3 bg-white" style="min-height: 58px; display: flex; flex-direction: column; justify-content: center;">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-calendar text-primary me-2"></i>
                            <input type="text" class="form-control form-control-sm border-0 p-0 fw-bold lazy-date shadow-none bg-transparent" placeholder="Tanggal">
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-6">
                    <button class="btn btn-outline-danger btn-sm w-100 remove-row rounded-3 d-flex align-items-center justify-content-center" style="height: 58px;"><i class="bi bi-trash3"></i> Hapus</button>
                </div>
            `;
            multiCityContainer.appendChild(newRow);
            
            newRow.querySelectorAll(".autocomplete-input").forEach(input => setupTravelAutocomplete(input));
            const newDateInput = newRow.querySelector(".lazy-date");
            newDateInput.addEventListener("mouseover", loadFlatpickr);
            newDateInput.addEventListener("focus", loadFlatpickr);
            newDateInput.addEventListener("click", loadFlatpickr);
            newDateInput.addEventListener("touchstart", loadFlatpickr, { passive: true });

            updateMultiCityButtons();
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.closest(".remove-row")) {
            e.target.closest(".multicity-row").remove();
            updateMultiCityButtons();
        }
    });

    updateMultiCityButtons();
    updateFlightSummaries();
});