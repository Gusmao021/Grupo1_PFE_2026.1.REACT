'use client'

import React, { useState, useEffect, useRef } from 'react'
import './ArticlesPage.css'

const API_ORIGIN = 'https://acbrasil.org.br/cms/wp-json/wp/v2'
const PER_PAGE = 6

function wpFetch(path, init) {
    return fetch('https://corsproxy.io/?url=' + encodeURIComponent(API_ORIGIN + path), init)
}

// ─── Utils ───
function stripHtml(html = '') {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return (tmp.textContent || '').replace(/\s+/g, ' ').trim()
}

function formatDate(iso) {
    const d = new Date(iso)
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${meses[d.getMonth()]} ${d.getFullYear()}`
}

function readingTime(html) {
    const words = stripHtml(html).split(/\s+/).length
    return Math.max(1, Math.round(words / 200))
}

function pickImage(post) {
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

function pickCategoryName(post) {
    const terms = post._embedded?.['wp:term']?.[0] || []
    const sub = terms.find(t => t.slug !== 'artigos')
    return (sub || terms[0])?.name || 'Artigo'
}

export default function ArticlesPage() {
    const [categories, setCategories] = useState([])
    const [featured, setFeatured] = useState(null)
    const [posts, setPosts] = useState([])

    const [page, setPage] = useState(1)
    const [categoryId, setCategoryId] = useState(null)
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')

    const [totalPages, setTotalPages] = useState(1)
    const [totalPosts, setTotalPosts] = useState(0)
    const [status, setStatus] = useState('loading') // loading | ok | empty | error

    const gridRef = useRef(null)
    const publicationsRef = useRef(null)

    const featuredId = featured?.id ?? null

    // ─── Categorias (mount) ───
    useEffect(() => {
        let cancel = false
            ; (async () => {
                try {
                    const res = await wpFetch('/categories?per_page=20&hide_empty=true')
                    const cats = await res.json()
                    if (cancel) return
                    setCategories(
                        cats
                            .filter(c => c.slug !== 'artigos' && c.count > 0)
                            .sort((a, b) => b.count - a.count)
                    )
                } catch (err) {
                    console.warn('Falha ao carregar categorias:', err)
                }
            })()
        return () => { cancel = true }
    }, [])

    // ─── Featured (mount) ───
    useEffect(() => {
        let cancel = false
            ; (async () => {
                try {
                    const res = await wpFetch('/posts?per_page=1&_embed=1')
                    const data = await res.json()
                    if (!cancel && data.length) setFeatured(data[0])
                } catch (err) {
                    console.warn('Falha ao carregar destaque:', err)
                }
            })()
        return () => { cancel = true }
    }, [])

    // ─── Lista paginada ───
    useEffect(() => {
        let cancel = false
            ; (async () => {
                setStatus('loading')

                const params = new URLSearchParams({ per_page: PER_PAGE, page, _embed: '1' })
                if (categoryId) params.append('categories', categoryId)
                if (search) params.append('search', search)
                if (featuredId && page === 1 && !search && !categoryId) {
                    params.append('exclude', featuredId)
                }

                try {
                    const res = await wpFetch(`/posts?${params}`)
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)

                    const tp = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10)
                    const tt = parseInt(res.headers.get('X-WP-Total') || '0', 10)
                    const data = await res.json()
                    if (cancel) return

                    setTotalPages(tp)
                    setTotalPosts(tt)
                    setPosts(data)
                    setStatus(data.length ? 'ok' : 'empty')
                } catch (err) {
                    if (cancel) return
                    console.error(err)
                    setStatus('error')
                }
            })()
        return () => { cancel = true }
    }, [page, categoryId, search, featuredId])

    // ─── Busca com debounce ───
    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim())
            setPage(1)
        }, 350)
        return () => clearTimeout(t)
    }, [searchInput])

    // ─── Scroll reveal (reaplica quando a lista muda) ───
    useEffect(() => {
        const cards = gridRef.current?.querySelectorAll('.pub-card')
        if (!cards?.length) return

        const io = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in')
                        io.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
        )
        cards.forEach(c => io.observe(c))
        return () => io.disconnect()
    }, [posts])

    // ─── Handlers ───
    function selectCategory(id) {
        setCategoryId(id)
        setPage(1)
    }

    function goToPage(p) {
        setPage(p)
        const top = (publicationsRef.current?.offsetTop || 0) - 100
        window.scrollTo({ top, behavior: 'smooth' })
    }

    // páginas visíveis (máx 5)
    const pageNumbers = (() => {
        const totalToShow = Math.min(totalPages, 5)
        let start = Math.max(1, page - 2)
        let end = Math.min(totalPages, start + totalToShow - 1)
        start = Math.max(1, end - totalToShow + 1)
        const arr = []
        for (let i = start; i <= end; i++) arr.push(i)
        return arr
    })()

    const featuredImg = featured ? pickImage(featured) : null
    const featuredStyle = featuredImg
        ? {
            backgroundImage: `linear-gradient(135deg, rgba(15,15,61,0.85) 0%, rgba(30,30,107,0.85) 100%), url(${featuredImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : undefined

    return (
        <main>
            <section className="artigos-hero">
                <div className="artigos-hero-content">
                    <div className="artigos-hero-text">
                        <span className="hero-eyebrow">Conhecimento</span>
                        <h1>Artigos &amp; Publicações</h1>
                        <p>Conteúdo especializado em governança corporativa produzido por e para conselheiros.</p>
                    </div>
                    <div className="artigos-hero-stat">
                        <span className="stat-number" id="stat-number">{totalPosts || '—'}</span>
                        <span className="stat-label">publicações</span>
                    </div>
                </div>
            </section>

            <section className="artigos-toolbar">
                <div className="artigos-toolbar-content">
                    <div className="search-wrap">
                        <svg
                            className="search-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar artigos..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </div>
                    <div className="filter-pills" id="filter-pills">
                        <button
                            className={`filter-pill ${!categoryId ? 'active' : ''}`}
                            onClick={() => selectCategory(null)}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-pill ${String(categoryId) === String(cat.id) ? 'active' : ''}`}
                                onClick={() => selectCategory(String(cat.id))}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {featured && (
                <section className="featured">
                    <div className="featured-card reveal in" id="featured-card">
                        <div className="featured-left" style={featuredStyle}>
                            <span className="featured-tag">Em destaque</span>
                        </div>
                        <div className="featured-right">
                            <span className="card-cat">{pickCategoryName(featured)}</span>
                            <h2 dangerouslySetInnerHTML={{ __html: featured.title.rendered }} />
                            <p>{stripHtml(featured.excerpt.rendered).slice(0, 220) + '…'}</p>
                            <div className="featured-meta">
                                <span className="meta-info">
                                    {formatDate(featured.date)} ·{' '}
                                    {readingTime(featured.content?.rendered || featured.excerpt?.rendered)} min de leitura
                                </span>
                                <a href={featured.link} className="read-link" target="_blank" rel="noopener">
                                    Ler Artigo →
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="publications" ref={publicationsRef}>
                <div className="publications-content">
                    <h2 className="section-label">Publicações recentes</h2>

                    <div className="publications-grid" id="publications-grid" ref={gridRef}>
                        {status === 'loading' && <div className="grid-state">Carregando artigos…</div>}
                        {status === 'empty' && <div className="grid-state">Nenhum artigo encontrado.</div>}
                        {status === 'error' && (
                            <div className="grid-state grid-state--error">
                                Não foi possível carregar os artigos. Tente novamente em instantes.
                            </div>
                        )}
                        {status === 'ok' &&
                            posts.map(post => {
                                const img = pickImage(post)
                                const title = stripHtml(post.title.rendered)
                                return (
                                    <article className="pub-card reveal" key={post.id}>
                                        <div className="pub-image">
                                            {img && <img src={img} alt={title} loading="lazy" />}
                                            <span className="pub-cat">{pickCategoryName(post)}</span>
                                        </div>
                                        <div className="pub-body">
                                            <span className="pub-meta">
                                                {formatDate(post.date)} ·{' '}
                                                {readingTime(post.content?.rendered || post.excerpt?.rendered)} min de leitura
                                            </span>
                                            <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                            <p>{stripHtml(post.excerpt.rendered).slice(0, 140) + '…'}</p>
                                            <a href={post.link} target="_blank" rel="noopener" className="read-link">
                                                Ler Artigo →
                                            </a>
                                        </div>
                                    </article>
                                )
                            })}
                    </div>

                    {totalPages > 1 && (
                        <nav className="pagination" id="pagination" aria-label="Paginação">
                            {page > 1 && (
                                <button
                                    className="page-btn page-btn--arrow"
                                    onClick={() => goToPage(page - 1)}
                                    aria-label="Página anterior"
                                >
                                    ←
                                </button>
                            )}
                            {pageNumbers.map(i => (
                                <button
                                    key={i}
                                    className={`page-btn ${i === page ? 'active' : ''}`}
                                    onClick={() => goToPage(i)}
                                >
                                    {i}
                                </button>
                            ))}
                            {page < totalPages && (
                                <button
                                    className="page-btn page-btn--arrow"
                                    onClick={() => goToPage(page + 1)}
                                    aria-label="Próxima página"
                                >
                                    →
                                </button>
                            )}
                        </nav>
                    )}
                </div>
            </section>
        </main>
    )
}