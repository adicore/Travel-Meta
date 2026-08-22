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
                const flightOriginInput = document.getElementById("flightOrigin");
                const val = `${userOriginName} (${userOrigin})`;
                if(flightOriginInput) flightOriginInput.value = val;
            }
            const bestDeals = document.getElementById('best-deals');
            if(bestDeals) apiObserver.observe(bestDeals);
        })
        .catch(() => {
            const flightOriginInput = document.getElementById("flightOrigin");
            const val = "Jakarta (CGK)";
            if(flightOriginInput) flightOriginInput.value = val;
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

    // =========================================================================
    // UPDATE PASSENGER STATES & LIMITS (FLIGHTS & MULTI-CITY)
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

    function updateAllSummaries() {
        validateAndUpdatePassengers('flightAdult', 'flightChild', 'flightInfant', '.travelers-summary-text:not(.mc-travelers-summary)');
        validateAndUpdatePassengers('mcAdult', 'mcChild', 'mcInfant', '.mc-travelers-summary');

        // 3. Hotel Summary & Limits (Max: 10 Rooms, 20 Adults, 20 Children)
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

            if (incRoom) incRoom.disabled = (rooms >= 10);
            if (decRoom) decRoom.disabled = (rooms <= 1);
            if (incHAdult) incHAdult.disabled = (adults >= 20);
            if (decHAdult) decHAdult.disabled = (adults <= 1);
            if (incHChild) incHChild.disabled = (children >= 20);
            if (decHChild) decHChild.disabled = (children <= 0);
        }

        // 4. Tour Summary & Limits (Max: 10 Persons)
        const tourAdultInput = document.getElementById("tourAdult");
        if (tourAdultInput) {
            const a = parseInt(tourAdultInput.value) || 1;
            const sum = document.getElementById("tourSummaryText");
            if (sum) sum.textContent = `${a} Persons`;

            const incTour = document.querySelector('.increase-count[data-target="tourAdult"]');
            const decTour = document.querySelector('.decrease-count[data-target="tourAdult"]');
            if (incTour) incTour.disabled = (a >= 10);
            if (decTour) decTour.disabled = (a <= 1);
        }

        // 5. Experience Summary & Limits (Max: 10 Persons)
        const expAdultInput = document.getElementById("expAdult");
        if (expAdultInput) {
            const a = parseInt(expAdultInput.value) || 1;
            const sum = document.getElementById("expSummaryText");
            if (sum) sum.textContent = `${a} Persons`;

            const incExp = document.querySelector('.increase-count[data-target="expAdult"]');
            const decExp = document.querySelector('.decrease-count[data-target="expAdult"]');
            if (incExp) incExp.disabled = (a >= 10);
            if (decExp) decExp.disabled = (a <= 1);
        }
    }

    document.querySelectorAll('.cabin-option').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cabinClassDropdownBtn').textContent = e.target.getAttribute('data-cabin');
        });
    });

    // =========================================================================
    // FLATPICKR LAZY LOADER & INISIALISASI TANGGAL (AMAN DARI RESET)
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

    // TOGGLE ONE-WAY & ROUNDTRIP DYNAMIC VIEW
    const oneWayTabBtn = document.getElementById('oneWayTabBtn');
    const roundTripTabBtn = document.getElementById('roundTripTabBtn');
    const flightDepCol = document.getElementById('flightDepCol');
    const flightReturnCol = document.getElementById('flightReturnCol');
    const flightRouteCol = document.getElementById('flightRouteCol');
    const flightTravelersCol = document.getElementById('flightTravelersCol');

    if (oneWayTabBtn && roundTripTabBtn && flightReturnCol) {
        oneWayTabBtn.addEventListener('click', () => {
            flightDepCol.className = 'col-lg-4 col-md-12';
            flightReturnCol.className = 'd-none';
        });

        roundTripTabBtn.addEventListener('click', () => {
            flightDepCol.className = 'col-lg-2 col-md-12';
            flightReturnCol.classList.remove('d-none');
            flightReturnCol.className = 'col-lg-2 col-md-12';
        });
    }

    function initFlatpickrElements() {
        const isMobile = window.innerWidth <= 768;
        
        const commonDateConfig = {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "j M Y",
            minDate: "today",
            allowInput: !isMobile, 
            disableMobile: true
        };

        const flightDepEl = document.getElementById('flightDepDate');
        const flightRetEl = document.getElementById('flightRetDate');
        const hotelInEl = document.getElementById('hotelCheckIn');
        const hotelOutEl = document.getElementById('hotelCheckOut');
        const pickupEl = document.getElementById('carPickupDate');
        const dropoffEl = document.getElementById('carDropoffDate');

        // 1. Validasi Tanggal Penerbangan (Departure & Return)
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

        if (flightRetEl && !flightRetEl._flatpickr) {
            flatpickr(flightRetEl, commonDateConfig);
        }

        // 2. Validasi Hotel (Check-in & Check-out)
        if (hotelInEl && !hotelInEl._flatpickr) {
            flatpickr(hotelInEl, {
                ...commonDateConfig,
                onChange: function(selectedDates, dateStr) {
                    if (hotelOutEl && hotelOutEl._flatpickr && dateStr) {
                        hotelOutEl._flatpickr.set("minDate", dateStr);
                        const currentOut = hotelOutEl._flatpickr.selectedDates[0];
                        if (currentOut && currentOut < selectedDates[0]) {
                            hotelOutEl._flatpickr.setDate(dateStr, true);
                        }
                    }
                }
            });
        }
        if (hotelOutEl && !hotelOutEl._flatpickr) {
            flatpickr(hotelOutEl, commonDateConfig);
        }

        // 3. Validasi Rental Mobil (Pick-up & Drop-off)
        if (pickupEl && !pickupEl._flatpickr) {
            flatpickr(pickupEl, {
                dateFormat: "Y-m-d", minDate: "today", allowInput: !isMobile, disableMobile: true,
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
        if (dropoffEl && !dropoffEl._flatpickr) {
            flatpickr(dropoffEl, commonDateConfig);
        }

        // 4. Time Picker
        flatpickr(".flatpickr-time:not(.flatpickr-input)", { 
            enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, 
            allowInput: !isMobile, defaultHour: 10, defaultMinute: 0, disableMobile: true,
            onOpen: function(selectedDates, dateStr, instance) {
                instance.calendarContainer.classList.add('custom-time-ui');
            }
        });

        // 5. Kalender Umum / Lazy-date (PENTING: Cek !input._flatpickr agar tidak mereset tanggal yang sudah terisi)
        document.querySelectorAll(".lazy-date:not(#flightDepDate):not(#flightRetDate):not(#hotelCheckIn):not(#hotelCheckOut)").forEach(input => {
            if (!input._flatpickr) {
                flatpickr(input, commonDateConfig);
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

    // COUNTER DELEGATION (Flights, Hotels, Tours, Exp)
    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            if (incBtn.disabled) return;

            const targetId = incBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                let val = parseInt(input.value) || 0;

                // Validasi Batas Penerbangan (Flights & Multi-City)
                if (targetId.startsWith('flight') || targetId.startsWith('mc')) {
                    const isMC = targetId.startsWith('mc');
                    const adultIn = document.getElementById(isMC ? 'mcAdult' : 'flightAdult');
                    const childIn = document.getElementById(isMC ? 'mcChild' : 'flightChild');
                    const infantIn = document.getElementById(isMC ? 'mcInfant' : 'flightInfant');

                    if (adultIn && childIn && infantIn) {
                        const adults = parseInt(adultIn.value) || 1;
                        const children = parseInt(childIn.value) || 0;
                        const infants = parseInt(infantIn.value) || 0;
                        const total = adults + children + infants;

                        if (total >= 9) return;
                        if (targetId.includes('Infant') && infants >= adults) return;
                    }
                }

                // Validasi Hotel, Tour, Experience
                if (targetId === "hotelRoom" && val >= 10) return;
                if ((targetId === "hotelAdult" || targetId === "hotelChild") && val >= 20) return;
                if ((targetId === "tourAdult" || targetId === "expAdult") && val >= 10) return;

                input.value = val + 1;
                updateAllSummaries();
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
                let minValue = (targetId.includes('Adult') || targetId.includes('Room')) ? 1 : 0;

                if (targetId.startsWith('flight') || targetId.startsWith('mc')) {
                    if (targetId.includes('Adult')) {
                        const isMC = targetId.startsWith('mc');
                        const adultIn = document.getElementById(isMC ? 'mcAdult' : 'flightAdult');
                        const infantIn = document.getElementById(isMC ? 'mcInfant' : 'flightInfant');
                        const adults = parseInt(adultIn.value) || 1;
                        const infants = parseInt(infantIn.value) || 0;
                        if (adults <= 1 || adults - 1 < infants) return;
                    }
                }

                if (val > minValue) {
                    input.value = val - 1;
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
    updateAllSummaries();

    document.querySelectorAll(".search-action-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Mencari data secara real-time...");
        });
    });

    // FITUR TOGGLE: "DROP CAR OFF AT DIFFERENT LOCATION"
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
                dropoffCol.classList.remove('dropoff-hidden'); 
                if (dropoffInput) dropoffInput.setAttribute('required', 'true');
            } else {
                pickupCol.classList.remove('col-md-6');
                pickupCol.classList.add('col-12'); 
                dropoffCol.classList.add('dropoff-hidden'); 
                if (dropoffInput) {
                    dropoffInput.removeAttribute('required');
                    dropoffInput.value = '';
                }
            }
        });
    }
});