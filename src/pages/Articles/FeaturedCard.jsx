import { pickImage, pickCategoryName, stripHtml, formatDate, readingTime } from '../../services/acbApi'

export default function FeaturedCard({ post }) {
    const img = pickImage(post)

    const backgroundStyle = img
        ? {
            backgroundImage: `linear-gradient(135deg, rgba(15,15,61,0.85) 0%, rgba(30,30,107,0.85) 100%), url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : undefined

    return (
        <section className="featured">
            <div className="featured-card reveal in">
                <div className="featured-left" style={backgroundStyle}>
                    <span className="featured-tag">Em destaque</span>
                </div>
                <div className="featured-right">
                    <span className="card-cat">{pickCategoryName(post)}</span>
                    <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <p>{stripHtml(post.excerpt.rendered).slice(0, 220) + '…'}</p>
                    <div className="featured-meta">
                        <span className="meta-info">
                            {formatDate(post.date)} ·{' '}
                            {readingTime(post.content?.rendered || post.excerpt?.rendered)} min de leitura
                        </span>
                        <a href={post.link} className="read-link" target="_blank" rel="noopener">
                            Ler Artigo →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
