const API_ORIGIN = 'https://acbrasil.org.br/cms/wp-json/wp/v2'
export const PER_PAGE = 6

function wpFetch(path) {
    return fetch(API_ORIGIN + path)
}

export function stripHtml(html = '') {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return (tmp.textContent || '').replace(/\s+/g, ' ').trim()
}

export function formatDate(iso) {
    const d = new Date(iso)
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${meses[d.getMonth()]} ${d.getFullYear()}`
}

export function readingTime(html) {
    const words = stripHtml(html).split(/\s+/).length
    return Math.max(1, Math.round(words / 200))
}

export function pickImage(post) {
    const media = post._embedded?.['wp:featuredmedia']?.[0]
    if (!media) return null
    const sizes = media.media_details?.sizes || {}
    return (
        sizes.medium_large?.source_url ||
        sizes.large?.source_url ||
        sizes.medium?.source_url ||
        media.source_url ||
        null
    )
}

export function pickCategoryName(post) {
    const terms = post._embedded?.['wp:term']?.[0] || []
    const sub = terms.find(t => t.slug !== 'artigos')
    return (sub || terms[0])?.name || 'Artigo'
}

export async function fetchCategories() {
    const res = await wpFetch('/categories?per_page=20&hide_empty=true')
    const cats = await res.json()
    return cats
        .filter(c => c.slug !== 'artigos' && c.count > 0)
        .sort((a, b) => b.count - a.count)
}

export async function fetchFeaturedPost() {
    const res = await wpFetch('/posts?per_page=1&_embed=1')
    const data = await res.json()
    return data[0] ?? null
}

export async function fetchPosts({ page, categoryId, search, excludeId }) {
    const params = new URLSearchParams({ per_page: PER_PAGE, page, _embed: '1' })
    if (categoryId) params.append('categories', categoryId)
    if (search) params.append('search', search)
    if (excludeId) params.append('exclude', excludeId)

    const res = await wpFetch(`/posts?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    return {
        posts: await res.json(),
        totalPages: parseInt(res.headers.get('X-WP-TotalPages') || '1', 10),
        totalPosts: parseInt(res.headers.get('X-WP-Total') || '0', 10),
    }
}
