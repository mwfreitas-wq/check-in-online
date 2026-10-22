// =========================================================================
// CONTROLE DE ESTADO & REGRAS DE NEGÓCIO DA APLICAÇÃO
// =========================================================================

let isAdminAuthenticated = false;
let pendingAdminTargetView = 'admin';
let isStrictGuestMode = false;
let currentHotel = 'hit';
let currentLang = 'pt';
let currentOriginType = 'BR'; // 'BR' ou 'INT'

// Instâncias de Gráficos do Chart.js
let chartStatesInstance = null;
let chartCountriesInstance = null;
let chartChannelsInstance = null;
let chartHoursInstance = null;

// =========================================================================
// 1. TROCA DE HOTEL & TEMA
// =========================================================================
function switchHotel(hotelKey) {
    if (!HOTELS_CONFIG[hotelKey]) hotelKey = 'hit';
    currentHotel = hotelKey;
    const cfg = HOTELS_CONFIG[hotelKey];

    // Atualiza Hero e cores do formulário
    document.getElementById('hotel-hero').className = cfg.heroClass;
    document.getElementById('hotel-logo-icon').className = cfg.iconClass;
    document.getElementById('hotel-title').textContent = cfg.name;
    document.getElementById('hotel-location-text').textContent = cfg.location;
    document.getElementById('hotel-badge-tag').textContent = cfg.badge;
    document.getElementById('submit-checkin-btn').className = cfg.btnClass;

    // Atualiza botões da barra de simulação superior
    ['hit', 'salvador', 'ancoras'].forEach(k => {
        const btn = document.getElementById('sim-btn-' + k);
        if (!btn) return;
        if (k === hotelKey) {
            btn.className = 'px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1.5 bg-teal-500 text-slate-950 shadow';
        } else {
            btn.className = 'px-2.5 py-1 rounded-md font-medium transition flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300';
        }
    });
}

// =========================================================================
// 2. MODO HÓSPEDE LIMPO & ACESSO RESTRITO POR SENHA
// =========================================================================
function setStrictGuestModeUI(enabled) {
    isStrictGuestMode = enabled;
    const topBar = document.getElementById('top-admin-bar');
    const voucherAdminBtn = document.getElementById('voucher-admin-btn');

    // Regra de Ouro: a barra administrativa SÓ pode aparecer se o usuário estiver autenticado!
    if (enabled || !isAdminAuthenticated) {
        if (topBar) topBar.classList.add('hidden');
        if (voucherAdminBtn && isStrictGuestMode) voucherAdminBtn.classList.add('hidden');
    } else {
        if (topBar) topBar.classList.remove('hidden');
        if (voucherAdminBtn) voucherAdminBtn.classList.remove('hidden');
    }
}

function previewCleanGuestMode() {
    switchMainView('guest');
    const topBar = document.getElementById('top-admin-bar');
    if (topBar) topBar.classList.add('hidden');
    document.getElementById('guest-preview-notice').classList.remove('hidden');
}

function exitCleanGuestPreview() {
    document.getElementById('guest-preview-notice').classList.add('hidden');
    if (isAdminAuthenticated) {
        const topBar = document.getElementById('top-admin-bar');
        if (topBar) topBar.classList.remove('hidden');
        switchMainView('admin');
    } else {
        requestAdminAccess('admin');
    }
}

function simulateGuestQrScan(hotelKey) {
    switchHotel(hotelKey);
    previewCleanGuestMode();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function requestAdminAccess(targetView) {
    if (isAdminAuthenticated) {
        const topBar = document.getElementById('top-admin-bar');
        if (topBar) topBar.classList.remove('hidden');
        document.getElementById('guest-preview-notice').classList.add('hidden');
        switchMainView(targetView || 'admin');
        return;
    }
    pendingAdminTargetView = targetView || 'admin';
    const modal = document.getElementById('password-modal');
    const input = document.getElementById('admin-password-input');
    const err = document.getElementById('password-error-msg');
    err.classList.add('hidden');
    input.value = '';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => input.focus(), 80);
}

