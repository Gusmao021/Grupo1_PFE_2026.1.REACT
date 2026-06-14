import { useEffect, useRef } from 'react'
import './ArticlesPage.css'
import { usePosts } from './usePosts'
import FeaturedCard from './FeaturedCard'
import PostCard from './PostCard'
import Pagination from './Pagination'

export default function ArticlesPage() {
    const {
        categories,
        featured,
        posts,
        page,
        setPage,
        categoryId,
        searchInput,
        setSearchInput,
        totalPages,
        totalPosts,
        status,
        selectCategory,
        pageNumbers,
    } = usePosts()

    const gridRef = useRef(null)
    const publicationsRef = useRef(null)

    // scroll reveal nos cards quando a lista atualiza
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

    function goToPage(p) {
        setPage(p)
        const top = (publicationsRef.current?.offsetTop || 0) - 100
        window.scrollTo({ top, behavior: 'smooth' })
    }

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
                        <span className="stat-number">{totalPosts || '—'}</span>
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
                            aria-label="Campo de busca para artigos"
                        />
                    </div>
                    <div className="filter-pills">
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

            {featured && <FeaturedCard post={featured} />}

            <section className="publications" ref={publicationsRef}>
                <div className="publications-content">
                    <h2 className="section-label">Publicações recentes</h2>

                    <div className="publications-grid" ref={gridRef}>
                        {status === 'loading' && (
                            <div className="grid-state">Carregando artigos…</div>
                        )}
                        {status === 'empty' && (
                            <div className="grid-state">Nenhum artigo encontrado.</div>
                        )}
                        {status === 'error' && (
                            <div className="grid-state grid-state--error">
                                Não foi possível carregar os artigos. Tente novamente em instantes.
                            </div>
                        )}
                        {status === 'ok' && posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        pageNumbers={pageNumbers}
                        goToPage={goToPage}
                    />
                </div>
            </section>
        </main>
    )
}
