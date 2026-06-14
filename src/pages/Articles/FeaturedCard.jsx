import { Link } from 'react-router-dom'
import { pickImage, pickCategoryName, stripHtml, formatDate, readingTime } from '../../services/acbApi'

export default function FeaturedCard({ post }) {
    const img = pickImage(post)

    // Filtro de limpeza do nome da categoria
    const rawCatName = pickCategoryName(post) || '';
    const catName = rawCatName.replace(/&amp;/g, '&').replace('M&a', 'M&A');

    const backgroundStyle = img
        ? {
            backgroundImage: `
                linear-gradient(135deg, rgba(15, 15, 61, 0.88) 0%, rgba(30, 30, 107, 0.88) 100%), 
                url(${img}), 
                url(${img})
            `,
            backgroundSize: 'cover, contain, cover',
            backgroundPosition: 'center, center, center',
            backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
        }
        : undefined

    return (
        <section className="featured">
            <div className="featured-card reveal in">
                <div className="featured-left" style={backgroundStyle}>
                    <span className="featured-tag">Em destaque</span>
                </div>
                <div className="featured-right">
                    {/* Usamos a nossa variável limpa aqui */}
                    <span className="card-cat">{catName}</span>
                    <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <p>{stripHtml(post.excerpt.rendered).slice(0, 220) + '…'}</p>
                    <div className="featured-meta">
                        <span className="meta-info">
                            {formatDate(post.date)} ·{' '}
                            {readingTime(post.content?.rendered || post.excerpt?.rendered)} min de leitura
                        </span>
                        <Link to={`/artigos/${post.slug}`} className="read-link">
                            Ler Artigo →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}