import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function QuemSomos() {
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
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <svg width="152" height="65" viewBox="0 0 152 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.710692 0.990234L33.7527 9.12427L43.6315 11.5425C45.2361 11.9308 47.1379 12.4373 48.7371 12.7448C48.6296 15.1744 48.7378 17.7227 48.7062 20.1613C48.7011 20.5501 48.7463 22.481 48.6952 22.7066C48.5507 22.7927 48.4862 22.782 48.3201 22.79C45.8565 23.1638 42.8153 23.4068 40.2934 23.6934L22.8771 25.6584L8.09489 27.321C5.93139 27.5628 2.73448 28.0218 0.61377 28.1375C0.808355 27.3615 0.988442 26.507 1.13109 25.7187C1.98337 21.009 3.22865 16.26 4.01798 11.5517L0.710692 0.990234Z" fill="#FBC20E"/>
              <path d="M4.01798 11.5518C7.15914 12.2296 10.7597 13.2085 13.9105 14.0004L34.4211 19.2096L43.2233 21.4149C44.062 21.6243 47.9077 22.5233 48.3201 22.7901C45.8565 23.1638 42.8153 23.4068 40.2934 23.6934L22.8771 25.6584L8.09489 27.321C5.93139 27.5629 2.73448 28.0219 0.61377 28.1375C0.808355 27.3615 0.988442 26.507 1.13109 25.7188C1.98337 21.009 3.22865 16.26 4.01798 11.5518Z" fill="#FDE6AC"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M56.404 14.6943C55.7019 14.5014 54.9838 14.3303 54.2656 14.1591C53.4402 13.9623 52.6145 13.7655 51.8125 13.5356L51.8162 54L51.8164 56.5L51.8169 62.5162C54.9159 62.588 58.108 62.5587 61.2121 62.5299C61.8752 62.5238 62.5444 62.534 63.2141 62.5442C66.9719 62.6015 70.7563 62.6591 73.6971 59.8429C74.1346 59.4261 74.5271 58.9642 74.8677 58.4647C75.9921 56.7822 76.8552 54.5615 76.9702 52.5246L76.9912 52.1563C77.3277 46.2461 77.7556 38.733 71.9384 35.2548C68.2302 33.0384 61.9236 33.442 58.3664 35.7759L58.3747 15.1597C57.766 15.062 57.007 14.8599 56.404 14.6943Z" fill="#FEFEFE"/>
            </svg>
          </Link>
          <nav className="header-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/artigos">Artigos</Link></li>
              <li><Link to="/sobre" className="active">Quem somos</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </nav>
          <Link to="/contato#associe-form" className="header-cta">Associe-se</Link>
          <button className="hamburger" aria-label="Abrir menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className="mobile-drawer">
          <nav className="mobile-drawer-nav">
            <Link to="/">Home</Link>
            <Link to="/artigos">Artigos</Link>
            <Link to="/sobre" className="active">Quem somos</Link>
            <Link to="/contato">Contato</Link>
            <Link to="/contato#associe-form" className="mobile-drawer-cta">Associe-se</Link>
          </nav>
        </div>
      </header>

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

        {/* ── FUNDADORES (Aqui a função getPhotoUrl é chamada!) ── */}
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

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
                <svg width="152" height="65" viewBox="0 0 152 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.710692 0.990234L33.7527 9.12427L43.6315 11.5425C45.2361 11.9308 47.1379 12.4373 48.7371 12.7448C48.6296 15.1744 48.7378 17.7227 48.7062 20.1613C48.7011 20.5501 48.7463 22.481 48.6952 22.7066C48.5507 22.7927 48.4862 22.782 48.3201 22.79C45.8565 23.1638 42.8153 23.4068 40.2934 23.6934L22.8771 25.6584L8.09489 27.321C5.93139 27.5628 2.73448 28.0218 0.61377 28.1375C0.808355 27.3615 0.988442 26.507 1.13109 25.7187C1.98337 21.009 3.22865 16.26 4.01798 11.5517L0.710692 0.990234Z" fill="#FBC20E"/>
                </svg>
            </div>
            <p className="brand-description">
              Associação de Conselheiros do Brasil — promovendo excelência em governança corporativa desde 2022.
            </p>
            <div className="social-icons">
              <a href="https://www.linkedin.com/company/associacao-de-conselheiros-do-brasil/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://www.youtube.com/@acbrasil" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://www.instagram.com/acbrasil.oficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram fa-1x"></i>
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Navegação</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/artigos">Artigos</Link></li>
              <li><Link to="/sobre">Quem somos</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contato</h3>
            <div className="contact-info">
              <p><a className="contact-link" href="mailto:contato@acbrasil.org">contato@acbrasil.org</a></p>
              <p><a className="contact-link" href="tel:+5521987654321">(21) 98765-4321</a></p>
              <p className="location">Rio de Janeiro - RJ</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Associação de Conselheiros do Brasil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}