// =========================================================================
// CONFIGURAÇÕES GERAIS E BANDEIRAS DOS HOTÉIS
// =========================================================================

// Se for 'ALL', opera como Central Geral (mostra barra superior).
// Se for 'hit', 'salvador' ou 'ancoras', opera travado no modo hóspede limpo.
const FIXED_HOTEL_MODE = 'ALL';
function getCurrentBaseUrl() {
    if (window.location.protocol.startsWith('http')) {
        return window.location.origin + window.location.pathname;
    }
    return 'https://mwfreitas-wq.github.io/check-in-online/';
}
const ADMIN_PASSWORD = 'master';

const HOTELS_CONFIG = {
    hit: {
        id: 'hit',
        name: 'Hit Hotel',
        location: 'Salvador - Bahia, Brasil',
        badge: 'Check-in Digital Oficial • Hit Hotel',
        heroClass: 'relative bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white pt-6 pb-16 px-4 transition-all duration-500 shadow-lg',
        iconClass: 'fa-solid fa-umbrella-beach text-teal-300',
        btnClass: 'w-full py-4 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-teal-600/25 transition flex items-center justify-center gap-2',
        wifiSsid: 'HitHotel_5G',
        pillColor: 'bg-teal-100 text-teal-800 border-teal-300'
    },
    salvador: {
        id: 'salvador',
        name: 'Hotel Porto Salvador',
        location: 'Salvador - Bahia, Brasil',
        badge: 'Check-in Digital Oficial • Porto Salvador',
        heroClass: 'relative bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white pt-6 pb-16 px-4 transition-all duration-500 shadow-lg',
        iconClass: 'fa-solid fa-anchor text-amber-400',
        btnClass: 'w-full py-4 px-6 rounded-xl bg-blue-900 hover:bg-blue-950 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-blue-900/25 transition flex items-center justify-center gap-2',
        wifiSsid: 'PortoSalvador_Guest',
        pillColor: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    ancoras: {
        id: 'ancoras',
        name: 'Hotel Porto das Âncoras',
        location: 'Porto Seguro - Bahia, Brasil',
        badge: 'Check-in Digital Oficial • Porto das Âncoras',
        heroClass: 'relative bg-gradient-to-br from-emerald-700 via-teal-900 to-slate-900 text-white pt-6 pb-16 px-4 transition-all duration-500 shadow-lg',
        iconClass: 'fa-solid fa-water text-emerald-300',
        btnClass: 'w-full py-4 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition flex items-center justify-center gap-2',
        wifiSsid: 'PortoDasAncoras_WiFi',
        pillColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
};
