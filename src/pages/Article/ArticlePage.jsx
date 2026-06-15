import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './ArticlePage.css'
import {
    fetchPostBySlug,
    pickImage,
    pickCategoryName,
    stripHtml,
    formatDate,
    readingTime,
} from '../../services/acbApi'

export default function ArticlePage() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [status, setStatus] = useState('loading') // loading | ok | notfound | error

   useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        let active = true
        let isFetching = true // Trava de segurança contra internet rápida demais

        // Joga o reset para o próximo ciclo de eventos (evita o erro de Cascading Renders)
        setTimeout(() => {
            if (active && isFetching) {
                setStatus('loading')
                setPost(null)
            }
        }, 0)

        fetchPostBySlug(slug)
            .then(data => {
                isFetching = false // A API respondeu
                if (!active) return
                if (!data) {
                    setStatus('notfound')
                    return
                }
                setPost(data)
                setStatus('ok')
            })
            .catch(() => {
                isFetching = false
                if (active) setStatus('error')
            })

        return () => {
            active = false
        }
    }, [slug])

    if (status === 'loading') {
        return <main className="article-page"><div className="article-state">Carregando artigo…</div></main>
    }

    if (status === 'notfound') {
        return (
            <main className="article-page">
                <div className="article-state">
                    <p>Artigo não encontrado.</p>
                    <Link to="/artigos" className="article-back">← Voltar para Artigos</Link>
                </div>
            </main>
        )
    }

    if (status === 'error') {
        return (
            <main className="article-page">
                <div className="article-state article-state--error">
                    <p>Não foi possível carregar o artigo. Tente novamente em instantes.</p>
                    <Link to="/artigos" className="article-back">← Voltar para Artigos</Link>
                </div>
            </main>
        )
    }

    const img = pickImage(post)

    return (
        <main className="article-page">
            <article className="article">
                <header className="article-header">
                    <Link to="/artigos" className="article-back">← Voltar para Artigos</Link>
                    <span className="article-cat">{pickCategoryName(post)}</span>
                    <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <span className="article-meta">
                        {formatDate(post.date)} ·{' '}
                        {readingTime(post.content?.rendered || post.excerpt?.rendered)} min de leitura
                    </span>
                </header>

                {img && (
                    <div className="article-hero">
                        <img src={img} alt={stripHtml(post.title.rendered)} />
                    </div>
                )}

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
            </article>
        </main>
    )
}
