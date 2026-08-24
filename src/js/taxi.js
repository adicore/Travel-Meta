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
    // 3. REGIONAL SETTINGS (MATA UANG & BAHASA) - LOCALSTORAGE
    // =========================================================================
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedLang = localStorage.getItem('selectedLanguage');

    if (savedCurrency) {
        document.querySelectorAll('#mobCurrText, #deskCurrText').forEach(el => { if (el) el.textContent = savedCurrency; });
        document.querySelectorAll('.currency-option').forEach(btn => {
            if (btn.textContent.split(' ')[0] === savedCurrency) {
                btn.classList.remove('btn-light');
                btn.classList.add('btn-outline-primary', 'active', 'border-2');
            } else {
                btn.classList.remove('btn-outline-primary', 'active', 'border-2');
                btn.classList.add('btn-light');
            }
        });
    }

    if (savedLang) {
        document.querySelectorAll('#mobLangText, #deskLangText').forEach(el => { if (el) el.textContent = savedLang; });
        document.querySelectorAll('.lang-option').forEach(btn => {
            const match = btn.textContent.match(/\(([^)]+)\)/);
            const code = match ? match[1] : btn.textContent;
            if (code === savedLang) {
                btn.classList.remove('btn-light');
                btn.classList.add('btn-outline-primary', 'active', 'border-2');
            } else {
                btn.classList.remove('btn-outline-primary', 'active', 'border-2');
                btn.classList.add('btn-light');
            }
        });
    }

    const currencyButtons = document.querySelectorAll('.currency-option');
    currencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            currencyButtons.forEach(btn => {
                btn.classList.remove('btn-outline-primary', 'active', 'border-2');
                btn.classList.add('btn-light');
            });
            this.classList.remove('btn-light');
            this.classList.add('btn-outline-primary', 'active', 'border-2');

            const selectedCurrency = this.textContent.split(' ')[0];
            localStorage.setItem('selectedCurrency', selectedCurrency);

            document.querySelectorAll('#mobCurrText, #deskCurrText').forEach(el => {
                if (el) el.textContent = selectedCurrency;
            });
        });
    });

    const langButtons = document.querySelectorAll('.lang-option');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            langButtons.forEach(btn => {
                btn.classList.remove('btn-outline-primary', 'active', 'border-2');
                btn.classList.add('btn-light');
            });
            this.classList.remove('btn-light');
            this.classList.add('btn-outline-primary', 'active', 'border-2');

            const match = this.textContent.match(/\(([^)]+)\)/);
            const selectedLang = match ? match[1] : this.textContent;

            localStorage.setItem('selectedLanguage', selectedLang);

            document.querySelectorAll('#mobLangText, #deskLangText').forEach(el => {
                if (el) el.textContent = selectedLang;
            });
        });
    });

});