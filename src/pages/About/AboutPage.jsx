import { useState, useEffect } from 'react';
import './AboutPage.css';

export default function AboutPage() {
  const [fundadores, setFundadores] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Lógica da API do WordPress
  useEffect(() => {
    const fetchFundadores = async () => {
      const WP_API = 'https://acbrasil.org.br/cms/wp-json/wp/v2';
      try {
        const res = await fetch(`${WP_API}/pages?search=quem+somos&per_page=20&_embed=1`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const pages = await res.json();

        // Filtra apenas as páginas com foto destacada
        const data = pages.filter(p => p._embedded?.['wp:featuredmedia']?.[0]?.source_url);
        setFundadores(data);
      } catch (err) {
        console.warn('Falha ao carregar fundadores:', err);
      } finally {
        setCarregando(false);
      }
    };

    fetchFundadores();
  }, []);

  // Lógica do Scroll Reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [fundadores, carregando]);

  // Helper para buscar a foto
  const getPhotoUrl = (page) => {
    const media = page._embedded?.['wp:featuredmedia']?.[0];
    if (!media) return null;
    const sizes = media.media_details?.sizes || {};
    
    let url = sizes.medium_large?.source_url ||
              sizes.large?.source_url ||
              sizes.medium?.source_url ||
              media.source_url ||
              null;

    // Força HTTPS para evitar bloqueio do navegador
    if (url && url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }

    return url;
  };

  return (
    <main>
      {/* ── HERO ── */}
      <section className="qs-hero">
        <div className="qs-hero-content">
          <div className="qs-hero-text">
            <span className="hero-eyebrow">Nossa história</span>
            <h1>Quem somos</h1>
            <p>
              Conheça a Associação que reúne os principais conselheiros do Brasil e promove a excelência em
              governança corporativa.
            </p>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="qs-about">
        <div className="qs-about-card reveal">
          <div className="qs-about-left">
            <span className="featured-tag"></span>
            <div className="year-block">
              <span className="year-big">2022</span>
              <span className="year-text">Ano de fundação</span>
            </div>
          </div>
          <div className="qs-about-right">
            <span className="card-cat">Nossa história</span>
            <h2>Mais de 4 anos fortalecendo a governança no Brasil</h2>
            <p>
              Ao longo desses anos, crescemos de forma consistente, reunindo conselheiros de administração,
              fiscais e consultivos de empresas dos mais variados portes e setores.
            </p>
            <p>
              Hoje somos a principal referência em governança corporativa para conselheiros no país, com uma
              comunidade ativa, conteúdo especializado e eventos de alto nível.
            </p>
          </div>
        </div>
      </section>

      {/* ── MISSÃO / VISÃO / VALORES ── */}
      <section className="qs-mvv">
        <div className="qs-section-content">
          <div className="qs-section-header reveal">
            <span className="hero-eyebrow qs-eyebrow-light">Identidade</span>
            <h2>Missão, Visão e Valores</h2>
            <p>Os pilares que norteiam todas as nossas ações e decisões como associação.</p>
          </div>

          <div className="qs-cards-grid qs-cards-grid--3">
            <article className="qs-card reveal">
              <div className="qs-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3>Missão</h3>
              <p>Reunir, capacitar e representar os conselheiros do Brasil, promovendo boas práticas e fortalecendo a cultura de transparência.</p>
            </article>
            <article className="qs-card reveal">
              <div className="qs-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3>Visão</h3>
              <p>Ser reconhecida como a principal referência em governança corporativa para conselheiros no Brasil.</p>
            </article>
            <article className="qs-card reveal">
              <div className="qs-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3>Valores</h3>
              <ul className="qs-values-list">
                <li><strong>Ética</strong> nas relações e práticas</li>
                <li><strong>Transparência</strong> em todas as ações</li>
                <li><strong>Excelência</strong> técnica e profissional</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ── O QUE FAZEMOS ── */}
      <section className="qs-what" id="oque-fazemos">
        <div className="qs-section-content">
          <div className="qs-section-header reveal">
            <span className="hero-eyebrow qs-eyebrow-dark">Atuação</span>
            <h2>O que fazemos</h2>
          </div>
          <div className="qs-cards-grid qs-cards-grid--4">
            <article className="qs-card reveal">
              <div className="qs-card-icon"><i className="fa-solid fa-graduation-cap"></i></div>
              <h3>Capacitação</h3>
              <p>Cursos e eventos voltados ao desenvolvimento contínuo dos conselheiros.</p>
            </article>
            <article className="qs-card reveal">
              <div className="qs-card-icon"><i className="fa-solid fa-users"></i></div>
              <h3>Networking</h3>
              <p>Encontros que aproximam profissionais criando conexões estratégicas.</p>
            </article>
            <article className="qs-card reveal">
              <div className="qs-card-icon"><i className="fa-solid fa-book-open"></i></div>
              <h3>Conteúdo</h3>
              <p>Artigos e relatórios sobre temas relevantes para a prática de conselheiros.</p>
            </article>
            <article className="qs-card reveal">
              <div className="qs-card-icon"><i className="fa-solid fa-landmark"></i></div>
              <h3>Representação</h3>
              <p>Atuamos junto a órgãos reguladores representando os nossos interesses.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── FUNDADORES ── */}
      <section className="qs-founders" id="founders">
        <div className="qs-section-content">
          <div className="qs-section-header reveal">
            <span className="hero-eyebrow qs-eyebrow-dark">Quem fundou</span>
            <h2>Conselheiros Fundadores</h2>
            <p>Conheça os profissionais que acreditaram na ideia e fundaram a ACBrasil.</p>
          </div>

          <div className="qs-founders-grid">
            {fundadores.length > 0 ? (
              fundadores.map((page) => {
                const photo = getPhotoUrl(page);
                const nameCleaned = page.title.rendered.replace(/<[^>]+>/g, '');
                
                return (
                  <a
                    key={page.id}
                    href={page.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qs-founder reveal"
                  >
                    <div className="qs-founder-photo">
                      {photo ? (
                        <img 
                          src={photo} 
                          alt={nameCleaned} 
                          loading="lazy" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="qs-avatar">{nameCleaned.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="qs-founder-name" dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
                    <span className="qs-founder-role">Conselheiro Fundador</span>
                  </a>
                );
              })
            ) : !carregando ? (
               <p style={{textAlign: "center", width: "100%", gridColumn: "1 / -1"}}>Não foi possível carregar os conselheiros.</p>
            ) : (
               <p style={{textAlign: "center", width: "100%", gridColumn: "1 / -1"}}>Carregando conselheiros...</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}