function closePasswordModal() {
    const modal = document.getElementById('password-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function verifyAdminPassword(e) {
    e.preventDefault();
    const inputVal = (document.getElementById('admin-password-input').value || '').trim().toLowerCase();
    if (inputVal === (typeof ADMIN_PASSWORD !== 'undefined' ? ADMIN_PASSWORD : 'master')) {
        isAdminAuthenticated = true;
        closePasswordModal();
        
        const topBar = document.getElementById('top-admin-bar');
        if (topBar) topBar.classList.remove('hidden');
        document.getElementById('guest-preview-notice').classList.add('hidden');

        const lockIcon = document.getElementById('admin-lock-icon');
        if (lockIcon) lockIcon.className = 'fa-solid fa-chart-pie text-slate-950';
        const logoutBtn = document.getElementById('btn-logout-admin');
        if (logoutBtn) logoutBtn.classList.remove('hidden');

        switchMainView(pendingAdminTargetView);
    } else {
        document.getElementById('password-error-msg').classList.remove('hidden');
    }
}

function lockAdminSession() {
    isAdminAuthenticated = false;
    const topBar = document.getElementById('top-admin-bar');
    if (topBar) topBar.classList.add('hidden');
    
    const lockIcon = document.getElementById('admin-lock-icon');
    if (lockIcon) lockIcon.className = 'fa-solid fa-lock text-amber-400';
    const logoutBtn = document.getElementById('btn-logout-admin');
    if (logoutBtn) logoutBtn.classList.add('hidden');

    document.getElementById('guest-preview-notice').classList.add('hidden');
    switchMainView('guest');
}

function switchMainView(viewName) {
    if ((viewName === 'admin' || viewName === 'qrcodes') && !isAdminAuthenticated) {
        requestAdminAccess(viewName);
        return;
    }

    const views = ['guest', 'admin', 'qrcodes'];
    views.forEach(v => {
        const el = document.getElementById(v + '-view');
        if (v === viewName) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    const topBar = document.getElementById('top-admin-bar');
    if (topBar) {
        if (isAdminAuthenticated) {
            topBar.classList.remove('hidden');
        } else {
            topBar.classList.add('hidden');
        }
    }

    document.getElementById('view-btn-guest').className = viewName === 'guest'
        ? 'px-3 py-1.5 rounded-lg font-semibold bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1.5 transition'
        : 'px-3 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1.5 transition';

    document.getElementById('view-btn-admin').className = viewName === 'admin'
        ? 'px-3 py-1.5 rounded-lg font-semibold bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5 transition'
        : 'px-3 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1.5 transition';

    document.getElementById('view-btn-qrcodes').className = viewName === 'qrcodes'
        ? 'px-3 py-1.5 rounded-lg font-semibold bg-cyan-400 text-slate-950 shadow-sm flex items-center gap-1.5 transition'
        : 'px-3 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1.5 transition';

    if (viewName === 'admin') {
        renderAdminDashboard();
    } else if (viewName === 'qrcodes') {
        regenerateAllQrCodes();
    }
}

// =========================================================================
// 3. GERAÇÃO DE QR CODES
// =========================================================================
function regenerateAllQrCodes() {
    const configs = [
        { key: 'hit', color: '#0f766e' },
        { key: 'salvador', color: '#1e3a8a' },
        { key: 'ancoras', color: '#047857' }
    ];

    configs.forEach(({ key, color }) => {
        const inputEl = document.getElementById('qr-url-' + key);
        const labelEl = document.getElementById('qr-label-' + key);
        const canvasEl = document.getElementById('qr-canvas-' + key);
        if (!inputEl || !canvasEl) return;

        const targetUrl = inputEl.value.trim() || `${GOOGLE_SITES_BASE_URL}?hotel=${key}`;
        if (labelEl) labelEl.textContent = targetUrl;

        const openLinkEl = document.getElementById('qr-open-' + key);
        if (openLinkEl) openLinkEl.href = targetUrl;

        if (typeof QRious !== 'undefined') {
            new QRious({
                element: canvasEl,
                value: targetUrl,
                size: 240,
                level: 'H',
                foreground: color,
                background: '#ffffff'
            });
        }
    });
}

function downloadQrImage(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function copyDedicatedHotelHtml(hotelKey) {
    const currentFullHtml = document.documentElement.outerHTML;
    const modifiedHtml = '<!DOCTYPE html>\n' + currentFullHtml.replace(
        "const FIXED_HOTEL_MODE = 'ALL';",
        `const FIXED_HOTEL_MODE = '${hotelKey}';`
    );

    const textarea = document.createElement('textarea');
    textarea.value = modifiedHtml;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const hotelName = HOTELS_CONFIG[hotelKey]?.name || hotelKey;
    const toast = document.getElementById('qr-copy-feedback');
    const toastText = document.getElementById('qr-copy-feedback-text');
    toastText.textContent = `Código HTML exclusivo do ${hotelName} (sem menus) copiado! Basta colar no Google Sites.`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
}

// =========================================================================
// 4. SISTEMA DE IDIOMAS
// =========================================================================
function setLanguage(lang) {
    if (!I18N[lang]) lang = 'pt';
    currentLang = lang;
    const dict = I18N[lang];

    ['pt', 'es', 'en', 'fr'].forEach(l => {
        const btn = document.getElementById('lang-btn-' + l);
        if (l === lang) {
            btn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 bg-white text-slate-900 shadow';
        } else {
            btn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 text-white hover:bg-white/10';
        }
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    if (lang !== 'pt' && currentOriginType === 'BR') {
        setGuestOriginType('INT');
        if (lang === 'es') document.getElementById('field-nationality').value = 'ARGENTINA';
        if (lang === 'en') document.getElementById('field-nationality').value = 'ESTADOS UNIDOS';
        if (lang === 'fr') document.getElementById('field-nationality').value = 'FRANÇA';
    }
}

// =========================================================================
// 5. SELEÇÃO BRASILEIRO vs ESTRANGEIRO
// =========================================================================
function setGuestOriginType(type) {
    currentOriginType = type;
    const btnBr = document.getElementById('btn-type-br');
    const btnInt = document.getElementById('btn-type-int');
    const iconBr = document.getElementById('check-icon-br');
    const iconInt = document.getElementById('check-icon-int');

    const wrapperCpf = document.getElementById('wrapper-cpf');
    const wrapperPassport = document.getElementById('wrapper-passport');
    const sectionBrAddress = document.getElementById('section-br-address');
    const stepNumExtra = document.getElementById('step-num-extra');
    const natSelect = document.getElementById('field-nationality');

    if (type === 'BR') {
        btnBr.className = 'flex items-center gap-3.5 p-3.5 rounded-xl border-2 border-teal-600 bg-teal-50/60 text-left transition shadow-sm';
        btnInt.className = 'flex items-center gap-3.5 p-3.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white text-left transition';
        iconBr.className = 'fa-solid fa-circle-check text-teal-600 ml-auto text-lg';
        iconInt.className = 'fa-regular fa-circle text-slate-300 ml-auto text-lg';

        wrapperCpf.classList.remove('hidden');
        wrapperPassport.classList.add('hidden');
        sectionBrAddress.classList.remove('hidden');
        stepNumExtra.textContent = '4';
        natSelect.value = 'BRASIL';
    } else {
        btnInt.className = 'flex items-center gap-3.5 p-3.5 rounded-xl border-2 border-teal-600 bg-teal-50/60 text-left transition shadow-sm';
        btnBr.className = 'flex items-center gap-3.5 p-3.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white text-left transition';
        iconInt.className = 'fa-solid fa-circle-check text-teal-600 ml-auto text-lg';
        iconBr.className = 'fa-regular fa-circle text-slate-300 ml-auto text-lg';

        wrapperCpf.classList.add('hidden');
        wrapperPassport.classList.remove('hidden');
        sectionBrAddress.classList.add('hidden');
        stepNumExtra.textContent = '3';
        if (natSelect.value === 'BRASIL') {
            natSelect.value = 'ARGENTINA';
        }
    }
    document.getElementById('form-error-box').classList.add('hidden');
}

function handleNationalityChange(val) {
    if (val === 'BRASIL' && currentOriginType !== 'BR') {
        setGuestOriginType('BR');
    } else if (val !== 'BRASIL' && currentOriginType === 'BR') {
        setGuestOriginType('INT');
    }
}

// =========================================================================
// 6. MÁSCARAS E BUSCA DE CEP
// =========================================================================
function handleCpfMask(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = v;
}

function handlePhoneMask(input) {
    if (currentOriginType === 'BR') {
        let v = input.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 2) v = '(' + v.substring(0, 2) + ') ' + v.substring(2);
        if (v.length > 10) v = v.substring(0, 10) + '-' + v.substring(10);
        input.value = v;
    }
}

async function handleCepLookup(input) {
    let cep = input.value.replace(/\D/g, '');
    if (cep.length > 5) {
        input.value = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }
    if (cep.length === 8) {
        const loader = document.getElementById('cep-loading');
        loader.classList.remove('hidden');
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (!data.erro) {
                document.getElementById('field-uf').value = data.uf || '';
                document.getElementById('field-city').value = (data.localidade || '').toUpperCase();
                document.getElementById('field-address').value = `${data.logradouro || ''} ${data.bairro || ''}`.trim().toUpperCase();
            }
        } catch (e) {
            // Silencioso
        } finally {
            loader.classList.add('hidden');
        }
    }
}

// =========================================================================
// 7. SUBMISSÃO DE FORMULÁRIO
// =========================================================================
function handleCheckinSubmit(e) {
    e.preventDefault();
    const errorBox = document.getElementById('form-error-box');
    const errorText = document.getElementById('form-error-text');
    errorBox.classList.add('hidden');

    const name = document.getElementById('field-name').value.trim().toUpperCase();
    const dob = document.getElementById('field-dob').value;
    const phone = document.getElementById('field-phone').value.trim();
    const email = document.getElementById('field-email').value.trim().toLowerCase();
    const nationality = document.getElementById('field-nationality').value;
    const cpf = document.getElementById('field-cpf').value.trim();
    const passport = document.getElementById('field-passport').value.trim().toUpperCase();
    const cep = document.getElementById('field-cep').value.trim();
    const uf = document.getElementById('field-uf').value;
    const city = document.getElementById('field-city').value.trim().toUpperCase();
    const country = document.getElementById('field-country').value.trim().toUpperCase();
    const address = document.getElementById('field-address').value.trim().toUpperCase();
    const channel = document.getElementById('field-channel').value;
    const purpose = document.getElementById('field-purpose').value;
    const guestsCount = parseInt(document.getElementById('field-guests-count').value, 10) || 1;

    if (!name || !dob || !phone || !email || !nationality) {
        errorText.textContent = I18N[currentLang].err_missing_fields;
        errorBox.classList.remove('hidden');
        return;
    }

    if (currentOriginType === 'BR') {
        if (!cpf || cpf.length < 11 || !uf || !city || !country) {
            errorText.textContent = 'Para hóspedes brasileiros, é obrigatório preencher Nome, Data de Nascimento, Telefone, E-mail, CPF, Estado (UF) e Cidade.';
            errorBox.classList.remove('hidden');
            return;
        }
    } else {
        if (!passport) {
            errorText.textContent = I18N[currentLang].err_missing_fields + ' (Passport Number)';
            errorBox.classList.remove('hidden');
            return;
        }
    }

    // Cria registro com data e hora locais atuais (fuso horário local Brasil)
    const now = new Date();
    const dateStr = getLocalDateString(now);
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const protocolId = 'CHK-' + Math.floor(1000 + Math.random() * 9000);

    const newRecord = {
        id: protocolId,
        date: dateStr,
        time: timeStr,
        hotel: currentHotel,
        originType: currentOriginType,
        name,
        dob,
        phone,
        email,
        nationality,
        cpf: currentOriginType === 'BR' ? cpf : '',
        passport: currentOriginType === 'INT' ? passport : '',
        cep: currentOriginType === 'BR' ? cep : '',
        uf: currentOriginType === 'BR' ? uf : 'EX',
        city: currentOriginType === 'BR' ? city : nationality,
        country: currentOriginType === 'BR' ? 'BRASIL' : nationality,
        address,
        channel,
        purpose,
        guestsCount
    };

    checkinsData.unshift(newRecord);
    document.getElementById('badge-total-checkins').textContent = checkinsData.length;

    const cfg = HOTELS_CONFIG[currentHotel];
    document.getElementById('voucher-hotel-name').textContent = cfg.name;
    document.getElementById('voucher-protocol').textContent = '#' + protocolId;
    document.getElementById('voucher-guest-name').textContent = name;
    document.getElementById('voucher-guest-doc').textContent = currentOriginType === 'BR'
        ? `CPF: ${cpf} • ${city}/${uf}`
        : `PASS: ${passport} • ${nationality}`;
    document.getElementById('voucher-wifi-ssid').textContent = cfg.wifiSsid;

    document.getElementById('checkin-form-container').classList.add('hidden');
    document.getElementById('checkin-success-container').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetCheckinForm() {
    document.getElementById('guestCheckinForm').reset();
    clearSignature();
    setGuestOriginType('BR');
    document.getElementById('checkin-success-container').classList.add('hidden');
    document.getElementById('checkin-form-container').classList.remove('hidden');
}

// =========================================================================
// 8. CANVAS DE ASSINATURA DIGITAL
// =========================================================================
let sigCanvas, sigCtx, isDrawing = false;

function initSignatureCanvas() {
    sigCanvas = document.getElementById('signatureCanvas');
    if (!sigCanvas) return;
    sigCtx = sigCanvas.getContext('2d');

    const resizeCanvas = () => {
        const rect = sigCanvas.parentElement.getBoundingClientRect();
        sigCanvas.width = rect.width || 500;
        sigCanvas.height = rect.height || 112;
        sigCtx.strokeStyle = '#0f172a';
        sigCtx.lineWidth = 2;
        sigCtx.lineCap = 'round';
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getPos = (e) => {
        const rect = sigCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = (e) => {
        isDrawing = true;
        document.getElementById('sig-placeholder').classList.add('hidden');
        const pos = getPos(e);
        sigCtx.beginPath();
        sigCtx.moveTo(pos.x, pos.y);
    };

    const moveDraw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        sigCtx.lineTo(pos.x, pos.y);
        sigCtx.stroke();
    };

    const endDraw = () => { isDrawing = false; };

    sigCanvas.addEventListener('mousedown', startDraw);
    sigCanvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    sigCanvas.addEventListener('touchstart', startDraw, { passive: false });
    sigCanvas.addEventListener('touchmove', moveDraw, { passive: false });
    window.addEventListener('touchend', endDraw);
}

function clearSignature() {
    if (!sigCtx || !sigCanvas) return;
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    document.getElementById('sig-placeholder').classList.remove('hidden');
}

// =========================================================================
// 9. DASHBOARD DE BI & TABELA OPERACIONAL
// =========================================================================
// Retorna a data atual no formato YYYY-MM-DD usando o fuso horário local do navegador
function getLocalDateString(dateObj = new Date()) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Converte qualquer formato de data (DD/MM/YYYY, ISO, Date string) para YYYY-MM-DD
function normalizeToIsoDate(dateStr) {
    if (!dateStr) return '';
    const s = String(dateStr).trim();
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(s)) {
        const parts = s.split(/[\/\-]/);
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2].substring(0, 4);
        return `${year}-${month}-${day}`;
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
        return s.substring(0, 10);
    }
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
        return getLocalDateString(parsed);
    }
    return s;
}

// Alterna a exibição dos seletores de dia específico e intervalo
function handlePeriodFilterChange() {
    const period = document.getElementById('admin-filter-period').value;
    const singleWrap = document.getElementById('wrapper-filter-single-date');
    const startWrap = document.getElementById('wrapper-filter-range-start');
    const endWrap = document.getElementById('wrapper-filter-range-end');

    if (singleWrap) singleWrap.classList.toggle('hidden', period !== 'SPECIFIC_DAY');
    if (startWrap) startWrap.classList.toggle('hidden', period !== 'RANGE');
    if (endWrap) endWrap.classList.toggle('hidden', period !== 'RANGE');

    renderAdminDashboard();
}

function getFilteredCheckins() {
    const hotelFilter = document.getElementById('admin-filter-hotel').value;
    const originFilter = document.getElementById('admin-filter-origin').value;
    const periodFilter = document.getElementById('admin-filter-period').value;
    const searchQuery = (document.getElementById('admin-search-input').value || '').toLowerCase();

    // Datas de referência calculadas dinamicamente com base no relógio de hoje
    const today = getLocalDateString(new Date());

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    const singleDate = document.getElementById('admin-filter-single-date')?.value || today;
    const startDate = document.getElementById('admin-filter-start-date')?.value || '';
    const endDate = document.getElementById('admin-filter-end-date')?.value || '';

    const d7 = new Date();
    d7.setDate(d7.getDate() - 7);
    const minDate7 = getLocalDateString(d7);

    const d30 = new Date();
    d30.setDate(d30.getDate() - 30);
    const minDate30 = getLocalDateString(d30);

    return checkinsData.filter(item => {
        if (hotelFilter !== 'ALL' && item.hotel !== hotelFilter) return false;
        if (originFilter !== 'ALL' && item.originType !== originFilter) return false;

        const itemDate = normalizeToIsoDate(item.date);

        if (periodFilter === 'TODAY') {
            if (itemDate !== today) return false;
        } else if (periodFilter === 'YESTERDAY') {
            if (itemDate !== yesterday) return false;
        } else if (periodFilter === 'SPECIFIC_DAY') {
            if (singleDate && itemDate !== singleDate) return false;
        } else if (periodFilter === 'RANGE') {
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
        } else if (periodFilter === 'LAST_7') {
            if (itemDate < minDate7 || itemDate > today) return false;
        } else if (periodFilter === 'LAST_30') {
            if (itemDate < minDate30 || itemDate > today) return false;
        }

        if (searchQuery) {
            const hay = `${item.name} ${item.cpf} ${item.passport} ${item.city} ${item.uf} ${item.nationality} ${item.email}`.toLowerCase();
            if (!hay.includes(searchQuery)) return false;
        }
        return true;
    });
}

function renderAdminDashboard() {
    const filtered = getFilteredCheckins();
    document.getElementById('badge-total-checkins').textContent = checkinsData.length;

    document.getElementById('kpi-total').textContent = filtered.length;

    const ufCounts = {};
    const countryCounts = {};
    const channelCounts = {};
    const cityCounts = {};
    const purposeCounts = {};
    let foreignCount = 0;

    filtered.forEach(item => {
        countryCounts[item.nationality] = (countryCounts[item.nationality] || 0) + 1;
        channelCounts[item.channel] = (channelCounts[item.channel] || 0) + 1;
        purposeCounts[item.purpose] = (purposeCounts[item.purpose] || 0) + 1;

        if (item.originType === 'BR') {
            ufCounts[item.uf] = (ufCounts[item.uf] || 0) + 1;
            const cityLabel = `${item.city} (${item.uf})`;
            cityCounts[cityLabel] = (cityCounts[cityLabel] || 0) + 1;
        } else {
            foreignCount++;
            const intCityLabel = `${item.city} (${item.nationality})`;
            cityCounts[intCityLabel] = (cityCounts[intCityLabel] || 0) + 1;
        }
    });

    const topUF = Object.entries(ufCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('kpi-top-state').textContent = topUF ? `${topUF[0]} (${topUF[1]} check-ins)` : 'N/A';

    const foreignPct = filtered.length > 0 ? ((foreignCount / filtered.length) * 100).toFixed(1) : '0.0';
    document.getElementById('kpi-foreign-pct').textContent = `${foreignPct}%`;

    const intCountries = Object.entries(countryCounts).filter(c => c[0] !== 'BRASIL').sort((a, b) => b[1] - a[1]);
    document.getElementById('kpi-top-country').textContent = intCountries.length > 0
        ? `Top Exterior: ${intCountries[0][0]} (${intCountries[0][1]})`
        : 'Apenas hóspedes nacionais no filtro';

    const topChannel = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('kpi-top-channel').textContent = topChannel
        ? `Canal Líder: ${topChannel[0]}`
        : 'Sem dados';

    const topPurpose = Object.entries(purposeCounts).sort((a, b) => b[1] - a[1])[0];
    if (topPurpose) {
        document.getElementById('predominant-purpose-badge').textContent = topPurpose[0];
    }

    const insightEl = document.getElementById('strategic-ai-insight');
    if (filtered.length > 0) {
        const bestStateTxt = topUF ? `o estado líder de emissão nacional é <strong>${topUF[0]}</strong>` : 'há forte presença internacional';
        const bestIntTxt = intCountries[0] ? `No mercado internacional, <strong>${intCountries[0][0]}</strong> lidera as chegadas.` : '';
        insightEl.innerHTML = `Nos registros selecionados, ${bestStateTxt}. ${bestIntTxt} O canal <strong>${topChannel ? topChannel[0] : 'Direto'}</strong> concentra a maior fatia das reservas. <strong>Sugestão:</strong> Ofereça cupom de retorno via WhatsApp no check-out para converter clientes de OTAs em reservas diretas nas unidades Hit Hotel, Porto Salvador e Porto das Âncoras.`;
    } else {
        insightEl.textContent = 'Nenhum registro encontrado para os filtros selecionados.';
    }

    const topCitiesContainer = document.getElementById('top-cities-list');
    const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    topCitiesContainer.innerHTML = sortedCities.map(([city, count], idx) => {
        const pct = Math.round((count / Math.max(filtered.length, 1)) * 100);
        return `
            <div>
                <div class="flex justify-between text-xs mb-1">
                    <span class="font-bold text-slate-700">${idx + 1}. ${city}</span>
                    <span class="font-semibold text-slate-500">${count} hóspede(s) (${pct}%)</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-teal-600 h-full rounded-full" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }).join('') || '<p class="text-xs text-slate-400">Sem dados para exibir.</p>';

    renderCharts(ufCounts, countryCounts, channelCounts, filtered);
    renderTable(filtered);
}

function renderCharts(ufCounts, countryCounts, channelCounts, filtered) {
    const sortedUFs = Object.entries(ufCounts).sort((a, b) => b[1] - a[1]);
    const ctxUF = document.getElementById('chartStatesUF').getContext('2d');
    if (chartStatesInstance) chartStatesInstance.destroy();
    chartStatesInstance = new Chart(ctxUF, {
        type: 'bar',
        data: {
            labels: sortedUFs.map(i => `Estado ${i[0]}`),
            datasets: [{
                label: 'Hóspedes por UF',
                data: sortedUFs.map(i => i[1]),
                backgroundColor: ['#0d9488', '#0284c7', '#4f46e5', '#059669', '#d97706', '#e11d48'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

    const sortedCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]);
    const ctxCountry = document.getElementById('chartCountries').getContext('2d');
    if (chartCountriesInstance) chartCountriesInstance.destroy();
    chartCountriesInstance = new Chart(ctxCountry, {
        type: 'doughnut',
        data: {
            labels: sortedCountries.map(i => i[0]),
            datasets: [{
                data: sortedCountries.map(i => i[1]),
                backgroundColor: ['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } }
            }
        }
    });

    const sortedChannels = Object.entries(channelCounts).sort((a, b) => b[1] - a[1]);
    const ctxChannel = document.getElementById('chartChannels').getContext('2d');
    if (chartChannelsInstance) chartChannelsInstance.destroy();
    chartChannelsInstance = new Chart(ctxChannel, {
        type: 'bar',
        data: {
            labels: sortedChannels.map(i => i[0]),
            datasets: [{
                label: 'Check-ins',
                data: sortedChannels.map(i => i[1]),
                backgroundColor: '#f59e0b',
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

    const hourBuckets = { '12h-13h': 0, '14h-15h': 0, '16h-17h': 0, '18h+': 0 };
    filtered.forEach(item => {
        const hr = parseInt((item.time || '14:00').split(':')[0], 10);
        if (hr <= 13) hourBuckets['12h-13h']++;
        else if (hr <= 15) hourBuckets['14h-15h']++;
        else if (hr <= 17) hourBuckets['16h-17h']++;
        else hourBuckets['18h+']++;
    });

    const ctxHours = document.getElementById('chartHours').getContext('2d');
    if (chartHoursInstance) chartHoursInstance.destroy();
    chartHoursInstance = new Chart(ctxHours, {
        type: 'line',
        data: {
            labels: Object.keys(hourBuckets),
            datasets: [{
                label: 'Fluxo de Check-ins',
                data: Object.values(hourBuckets),
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13, 148, 136, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function formatDateBR(isoDate) {
    if (!isoDate) return '';
    const normalized = normalizeToIsoDate(isoDate);
    const parts = normalized.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function renderTable(list) {
    const tbody = document.getElementById('admin-checkins-tbody');
    if (list.length === 0) {
        const period = document.getElementById('admin-filter-period')?.value;
        let msg = 'Nenhum check-in encontrado para os filtros selecionados.';
        if (period === 'TODAY') {
            const todayBR = formatDateBR(getLocalDateString());
            msg = `Nenhum check-in registrado para a data de hoje (${todayBR}).`;
        } else if (period === 'YESTERDAY') {
            const y = new Date(); y.setDate(y.getDate() - 1);
            const yBR = formatDateBR(getLocalDateString(y));
            msg = `Nenhum check-in registrado na data de ontem (${yBR}).`;
        } else if (period === 'SPECIFIC_DAY') {
            const s = document.getElementById('admin-filter-single-date')?.value;
            msg = `Nenhum check-in registrado no dia ${formatDateBR(s)}.`;
        } else if (period === 'RANGE') {
            const s = document.getElementById('admin-filter-start-date')?.value;
            const e = document.getElementById('admin-filter-end-date')?.value;
            msg = `Nenhum check-in registrado no intervalo de ${formatDateBR(s)} até ${formatDateBR(e)}.`;
        }
        tbody.innerHTML = `<tr><td colspan="8" class="py-10 text-center text-slate-400">
            <i class="fa-solid fa-calendar-xmark text-3xl text-slate-300 mb-2 block"></i>
            <span class="font-semibold text-slate-600 block text-sm">${msg}</span>
            <span class="text-xs text-slate-400 mt-1 block">Altere o filtro de período ou escolha outra data no menu acima para consultar outros dias.</span>
        </td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(item => {
        const hCfg = HOTELS_CONFIG[item.hotel] || HOTELS_CONFIG.hit;
        const docBadge = item.originType === 'BR'
            ? `<span class="font-mono text-slate-700">CPF: ${item.cpf}</span>`
            : `<span class="font-mono text-indigo-700 font-semibold">PASS: ${item.passport}</span>`;
        const flagIcon = item.originType === 'BR' ? '🇧🇷' : '🌍';

        return `
            <tr class="hover:bg-slate-50 transition">
                <td class="py-3 px-4 whitespace-nowrap">
                    <div class="font-bold text-slate-800">${formatDateBR(item.date)}</div>
                    <div class="text-[11px] text-slate-500"><i class="fa-regular fa-clock"></i> ${item.time} • <span class="font-mono">${item.id}</span></div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${hCfg.pillColor}">
                        ${hCfg.name}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <div class="font-bold text-slate-900">${item.name}</div>
                    <div class="text-[11px] text-slate-500">Nasc: ${formatDateBR(item.dob)}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                    <div class="font-bold text-slate-800">${flagIcon} ${item.nationality}</div>
                    <div class="text-[11px]">${docBadge}</div>
                </td>
                <td class="py-3 px-4">
                    <div class="font-bold text-slate-800">${item.city} ${item.uf !== 'EX' ? '- ' + item.uf : ''}</div>
                    <div class="text-[11px] text-slate-500">País: ${item.country}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                    <div class="font-medium text-slate-800">${item.phone}</div>
                    <div class="text-[11px] text-slate-500">${item.email}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                    <div class="font-semibold text-slate-700">${item.channel}</div>
                    <div class="text-[11px] text-slate-500">${item.purpose}</div>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button onclick="openPmsModal('${item.id}')" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-700 text-white font-bold text-[11px] transition inline-flex items-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-copy text-amber-300"></i> Espelho PMS
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// =========================================================================
// 10. MODAL ESPELHO PMS
// =========================================================================
function openPmsModal(checkinId) {
    const item = checkinsData.find(c => c.id === checkinId);
    if (!item) return;

    document.getElementById('pms-nome').value = item.name;
    document.getElementById('pms-dob').value = formatDateBR(item.dob);
    document.getElementById('pms-fone').value = item.phone.replace(/\D/g, '');
    document.getElementById('pms-nacionalidade').value = item.nationality;
    document.getElementById('pms-email').value = item.email;
    document.getElementById('pms-canal').value = item.channel;
    document.getElementById('pms-cpf').value = item.cpf;
    document.getElementById('pms-passaporte').value = item.passport;
    document.getElementById('pms-cep').value = item.cep || '-';
    document.getElementById('pms-uf').value = item.uf === 'EX' ? '' : item.uf;
    document.getElementById('pms-cidade').value = item.city;
    document.getElementById('pms-pais').value = item.country;
    document.getElementById('pms-endereco').value = item.address || '';

    const cleanPhone = item.phone.replace(/\D/g, '');
    document.getElementById('pms-whatsapp-btn').href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Olá ' + item.name + ', confirmamos o recebimento do seu Check-in Online!')}`;

    const modal = document.getElementById('pms-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closePmsModal() {
    const modal = document.getElementById('pms-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function copyField(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.select();
    document.execCommand('copy');

    const toast = document.getElementById('copy-toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2500);
}

// =========================================================================
// 11. EXPORTAÇÃO CSV
// =========================================================================
function exportCheckinsToCSV() {
    const rows = getFilteredCheckins();
    const headers = ['Protocolo', 'Data', 'Horario', 'Hotel', 'Tipo', 'Nome', 'Data_Nascimento', 'Telefone', 'Email', 'Nacionalidade', 'CPF', 'Passaporte', 'CEP', 'UF', 'Cidade', 'Pais', 'Canal_Reserva', 'Motivo_Viagem'];
    const csvContent = [
        headers.join(';'),
        ...rows.map(r => [
            r.id,
            formatDateBR(r.date),
            r.time,
            HOTELS_CONFIG[r.hotel]?.name || r.hotel,
            r.originType,
            `"${r.name}"`,
            formatDateBR(r.dob),
            `"${r.phone}"`,
            r.email,
            r.nationality,
            r.cpf,
            r.passport,
            r.cep,
            r.uf,
            `"${r.city}"`,
            r.country,
            `"${r.channel}"`,
            `"${r.purpose}"`
        ].join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_checkins_hoteis_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// =========================================================================
// 12. DETECÇÃO DE AMBIENTE & INICIALIZAÇÃO
// =========================================================================
function detectHotelFromEnvironment() {
    if (typeof FIXED_HOTEL_MODE !== 'undefined' && FIXED_HOTEL_MODE && FIXED_HOTEL_MODE !== 'ALL' && HOTELS_CONFIG[FIXED_HOTEL_MODE]) {
        return { hotel: FIXED_HOTEL_MODE, isLockedGuest: true };
    }

    const sourcesToCheck = [
        window.location.search || '',
        window.location.hash || '',
        window.location.href || '',
        document.referrer || ''
    ].join(' ').toLowerCase();

    for (const key of ['hit', 'salvador', 'ancoras']) {
        if (
            sourcesToCheck.includes(`hotel=${key}`) ||
            sourcesToCheck.includes(`#${key}`) ||
            sourcesToCheck.includes(`/${key}`)
        ) {
            return { hotel: key, isLockedGuest: true };
        }
    }

    return { hotel: 'hit', isLockedGuest: false };
}
