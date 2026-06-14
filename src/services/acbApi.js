
// ============================================================
// acbApi.js — API do WordPress da ACBrasil
// Centraliza todo o acesso a https://acbrasil.org.br/cms/wp-json
// ============================================================
 
const API_ORIGIN = import.meta.env.DEV
  ? '/acb-api/cms/wp-json/wp/v2'
  : 'https://acbrasil.org.br/cms/wp-json/wp/v2'
export const PER_PAGE = 6
 
// ID da categoria "Artigos" no WP da ACBrasil — exclui newsletters/noticias
// (descoberto no projeto antigo HTML/CSS/JS). Usado no hero pra puxar so
// imagens de artigos de verdade, com fotos editoriais bonitas.
const CAT_ARTIGOS = 20
 
function wpFetch(path) {
    return fetch(API_ORIGIN + path)
}
 
// ─── Utilitários (usados aqui dentro e em outras páginas) ───
 
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
 
// ─── Páginas de listagem (usado em /artigos) ───
 
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

// ─── Artigo individual (usado em /artigos/:slug) ───

export async function fetchPostBySlug(slug) {
    const res = await wpFetch(`/posts?slug=${encodeURIComponent(slug)}&_embed=1`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const posts = await res.json()
    return posts[0] ?? null
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
 
// ─── Home: hero (imagens reais dos artigos mais recentes) ───
// Filtra por CAT_ARTIGOS pra evitar capas de newsletter no carrossel.
 
export async function fetchHeroImages(count = 5) {
    try {
        const res = await wpFetch(`/posts?categories=${CAT_ARTIGOS}&per_page=${count}&_embed=1`)
        if (!res.ok) return []
        const posts = await res.json()
        return posts
            .map(p => {
                const media = p._embedded?.['wp:featuredmedia']?.[0]
                const sizes = media?.media_details?.sizes || {}
                return (
                    sizes.large?.source_url ||
                    sizes.medium_large?.source_url ||
                    sizes.medium?.source_url ||
                    media?.source_url ||
                    null
                )
            })
            .filter(Boolean)
    } catch (err) {
        console.warn('fetchHeroImages falhou:', err)
        return []
    }
}
 
// ─── Home: cards de artigos (3 posts mais recentes) ───
 
export async function fetchHomeArticles(count = 3) {
    try {
        const res = await wpFetch(`/posts?per_page=${count}&_embed=1`)
        if (!res.ok) return []
        const posts = await res.json()
        return posts.map(p => ({
            img: pickImage(p),
            tag: pickCategoryName(p),
            title: stripHtml(p.title.rendered),
            text: stripHtml(p.excerpt.rendered).slice(0, 80) + '…',
            link: p.link,
            slug: p.slug,
        }))
    } catch (err) {
        console.warn('fetchHomeArticles falhou:', err)
        return []
    }
}
 
// ─── Home: cards de associados (conselheiros com foto destacada) ───
 
// ID da página "Quem somos" — os conselheiros são páginas filhas dela.
// Buscar por parent evita o bug do plugin tagDiv que estoura no search.
const QUEM_SOMOS_ID = 559

export async function fetchHomeAssociados(count = 3) {
    try {
        const res = await wpFetch(
            `/pages?parent=${QUEM_SOMOS_ID}&per_page=${count}&_embed=1`
        )
        if (!res.ok) return []
        const pages = await res.json()
        return pages
            .filter(p => p._embedded?.['wp:featuredmedia']?.[0]?.source_url)
            .map(p => {
                const excerpt = stripHtml(p.excerpt?.rendered || '')
                return {
                    img: pickImage(p),
                    tag: 'Conselheiro',
                    title: stripHtml(p.title.rendered),
                    text: excerpt
                        ? excerpt.slice(0, 90) + '…'
                        : 'Conselheiro associado da ACBrasil',
                    link: p.link,
                }
            })
    } catch (err) {
        console.warn('fetchHomeAssociados falhou:', err)
        return []
    }
}