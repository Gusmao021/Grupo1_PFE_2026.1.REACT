import { Link } from 'react-router-dom'
import { pickImage, pickCategoryName, stripHtml, formatDate, readingTime } from '../../services/acbApi'

export default function PostCard({ post }) {
    const img = pickImage(post)
    const title = stripHtml(post.title.rendered)
    
    // Filtro de limpeza do nome da categoria
    const rawCatName = pickCategoryName(post) || '';
    const catName = rawCatName.replace(/&amp;/g, '&').replace('M&a', 'M&A');

    return (
        <article className="pub-card reveal">
            <div className="pub-image">
                {img && <img src={img} alt={title} loading="lazy" />}
                {/* Usamos a nossa variável limpa aqui */}
                <span className="pub-cat">{catName}</span>
            </div>
            <div className="pub-body">
                <span className="pub-meta">
                    {formatDate(post.date)} ·{' '}
                    {readingTime(post.content?.rendered || post.excerpt?.rendered)} min de leitura
                </span>
                <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <p>{stripHtml(post.excerpt.rendered).slice(0, 140) + '…'}</p>
                <Link to={`/artigos/${post.slug}`} className="read-link">
                    Ler Artigo →
                </Link>
            </div>
        </article>
    )
}