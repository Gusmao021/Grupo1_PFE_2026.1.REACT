// ============================================================
// stockMarketApi.js — Indicadores de mercado pra Home
// Ibovespa: brapi.dev (precisa de token — gratuito em brapi.dev)
// USD-BRL: AwesomeAPI (gratuito, sem token)
// SELIC: API do Banco Central (gratuita, sem token)

const BRAPI_TOKEN = import.meta.env.VITE_BRAPI_TOKEN || ''
 
// ─── Helpers ───
 
function formatBR(n, decimals = 2) {
    return Number(n).toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}
 

export function buildSparkline(values, width = 200, height = 60, pad = 5) {
    if (!values || values.length < 2) return null
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const stepX = width / (values.length - 1)
    return values
        .map((v, i) => {
            const x = i * stepX
            // SVG tem Y invertido: valor alto → Y baixo (perto de 0)
            const y = pad + ((max - v) / range) * (height - pad * 2)
            return `${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(' ')
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
            sparkline: buildSparkline(series),
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
            sparkline: buildSparkline(series),
        }
    } catch (err) {
        console.warn('getUsdBrl falhou:', err)
        return null
    }
}
 
// ─── SELIC (BCB) ───
 
export async function getSelic() {
    try {
        // Serie 432 = Meta da taxa Selic definida pelo Copom
        const res = await fetch(
            'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'
        )
        if (!res.ok) return null
        const data = await res.json()
        const last = data[0]
        if (!last) return null
 
        return {
            label: 'SELIC',
            value: `${formatBR(parseFloat(last.valor), 2)}%`,
            change: 'Meta anual',
            isNeutral: true,
        }
    } catch (err) {
        console.warn('getSelic falhou:', err)
        return null
    }
}
 
// ─── Stubs antigos (mantidos pra compatibilidade caso alguem use) ───
 
export async function getStockQuote(_ticker) { return null }
export async function getStocks() { return [] }
