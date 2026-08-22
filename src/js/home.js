document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. KONFIGURASI API, MATA UANG & BEST DEALS
    // =========================================================================
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

    // AUTOCOMPLETE & INPUT SYNCHRONIZATION (Dengan Lebar Diperbesar)
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
        const listContainer = document.createElement('ul');
        listContainer.className = 'autocomplete-list-' + (input.id || Math.random());
        
        listContainer.style.cssText = `position:absolute;background:#fff;z-index:9999999;border:1px solid #ccc;border-radius:4px;max-height:250px;overflow-y:auto;box-shadow:0 8px 16px rgba(0,0,0,0.2);list-style:none;padding:0;margin:0;display:none;`;
        
        document.body.appendChild(listContainer);

        const updateDropdownPosition = () => {
            const rect = input.getBoundingClientRect();
            listContainer.style.top = (rect.bottom + window.scrollY) + 'px';
            listContainer.style.left = (rect.left + window.scrollX) + 'px';
            // UPDATE: Memperlebar ukuran dropdown (minimal lebar 340px atau mengikuti lebar input jika lebih besar)
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

                                if (input.id === 'owOrigin' && rtOrigin) rtOrigin.value = input.value;
                                if (input.id === 'rtOrigin' && owOrigin) owOrigin.value = input.value;
                                if (input.id === 'owDest' && rtDest) rtDest.value = input.value;
                                if (input.id === 'rtDest' && owDest) owDest.value = input.value;
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
    // 3. LOGIKA ATURAN BATASAN PENUMPANG
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

    document.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.increase-count');
        if (incBtn) {
            e.preventDefault(); e.stopPropagation();
            if (incBtn.disabled) return;

            const targetId = incBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                let val = parseInt(input.value) || 0;

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

    // =========================================================================
    // 4. FLATPICKR LOADER & INISIALISASI ASLI (DENGAN data-fp-initialized)
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

    const oneWayTabBtn = document.getElementById('oneWayTabBtn');
    const roundTripTabBtn = document.getElementById('roundTripTabBtn');
    const flightDepCol = document.getElementById('flightDepCol');
    const flightReturnCol = document.getElementById('flightReturnCol');

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
            dateFormat: "Y-m-d", altInput: true, altFormat: "j M Y",
            minDate: "today", allowInput: !isMobile, disableMobile: true
        };

        const flightDepEl = document.getElementById('flightDepDate');
        const flightRetEl = document.getElementById('flightRetDate');
        const hotelInEl = document.getElementById('hotelCheckIn');
        const hotelOutEl = document.getElementById('hotelCheckOut');
        const pickupEl = document.getElementById('carPickupDate');
        const dropoffEl = document.getElementById('carDropoffDate');

        // Untuk elemen ID statis, hapus class lazy-date sebelum dieksekusi 
        if (flightDepEl && !flightDepEl._flatpickr) {
            flightDepEl.classList.remove("lazy-date");
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
            flightRetEl.classList.remove("lazy-date");
            flatpickr(flightRetEl, commonDateConfig);
        }
        if (hotelInEl && !hotelInEl._flatpickr) {
            hotelInEl.classList.remove("lazy-date");
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
            hotelOutEl.classList.remove("lazy-date");
            flatpickr(hotelOutEl, commonDateConfig);
        }
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
        if (dropoffEl && !dropoffEl._flatpickr) {
            dropoffEl.classList.remove("lazy-date");
            flatpickr(dropoffEl, commonDateConfig);
        }
        
        document.querySelectorAll(".flatpickr-time:not(.flatpickr-input)").forEach(input => {
            if (!input._flatpickr) {
                flatpickr(input, { 
                    enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, 
                    allowInput: !isMobile, defaultHour: 10, defaultMinute: 0, disableMobile: true 
                });
            }
        });

        // =========================================================================
        // PENGAMAN ABSOLUT: Cabut ".lazy-date" agar Flatpickr tidak reset berulang!
        // =========================================================================
        document.querySelectorAll(".lazy-date").forEach(input => {
            // Kita menghapus class lazy-date TEPAT SEBELUM fungsi flatpickr dijalankan.
            // Hal ini memutus siklus duplikasi class pada input palsu yang dibuat plugin.
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

    // =========================================================================
    // 5. PENAMBAHAN BARIS MULTI-CITY
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
    updateAllSummaries();

    // =========================================================================
    // 6. RENTAL MOBIL (DROP-OFF LOKASI BERBEDA)
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