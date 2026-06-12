

const BRAPI_TOKEN = import.meta.env.VITE_BRAPI_TOKEN || ''
 
// ─── Helpers ───
 
function formatBR(n, decimals = 2) {
    return Number(n).toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}
 

// ─── Ibovespa (brapi.dev) ───
 
export async function getMarketIndex() {
    if (!BRAPI_TOKEN) {
        console.warn('VITE_BRAPI_TOKEN nao configurado — Ibovespa usara fallback')
        return null
    }
    try {
        const url = `https://brapi.dev/api/quote/%5EBVSP?range=5d&interval=1d&token=${BRAPI_TOKEN}`
        const res = await fetch(url)
        if (!res.ok) return null
        const data = await res.json()
        const q = data.results?.[0]
        if (!q) return null
 
        const series = (q.historicalDataPrice || []).map(d => d.close)
        const pct = q.regularMarketChangePercent ?? 0
 
        return {
            label: 'IBOVESPA',
            value: formatBR(q.regularMarketPrice, 0),
            change: `${pct >= 0 ? '▲' : '▼'} ${formatBR(Math.abs(pct), 2)}%`,
            isPositive: pct >= 0,
            series,
        }
    } catch (err) {
        console.warn('getMarketIndex falhou:', err)
        return null
    }
}
 
// ─── USD-BRL (AwesomeAPI) ───
 
export async function getUsdBrl() {
    try {
        const [nowRes, histRes] = await Promise.all([
            fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL'),
            fetch('https://economia.awesomeapi.com.br/json/daily/USD-BRL/7'),
        ])
        if (!nowRes.ok || !histRes.ok) return null
 
        const now = await nowRes.json()
        const hist = await histRes.json()
 
        const u = now.USDBRL
        if (!u) return null
 
        // AwesomeAPI devolve do mais recente pro mais antigo — invertemos.
        const series = hist.map(d => parseFloat(d.bid)).reverse()
        const pct = parseFloat(u.pctChange)
 
        return {
            label: 'USD/BRL',
            value: `R$ ${formatBR(parseFloat(u.bid), 2)}`,
            change: `${pct >= 0 ? '▲' : '▼'} ${formatBR(Math.abs(pct), 2)}%`,
            isPositive: pct >= 0,
            series,
        }
    } catch (err) {
        console.warn('getUsdBrl falhou:', err)
        return null
    }
}
 
// ─── SELIC (BCB) ───
 
export async function getSelic() {
    try {
        // Serie 432 = Meta da taxa Selic definida pelo Copom (diaria).
        // Buscamos ~180 dias pra montar um sparkline em "degraus" que
        // mostra as decisoes recentes do Copom.
        const res = await fetch(
            'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/180?formato=json'
        )
        if (!res.ok) return null
        const data = await res.json()
        if (!data.length) return null

        const series = data.map((d) => parseFloat(d.valor))
        const last = series[series.length - 1]

        return {
            label: 'SELIC',
            value: `${formatBR(last, 2)}%`,
            change: 'Meta anual',
            isNeutral: true,
            series,
        }
    } catch (err) {
        console.warn('getSelic falhou:', err)
        return null
    }
}
 
// 
 
export async function getStockQuote(_ticker) { return null }
export async function getStocks() { return [] }
