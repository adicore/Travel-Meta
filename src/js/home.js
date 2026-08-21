document.addEventListener("DOMContentLoaded", () => {
    const PROXY_WORKER_URL = "https://api.pesan.workers.dev/";
    let userOrigin = "SIN"; 
    let userOriginName = "Singapore";
    let visitorCurrency = "USD";

    const currencyMapping = {
        "AB":"RUB","AD":"EUR","AE":"AED","AF":"AFN","AG":"XCD","AI":"XCD","AL":"ALL","AM":"AMD","AO":"AOA","AQ":"","AR":"ARS","AS":"USD","AT":"EUR","AU":"AUD","AW":"AWG","AX":"EUR","AZ":"AZN","BA":"BAM","BB":"BBD","BD":"BDT","BE":"EUR","BF":"XOF","BG":"EUR","BH":"BHD","BI":"BIF","BJ":"XOF","BL":"EUR","BM":"BMD","BN":"BND","BO":"BOB","BQ":"USD","BR":"BRL","BS":"BSD","BT":"BTN","BV":"NOK","BW":"BWP","BY":"BYN","BZ":"BZD","CA":"CAD","CC":"AUD","CD":"CDF","CF":"XAF","CG":"XAF","CH":"CHF","CI":"XOF","CK":"NZD","CL":"CLP","CM":"XAF","CN":"CNY","CO":"COP","CR":"CRC","CU":"CUP","CV":"CVE","CW":"XCG","CX":"AUD","CY":"EUR","CZ":"CZK","DE":"EUR","DJ":"DJF","DK":"DKK","DM":"XCD","DO":"DOP","DZ":"DZD","EC":"USD","EE":"EUR","EG":"EGP","EH":"MAD","ER":"ERN","ES":"EUR","ET":"ETB","FI":"EUR","FJ":"FJD","FK":"FKP","FM":"USD","FO":"DKK","FR":"EUR","GA":"XAF","GB":"GBP","GD":"XCD","GE":"GEL","GF":"EUR","GG":"GBP","GH":"GHS","GI":"GIP","GL":"DKK","GM":"GMD","GN":"GNF","GP":"EUR","GQ":"XAF","GR":"EUR","GS":"GBP","GT":"GTQ","GU":"USD","GW":"XOF","GY":"GYD","HK":"HKD","HM":"AUD","HN":"HNL","HR":"EUR","HT":"HTG","HU":"HUF","ID":"IDR","IE":"EUR","IL":"ILS","IM":"GBP","IN":"INR","IO":"USD","IQ":"IQD","IR":"IRR","IS":"ISK","IT":"EUR","JE":"GBP","JM":"JMD","JO":"JOD","JP":"JPY","KE":"KES","KG":"KGS","KH":"KHR","KI":"AUD","KM":"KMF","KN":"XCD","KP":"KPW","KR":"KRW","KW":"KWD","KX":"","KY":"KYD","KZ":"KZT","LA":"LAK","LB":"LBP","LC":"XCD","LI":"CHF","LK":"LKR","LR":"LRD","LS":"LSL","LT":"EUR","LU":"EUR","LV":"EUR","LY":"LYD","MA":"MAD","MC":"EUR","MD":"MDL","ME":"EUR","MF":"EUR","MG":"MGA","MH":"USD","MK":"MKD","ML":"XOF","MM":"MMK","MN":"MNT","MO":"MOP","MP":"USD","MQ":"EUR","MR":"MRO","MS":"XCD","MT":"EUR","MU":"MUR","MV":"MVR","MW":"MWK","MX":"MXN","MY":"MYR","MZ":"MZN","NA":"NAD","NC":"XPF","NE":"XOF","NF":"AUD","NG":"NGN","NI":"NIO","NL":"EUR","NO":"NOK","NP":"NPR","NR":"AUD","NU":"NZD","NY":"TRY","NZ":"NZD","OM":"OMR","PA":"PAB","PE":"PEN","PF":"XPF","PG":"PGK","PH":"PHP","PK":"PKR","PL":"PLN","PM":"EUR","PN":"NZD","PR":"USD","PS":"ILS","PT":"EUR","PW":"USD","PY":"PYG","QA":"QAR","RE":"EUR","RO":"RON","RS":"RSD","RU":"RUB","RW":"RWF","SA":"SAR","SB":"SBD","SC":"SCR","SD":"SDG","SE":"SEK","SG":"SGD","SH":"SHP","SI":"EUR","SJ":"NOK","SK":"EUR","SL":"SLL","SM":"EUR","SN":"XOF","SO":"SOS","SR":"SRD","SS":"SSP","ST":"STD","SV":"USD","SX":"XCG","SY":"SYP","SZ":"SZL","TC":"USD","TD":"XAF","TF":"EUR","TG":"XOF","TH":"THB","TJ":"TJS","TK":"NZD","TL":"USD","TM":"TMT","TN":"TND","TO":"TOP","TR":"TRY","TT":"TTD","TV":"AUD","TW":"TWD","TZ":"TZS","UA":"UAH","UG":"UGX","UM":"USD","US":"USD","UY":"UYU","UZ":"UZS","VA":"EUR","VC":"XCD","VE":"VEF","VG":"USD","VI":"USD","VN":"VND","VU":"VUV","WF":"XPF","WS":"WST","XK":"EUR","YER":"YER","YT":"EUR","ZA":"ZAR","ZM":"ZMK","ZW":"ZWL"
    };

    const continentDestinations = {
        'dealAmerica': [{ code: 'NYC', name: 'New York' }, { code: 'LAX', name: 'Los Angeles' }, { code: 'MIA', name: 'Miami' }, { code: 'YYZ', name: 'Toronto' }, { code: 'CUN', name: 'Cancun' }, { code: 'GRU', name: 'Sao Paulo' }],
        'dealEurope': [{ code: 'PAR', name: 'Paris' }, { code: 'LON', name: 'London' }, { code: 'ROM', name: 'Rome' }, { code: 'AMS', name: 'Amsterdam' }, { code: 'BCN', name: 'Barcelona' }, { code: 'BER', name: 'Berlin' }],
        'dealAsia': [{ code: 'BKK', name: 'Bangkok' }, { code: 'SIN', name: 'Singapore' }, { code: 'TYO', name: 'Tokyo' }, { code: 'ICN', name: 'Seoul' }, { code: 'KUL', name: 'Kuala Lumpur' }, { code: 'TPE', name: 'Taipei' }],
        'dealAfrica': [{ code: 'CPT', name: 'Cape Town' }, { code: 'JNB', name: 'Johannesburg' }, { code: 'CAI', name: 'Cairo' }, { code: 'CMN', name: 'Casablanca' }, { code: 'NBO', name: 'Nairobi' }, { code: 'MRU', name: 'Mauritius' }],
        'dealMiddleEast': [{ code: 'DXB', name: 'Dubai' }, { code: 'DOH', name: 'Doha' }, { code: 'IST', name: 'Istanbul' }, { code: 'AUH', name: 'Abu Dhabi' }, { code: 'TLV', name: 'Tel Aviv' }, { code: 'RUH', name: 'Riyadh' }]
    };

    // SET DEFAULT DATE +3 DAYS
    (function setInitialDates() {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        const yyyy = defaultDate.getFullYear();
        const mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
        const dd = String(defaultDate.getDate()).padStart(2, '0');
        const defaultDateStr = `${yyyy}-${mm}-${dd}`;
        
        const owDepDate = document.getElementById("owDepDate");
        const rtDepDate = document.getElementById("rtDepDate");
        if (owDepDate) owDepDate.value = defaultDateStr;
        if (rtDepDate) rtDepDate.value = defaultDateStr;
    })();

    // WHEREAMI API & CONTINENT DEALS
    let apiLoaded = false;
    const apiObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !apiLoaded) {
                apiLoaded = true;
                const container = document.querySelector('#dealAmerica .flight-results-container');
                fetchContinentDeals('dealAmerica', container);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px 250px 0px" });

    fetch("https://www.apistp.com/whereami?locale=en")
        .then(res => res.json())
        .then(locData => {
            if(locData) {
                userOrigin = locData.code || locData.iata || "SIN";
                userOriginName = locData.city || locData.name || userOrigin;
                const countryCode = locData.country || locData.country_code || "";
                if (countryCode && currencyMapping[countryCode]) {
                    visitorCurrency = currencyMapping[countryCode];
                }
                const owOriginInput = document.getElementById("owOrigin");
                const rtOriginInput = document.getElementById("rtOrigin");
                const val = `${userOriginName} (${userOrigin})`;
                if(owOriginInput) owOriginInput.value = val;
                if(rtOriginInput) rtOriginInput.value = val;
            }
            const bestDeals = document.getElementById('best-deals');
            if(bestDeals) apiObserver.observe(bestDeals);
        })
        .catch(() => {
            const owOriginInput = document.getElementById("owOrigin");
            const rtOriginInput = document.getElementById("rtOrigin");
            const val = "Singapore (SIN)";
            if(owOriginInput) owOriginInput.value = val;
            if(rtOriginInput) rtOriginInput.value = val;
            const bestDeals = document.getElementById('best-deals');
            if(bestDeals) apiObserver.observe(bestDeals);
        });

    function fetchContinentDeals(continentKey, containerEl) {
        if(!containerEl) return;
        const cities = continentDestinations[continentKey];
        if(!cities) return;

        let skeletonHtml = '';
        for(let i=0; i<6; i++) {
            skeletonHtml += `
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div class="skeleton skeleton-img-box"></div>
                        <div class="card-body p-4">
                            <div class="skeleton skeleton-text short mb-3"></div>
                            <div class="skeleton skeleton-text mb-2"></div>
                            <div class="skeleton skeleton-text short mb-4"></div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="skeleton skeleton-text w-25 mb-0"></div>
                                <div class="skeleton skeleton-text w-25 mb-0 rounded-pill" style="height: 35px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        containerEl.innerHTML = skeletonHtml;

        let promises = cities.map(city => {
            const proxyUrl = `${PROXY_WORKER_URL}?origin=${userOrigin}&destination=${city.code}&unique=true&sorting=price&currency=${visitorCurrency}&page=1&one_way=false`;
            return fetch(proxyUrl)
                .then(res => res.json())
                .then(resData => {
                    let priceText = "Cek Harga";
                    let datesText = "Jadwal Fleksibel";
                    if(resData && resData.data && resData.data.length > 0) {
                        const flightInfo = resData.data[0];
                        if(flightInfo.price) priceText = `${visitorCurrency} ${Number(flightInfo.price).toLocaleString()}`;
                        if(flightInfo.departure_at && flightInfo.return_at) {
                            datesText = `${flightInfo.departure_at.split('T')[0]} ➔ ${flightInfo.return_at.split('T')[0]}`;
                        }
                    }
                    return { code: city.code, name: city.name, imgUrl: `https://zen.wego.com/cdn-cgi/image/height=280/destinations/cities/${city.code}.jpg`, priceText, datesText };
                })
                .catch(() => ({ code: city.code, name: city.name, imgUrl: `https://zen.wego.com/cdn-cgi/image/height=280/destinations/cities/${city.code}.jpg`, priceText: "Cek Harga", datesText: "Cek Jadwal" }));
        });

        Promise.all(promises).then(results => {
            let htmlContent = "";
            results.forEach(item => {
                htmlContent += `
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 overflow-hidden card-hover bg-white">
                            <div class="image-shimmer-effect" style="height: 200px;">
                                <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="${item.imgUrl}" width="600" height="280" class="lazyload lazy-effect" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'" fetchpriority="low">
                            </div>
                            <div class="card-body p-4">
                                <span class="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-1 rounded-pill fw-semibold"><i class="bi bi-calendar3 me-1"></i> ${item.datesText}</span>
                                <h5 class="fw-bold text-dark text-truncate">${userOriginName} ➔ ${item.name}</h5>
                                <p class="text-muted small mb-3">Round-Trip • Bagasi Termasuk</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-danger fw-bold fs-5">${item.priceText}</span>
                                    <button class="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 fw-semibold">Pesan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            containerEl.innerHTML = htmlContent;
        });
    }

    document.querySelectorAll('#flightDealsTab button').forEach(tab => {
        tab.addEventListener('shown.bs.tab', (e) => {
            const continentKey = e.target.getAttribute('data-continent');
            const targetPaneSelector = e.target.getAttribute('data-bs-target');
            const paneEl = document.querySelector(targetPaneSelector + ' .flight-results-container');
            if(paneEl && paneEl.children.length <= 1) fetchContinentDeals(continentKey, paneEl);
        });
    });

    // AUTOCOMPLETE & INPUT SYNCHRONIZATION
    const owOrigin = document.getElementById('owOrigin');
    const owDest = document.getElementById('owDest');
    const rtOrigin = document.getElementById('rtOrigin');
    const rtDest = document.getElementById('rtDest');

    [owOrigin, rtOrigin].forEach(el => {
        if(el) el.addEventListener('input', (e) => {
            const target = e.target === owOrigin ? rtOrigin : owOrigin;
            if(target) target.value = e.target.value;
        });
    });
    [owDest, rtDest].forEach(el => {
        if(el) el.addEventListener('input', (e) => {
            const target = e.target === owDest ? rtDest : owDest;
            if(target) target.value = e.target.value;
        });
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
                                if (input.id === 'owOrigin' && rtOrigin) rtOrigin.value = input.value;
                                if (input.id === 'rtOrigin' && owOrigin) owOrigin.value = input.value;
                                if (input.id === 'owDest' && rtDest) rtDest.value = input.value;
                                if (input.id === 'rtDest' && owDest) owDest.value = input.value;
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
                if(inputs[0].id === 'owOrigin' || inputs[0].id === 'rtOrigin') {
                    if(owOrigin && rtOrigin) owOrigin.value = rtOrigin.value = inputs[0].value;
                    if(owDest && rtDest) owDest.value = rtDest.value = inputs[1].value;
                }
            }
        });
    });

    // ALL SUMMARIES (Flights, Hotels, Tours, Exp)
    function updateAllSummaries() {
        const flightAdult = document.getElementById("flightAdult");
        const adults = flightAdult ? (parseInt(flightAdult.value) || 1) : 1;
        const kids = parseInt(document.getElementById("flightChild")?.value) || 0;
        const infants = parseInt(document.getElementById("flightInfant")?.value) || 0;
        const totalKids = kids + infants;

        document.querySelectorAll(".travelers-summary-text, .mc-travelers-summary").forEach(el => {
            el.textContent = totalKids > 0 ? `${adults} Adult, ${totalKids} Child` : `${adults} Adult, 0 Child`;
        });

        // Hotel Summary
        const hotelRoom = document.getElementById("hotelRoom");
        if (hotelRoom) {
            const rooms = parseInt(hotelRoom.value) || 1;
            const guests = (parseInt(document.getElementById("hotelAdult")?.value) || 2) + (parseInt(document.getElementById("hotelChild")?.value) || 0);
            const summary = document.getElementById("hotelSummaryText");
            if (summary) summary.textContent = `${rooms} Room, ${guests} Guests`;
        }

        // Tour Summary
        const tourAdult = document.getElementById("tourAdult");
        if (tourAdult) {
            const a = parseInt(tourAdult.value) || 2;
            const sum = document.getElementById("tourSummaryText");
            if (sum) sum.textContent = `${a} Persons`;
        }

        // Experience Summary
        const expAdult = document.getElementById("expAdult");
        if (expAdult) {
            const a = parseInt(expAdult.value) || 2;
            const sum = document.getElementById("expSummaryText");
            if (sum) sum.textContent = `${a} Persons`;
        }
    }

    document.querySelectorAll('.cabin-option').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cabinClassDropdownBtn').textContent = e.target.getAttribute('data-cabin');
        });
    });

    // =========================================================================
    // FLATPICKR LAZY LOADER (Dengan Validasi Pick-up/Drop-off & Custom Time UI)
    // =========================================================================
    let flatpickrLoaded = false;
    let pickupDateInstance, dropoffDateInstance; // Variabel penyimpan memori kalender

    const loadFlatpickr = () => {
        if (flatpickrLoaded) {
            if (typeof flatpickr !== 'undefined') {
                initFlatpickrElements();
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
            initFlatpickrElements();
        };
        document.body.appendChild(script);
    };

    function initFlatpickrElements() {
        // Deteksi apakah pengguna sedang menggunakan HP (layar kecil)
        const isMobile = window.innerWidth <= 768;

        // 1. Kalender default untuk bagian penerbangan/hotel
        flatpickr(".lazy-date:not(.flatpickr-input)", { 
            dateFormat: "Y-m-d", 
            altInput: true, 
            altFormat: "j M Y",
            disableMobile: true // PENTING: Tanpa tanda kutip
        }); 

        // 2. Kalender Pick-up Date
        const pickupEl = document.getElementById('carPickupDate');
        if (pickupEl && !pickupEl.classList.contains('flatpickr-input')) {
            pickupDateInstance = flatpickr(pickupEl, {
                dateFormat: "Y-m-d",
                minDate: "today",
                allowInput: !isMobile, // Izinkan ketik di PC, tapi larang di HP agar keyboard tidak muncul!
                disableMobile: true,   // PENTING: Tanpa tanda kutip
                onChange: function(selectedDates, dateStr, instance) {
                    if (dropoffDateInstance) dropoffDateInstance.set("minDate", dateStr);
                }
            });
        }

        // 3. Kalender Drop-off Date
        const dropoffEl = document.getElementById('carDropoffDate');
        if (dropoffEl && !dropoffEl.classList.contains('flatpickr-input')) {
            dropoffDateInstance = flatpickr(dropoffEl, {
                dateFormat: "Y-m-d",
                minDate: "today",
                allowInput: !isMobile, 
                disableMobile: true    
            });
        }

        // 4. Dropdown Waktu (Dengan gaya khusus saat dibuka)
        flatpickr(".flatpickr-time:not(.flatpickr-input)", { 
            enableTime: true, 
            noCalendar: true, 
            dateFormat: "H:i", 
            time_24hr: true, 
            allowInput: !isMobile, 
            defaultHour: 10, 
            defaultMinute: 0, 
            disableMobile: true,
            onOpen: function(selectedDates, dateStr, instance) {
                instance.calendarContainer.classList.add('custom-time-ui');
            }
        });
    }

    // Pemicu (Event Listeners)
    document.querySelectorAll(".lazy-date, .flatpickr-date, .flatpickr-time").forEach(input => {
        input.addEventListener("mouseover", loadFlatpickr);
        input.addEventListener("focus", loadFlatpickr);
        input.addEventListener("click", loadFlatpickr);
        input.addEventListener("touchstart", loadFlatpickr, { passive: true });
    });

    // DELEGATION FOR ALL COUNTERS (Flights, Hotels, Tours, etc.)
    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            const targetId = incBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                const newVal = parseInt(input.value) + 1;
                let type = '';
                if (targetId.includes('Adult')) type = 'Adult';
                if (targetId.includes('Child')) type = 'Child';
                if (targetId.includes('Infant')) type = 'Infant';
                
                if (type && targetId.startsWith('flight') || targetId.startsWith('rt') || targetId.startsWith('mc')) {
                    document.querySelectorAll(`input[id*="Adult"], input[id*="Child"], input[id*="Infant"]`).forEach(el => {
                        if ((el.id.startsWith('flight') || el.id.startsWith('rt') || el.id.startsWith('mc')) && el.id.includes(type)) {
                            el.value = newVal;
                        }
                    });
                } else {
                    input.value = newVal;
                }
                updateAllSummaries();
            }
            return;
        }
        
        const decBtn = e.target.closest('.decrease-count');
        if (decBtn) {
            e.preventDefault(); e.stopPropagation();
            const targetId = decBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                let minValue = (targetId.includes('Adult') || targetId.includes('Room')) ? 1 : 0;
                if (parseInt(input.value) > minValue) {
                    const newVal = parseInt(input.value) - 1;
                    let type = '';
                    if (targetId.includes('Adult')) type = 'Adult';
                    if (targetId.includes('Child')) type = 'Child';
                    if (targetId.includes('Infant')) type = 'Infant';
                    
                    if (type && (targetId.startsWith('flight') || targetId.startsWith('rt') || targetId.startsWith('mc'))) {
                        document.querySelectorAll(`input[id*="Adult"], input[id*="Child"], input[id*="Infant"]`).forEach(el => {
                            if ((el.id.startsWith('flight') || el.id.startsWith('rt') || el.id.startsWith('mc')) && el.id.includes(type)) {
                                el.value = newVal;
                            }
                        });
                    } else {
                        input.value = newVal;
                    }
                    updateAllSummaries();
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

    // MULTI-CITY ROWS
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
        addFlightBtn.addEventListener("click", () => {
            const rows = multiCityContainer.querySelectorAll(".multicity-row");
            if (rows.length >= 4) return;

            const currentAdult = document.getElementById('flightAdult')?.value || "1";
            const currentChild = document.getElementById('flightChild')?.value || "0";
            const currentInfant = document.getElementById('flightInfant')?.value || "0";
            const totalKids = parseInt(currentChild) + parseInt(currentInfant);
            const summaryText = totalKids > 0 ? `${currentAdult} Adult, ${totalKids} Child` : `${currentAdult} Adult, 0 Child`;
            const uniqueId = Date.now();
            const rowCountLabel = rows.length + 1;
            
            const newRow = document.createElement("div");
            newRow.className = "row g-2 mb-2 multicity-row align-items-center";
            newRow.innerHTML = `
                <div class="col-lg-5 col-md-12">
                    <div class="search-box-item">
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
                <div class="col-lg-3 col-md-6">
                    <div class="search-box-item">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-calendar text-primary me-2"></i>
                            <input type="text" class="form-control form-control-sm border-0 p-0 fw-bold lazy-date shadow-none bg-transparent" placeholder="Tanggal">
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-6">
                    <div class="dropdown w-100">
                        <div class="search-box-item cursor-pointer" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                            <div class="text-muted small mb-1"><i class="bi bi-person text-primary me-1"></i> Passengers</div>
                            <div class="fw-bold small text-dark travelers-summary-text mc-travelers-summary">${summaryText}</div>
                        </div>
                        <div class="dropdown-menu p-3 shadow-lg border-0 rounded-4 w-100" style="min-width: 250px;">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="small">Dewasa</span>
                                <div class="input-group input-group-sm w-50">
                                    <button class="btn btn-outline-secondary decrease-count" type="button" data-target="mcAdult${uniqueId}">-</button>
                                    <input type="text" id="mcAdult${uniqueId}" class="form-control text-center fw-bold mc-input mc-adult bg-white" value="${currentAdult}" readonly>
                                    <button class="btn btn-outline-secondary increase-count" type="button" data-target="mcAdult${uniqueId}">+</button>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="small">Anak</span>
                                <div class="input-group input-group-sm w-50">
                                    <button class="btn btn-outline-secondary decrease-count" type="button" data-target="mcChild${uniqueId}">-</button>
                                    <input type="text" id="mcChild${uniqueId}" class="form-control text-center fw-bold mc-input mc-child bg-white" value="${currentChild}" readonly>
                                    <button class="btn btn-outline-secondary increase-count" type="button" data-target="mcChild${uniqueId}">+</button>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="small">Bayi</span>
                                <div class="input-group input-group-sm w-50">
                                    <button class="btn btn-outline-secondary decrease-count" type="button" data-target="mcInfant${uniqueId}">-</button>
                                    <input type="text" id="mcInfant${uniqueId}" class="form-control text-center fw-bold mc-input mc-infant bg-white" value="${currentInfant}" readonly>
                                    <button class="btn btn-outline-secondary increase-count" type="button" data-target="mcInfant${uniqueId}">+</button>
                                </div>
                            </div>
                            <button class="btn btn-primary btn-sm w-100 apply-btn py-2 rounded-pill fw-bold" type="button">Terapkan</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-12">
                    <button class="btn btn-outline-danger btn-sm w-100 py-3 remove-row rounded-3" style="min-height: 72px;"><i class="bi bi-trash3"></i> Hapus</button>
                </div>
            `;
            multiCityContainer.appendChild(newRow);
            newRow.querySelectorAll(".autocomplete-input").forEach(input => setupTravelAutocomplete(input));
            
            const newDateInput = newRow.querySelector(".lazy-date");
            newDateInput.addEventListener("mouseover", loadFlatpickr);
            newDateInput.addEventListener("focus", loadFlatpickr);
            newDateInput.addEventListener("click", loadFlatpickr);
            newDateInput.addEventListener("touchstart", loadFlatpickr, { passive: true });
            loadFlatpickr();

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

    document.querySelectorAll(".search-action-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Mencari data secara real-time...");
        });
    });
});