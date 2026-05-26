import { useState, useEffect, useRef } from "react";
import "./HomePage.css";
 
const heroSlides = [
  {
    eyebrow: "Governança Corporativa",
    title: ["Influenciar e transformar as empresas brasileiras pela ", "governança", "."],
    image: "/images/hero-1.jpg",
    alt: "Governança corporativa",
    actions: [
      { label: "Associe-se", href: "/contato#associe-form", style: "primary" },
      { label: "Conhecer a ACB", href: "/quem-somos", style: "outline" },
    ],
  },
  {
    eyebrow: "Liderança",
    title: ["Construindo líderes preparados para os ", "desafios", " do mercado atual."],
    image: "/images/hero-2.jpg",
    alt: "Liderança",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
  {
    eyebrow: "Conexão",
    title: ["Conectando conselheiros e empresas para um ", "futuro sustentável", "."],
    image: "/images/hero-3.jpg",
    alt: "Conexão",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
  {
    eyebrow: "Excelência",
    title: ["Excelência em governança para empresas de ", "todos os segmentos", "."],
    image: "/images/hero-4.jpg",
    alt: "Excelência",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
  {
    eyebrow: "Cultura",
    title: ["Transformando a cultura organizacional brasileira ", "desde 2009", "."],
    image: "/images/hero-5.jpg",
    alt: "Cultura organizacional",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
];
 
const artigos = [
  { img: "/images/artigo-1.jpg", tag: "Governança", title: "Artigo 1", text: "Lorem ipsum dolor sit amet, consectetur adipiscing." },
  { img: "/images/artigo-2.jpg", tag: "Liderança", title: "Artigo 2", text: "Lorem ipsum dolor sit amet, consectetur adipiscing." },
  { img: "/images/artigo-3.jpg", tag: "Mercado", title: "Artigo 3", text: "Lorem ipsum dolor sit amet, consectetur adipiscing." },
];
 
const associados = [
  { img: "/images/associado-1.jpg", tag: "Conselheiro", title: "Associado 1", text: "Lorem ipsum dolor sit amet." },
  { img: "/images/associado-2.jpg", tag: "Conselheira", title: "Associado 2", text: "Lorem ipsum dolor sit amet." },
  { img: "/images/associado-3.jpg", tag: "Conselheiro", title: "Associado 3", text: "Lorem ipsum dolor sit amet." },
];
 
function HomePage() {
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState("artigos");
  const revealRefs = useRef([]);
 
  // Carrossel automático do hero
  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);
 
  // Reveal no scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
 
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
 
  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };
 
  const prevSlide = () => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setSlide((s) => (s + 1) % heroSlides.length);
 
  const cards = tab === "artigos" ? artigos : associados;
 
  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <button className="hero-arrow hero-arrow--prev" aria-label="Slide anterior" onClick={prevSlide}>
          &#8249;
        </button>
 
        <div className="hero-track">
          {heroSlides.map((s, i) => (
            <div key={i} className={`hero-slide ${i === slide ? "active" : ""}`}>
              <div className="hero-text">
                <span className="hero-eyebrow">{s.eyebrow}</span>
                <h1>
                  {s.title[0]}
                  <span>{s.title[1]}</span>
                  {s.title[2]}
                </h1>
                <div className="hero-actions">
                  {s.actions.map((a, j) => (
                    <a key={j} href={a.href} className={a.style === "primary" ? "btn-primary" : "btn-outline"}>
                      {a.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hero-image">
                <img src={s.image} alt={s.alt} />
              </div>
            </div>
          ))}
        </div>
 
        <button className="hero-arrow hero-arrow--next" aria-label="Próximo slide" onClick={nextSlide}>
          &#8250;
        </button>
 
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={`hero-dot ${i === slide ? "active" : ""}`}
              onClick={() => setSlide(i)}
            ></span>
          ))}
        </div>
      </section>
 
      {/* ── ARTIGOS / ASSOCIADOS ── */}
      <section className="cards-section">
        <div className="cards-tabs reveal" ref={addReveal}>
          <button
            className={`tab-btn ${tab === "artigos" ? "active" : ""}`}
            onClick={() => setTab("artigos")}
          >
            Artigos
          </button>
          <button
            className={`tab-btn ${tab === "associados" ? "active" : ""}`}
            onClick={() => setTab("associados")}
          >
            Associados
          </button>
        </div>
 
        <div className="cards-grid reveal" ref={addReveal}>
          <div className="card card--label">
            <div>
              <span className="card-label">{tab === "artigos" ? "Artigos recentes" : "Associados"}</span>
              <h2 className="card-headline">
                {tab === "artigos"
                  ? "Insights sobre governança e gestão"
                  : "Conselheiros que fazem a diferença"}
              </h2>
            </div>
            <a href={tab === "artigos" ? "/artigos" : "/quem-somos#founders"} className="card-link">
              Ver mais
            </a>
          </div>
 
          {cards.map((c, i) => (
            <div className="card card--photo" key={i}>
              <img src={c.img} alt={c.title} />
              <div className="card-overlay">
                <span className="card-tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── JORNADA CTA ── */}
      <section className="jornada">
        <div className="jornada-content">
          <div className="jornada-text reveal" ref={addReveal}>
            <span className="jornada-eyebrow">Faça parte</span>
            <h2>Sua jornada como membro começa aqui</h2>
            <p>
              Fundada em 2022, a Associação de Conselheiros do Brasil – ACB – nasce com intuito de
              despertar a consciência sobre a importância da governança, transformando positivamente
              a realidade das empresas brasileiras, em especial as PMEs.
            </p>
            <a href="/contato#associe-form" className="btn-outline">
              Associe-se agora
            </a>
          </div>
          <div className="jornada-image reveal" ref={addReveal}>
            <img src="/images/jornada.jpg" alt="Membros ACB" />
          </div>
        </div>
      </section>
 
      {/* ── MERCADO & ECONOMIA ── */}
      <section className="mercado">
        <div className="mercado-content">
          <div className="mercado-header reveal" ref={addReveal}>
            <div>
              <span className="mercado-eyebrow">Indicadores</span>
              <h2>Mercado &amp; Economia</h2>
              <p className="mercado-sub">Indicadores relevantes para governança corporativa</p>
            </div>
            <span className="mercado-update">Atualizado: 13/04/2025, 08:00</span>
          </div>
 
          <div className="mercado-grid">
            <div className="indicadores reveal" ref={addReveal}>
              <div className="indicador">
                <span className="ind-label">IBOVESPA</span>
                <span className="ind-value">128.450</span>
                <span className="ind-change positive">▲ 0,84%</span>
              </div>
              <div className="indicador">
                <span className="ind-label">USD/BRL</span>
                <span className="ind-value">R$ 5,72</span>
                <span className="ind-change negative">▼ 0,31%</span>
              </div>
              <div className="indicador">
                <span className="ind-label">SELIC</span>
                <span className="ind-value">10,50%</span>
                <span className="ind-change neutral">Meta anual</span>
              </div>
            </div>
 
            <div className="charts reveal" ref={addReveal}>
              <div className="chart-box">
                <span className="chart-title">Ibovespa — últimos 7 pregões</span>
                <svg viewBox="0 0 200 60" className="sparkline sparkline--green" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,50 30,42 60,38 90,30 120,35 160,20 200,15 200,60 0,60"
                    fill="url(#gradGreen)"
                  />
                  <polyline
                    points="0,50 30,42 60,38 90,30 120,35 160,20 200,15"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="chart-labels">
                  <span>07/04</span>
                  <span>08/04</span>
                  <span>09/04</span>
                  <span>10/04</span>
                  <span>11/04</span>
                  <span>14/04</span>
                  <span>17/04</span>
                </div>
              </div>
 
              <div className="chart-box">
                <span className="chart-title">Câmbio USD/BRL — 7 dias</span>
                <svg viewBox="0 0 200 60" className="sparkline sparkline--red" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,10 30,18 60,22 90,28 120,35 160,42 200,50 200,60 0,60"
                    fill="url(#gradRed)"
                  />
                  <polyline
                    points="0,10 30,18 60,22 90,28 120,35 160,42 200,50"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="chart-labels">
                  <span>07/04</span>
                  <span>08/04</span>
                  <span>09/04</span>
                  <span>10/04</span>
                  <span>11/04</span>
                  <span>14/04</span>
                  <span>17/04</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* ── SOBRE A ACB ── */}
      <section className="sobre">
        <div className="sobre-container">
          <div className="sobre-header reveal" ref={addReveal}>
            <span className="sobre-eyebrow">Quem somos</span>
            <h2>Sobre a ACB</h2>
          </div>
          <div className="sobre-body reveal" ref={addReveal}>
            <p className="sobre-lead">
              Fundada em 2022, a Associação de Conselheiros do Brasil – ACB – nasce com o intuito de
              despertar a consciência sobre a importância e a necessidade da adoção da governança,
              influenciando e transformando positivamente a realidade das empresas brasileiras, em
              especial as PMEs.
            </p>
 
            <div className="sobre-text">
              <p>
                Aliamos experiência, credibilidade e conhecimento, para orientar e ajudar a construir
                as melhores práticas de governança corporativa e otimização de processos.
              </p>
              <p>
                Acreditamos que disseminar, educar e incluir as PMEs no universo da governança
                corporativa, é o caminho para o desenvolvimento e crescimento forte e sustentável do
                mercado brasileiro.
              </p>
            </div>
 
            <div className="sobre-cta">
              <a href="/quem-somos" className="btn-primary">
                Conheça nossa história
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
 
export default HomePage;