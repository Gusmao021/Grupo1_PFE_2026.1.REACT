
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import {
  fetchHeroImages,
  fetchHomeArticles,
  fetchHomeAssociados,
} from "../../services/acbApi";
import {
  getMarketIndex,
  getUsdBrl,
  getSelic,
} from "../../services/stockMarketApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  Tooltip,
} from "recharts";
 


 
const heroSlidesDefault = [
  {
    eyebrow: "Governança Corporativa",
    title: ["Influenciar e transformar as empresas brasileiras pela ", "governança", "."],
    image: null,
    alt: "Governança corporativa",
    actions: [
      { label: "Associe-se", href: "/contato#associe-form", style: "primary" },
      { label: "Conhecer a ACB", href: "/quem-somos", style: "outline" },
    ],
  },
  {
    eyebrow: "Liderança",
    title: ["Construindo líderes preparados para os ", "desafios", " do mercado atual."],
    image: null,
    alt: "Liderança",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
  {
    eyebrow: "Conexão",
    title: ["Conectando conselheiros e empresas para um ", "futuro sustentável", "."],
    image: null,
    alt: "Conexão",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
  {
    eyebrow: "Excelência",
    title: ["Excelência em governança para empresas de ", "todos os segmentos", "."],
    image: null,
    alt: "Excelência",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
  {
    eyebrow: "Cultura",
    title: ["Transformando a cultura organizacional brasileira ", "desde 2022", "."],
    image: null,
    alt: "Cultura organizacional",
    actions: [{ label: "Saiba mais", href: "/artigos", style: "primary" }],
  },
];
 
const artigosDefault = [
  { img: "/images/artigo-1.jpg", tag: "Governança", title: "Insights sobre governança", text: "Conteudo recente da ACBrasil.", link: null },
  { img: "/images/artigo-2.jpg", tag: "Liderança", title: "Liderança e conselhos", text: "Conteudo recente da ACBrasil.", link: null },
  { img: "/images/artigo-3.jpg", tag: "Mercado", title: "Mercado e governança", text: "Conteudo recente da ACBrasil.", link: null },
];
 
const associadosDefault = [
  { img: "/images/associado-1.jpg", tag: "Conselheiro", title: "Associado 1", text: "Conselheiro associado da ACBrasil.", link: null },
  { img: "/images/associado-2.jpg", tag: "Conselheira", title: "Associado 2", text: "Conselheira associada da ACBrasil.", link: null },
  { img: "/images/associado-3.jpg", tag: "Conselheiro", title: "Associado 3", text: "Conselheiro associado da ACBrasil.", link: null },
];
 
const mercadoDefault = {
  ibov: { label: "IBOVESPA", value: "128.450", change: "▲ 0,84%", isPositive: true, series: null },
  usd: { label: "USD/BRL", value: "R$ 5,72", change: "▼ 0,31%", isPositive: false, series: null },
  selic: { label: "SELIC", value: "10,50%", change: "Meta anual", isNeutral: true, series: null },
  updatedAt: null,
};

// Series de fallback (caso a API nao traga dados historicos)
const SERIES_FALLBACK = {
  ibov: [126100, 126800, 127200, 126900, 127600, 128100, 128450],
  usd: [5.6, 5.63, 5.61, 5.66, 5.68, 5.7, 5.72],
  // SELIC em "degraus" (cortes graduais do Copom)
  selic: [11.25, 11.25, 10.75, 10.75, 10.5, 10.5],
};

// Formatadores de valor pro tooltip de cada indicador
const fmt = {
  ibov: (v) => v.toLocaleString("pt-BR", { maximumFractionDigits: 0 }),
  usd: (v) =>
    `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  selic: (v) =>
    `${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
};



function SparkTooltip({ active, payload, color, formatValue }) {
  if (!active || !payload || !payload.length) return null;
  const v = payload[0].value;
  return (
    <div className="spark-tip" style={{ borderColor: color }}>
      <span className="spark-tip-dot" style={{ background: color }} />
      {formatValue ? formatValue(v) : v}
    </div>
  );
}

function Sparkline({ data, color, gradId, formatValue }) {
  const chartData = (data && data.length ? data : [0, 0]).map((v, i) => ({ i, v }));
  const lastIdx = chartData.length - 1;

  // Ponto pulsante apenas no ultimo valor (pulso via SMIL, sem distorcao)
  const renderDot = (props) => {
    const { cx, cy, index } = props;
    if (index !== lastIdx || cx == null || cy == null) return <g key={`d-${index}`} />;
    return (
      <g key={`d-${index}`}>
        <circle cx={cx} cy={cy} r={3.5} fill={color} opacity={0.3}>
          <animate attributeName="r" values="3.5;9;3.5" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r={3.2} fill={color} stroke="#fff" strokeWidth={1.6} />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={chartData} margin={{ top: 8, right: 10, bottom: 4, left: 10 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Tooltip
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
          content={<SparkTooltip color={color} formatValue={formatValue} />}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradId})`}
          dot={renderDot}
          activeDot={{ r: 4, strokeWidth: 0, fill: color }}
          isAnimationActive
          animationDuration={1100}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
 
function formatUpdate(date) {
  if (!date) return "Atualizado: --";
  return `Atualizado: ${date.toLocaleDateString("pt-BR")}, ${date
    .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}
 
// ──────────────────────────────────────────────────────────────
// Componente
// ──────────────────────────────────────────────────────────────
 
function HomePage() {
  const navigate = useNavigate();
  const [heroSlides, setHeroSlides] = useState(heroSlidesDefault);
  const [artigos, setArtigos] = useState(artigosDefault);
  const [associados, setAssociados] = useState(associadosDefault);
  const [mercado, setMercado] = useState(mercadoDefault);
 
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState("artigos");
  const revealRefs = useRef([]);
 
  // ── Imagens reais do hero ──
  useEffect(() => {
    fetchHeroImages(5).then((urls) => {
      if (!urls.length) return;
      setHeroSlides((slides) =>
        slides.map((s, i) => (urls[i] ? { ...s, image: urls[i] } : s))
      );
    });
  }, []);
 
  // ── Artigos reais ──
  useEffect(() => {
    fetchHomeArticles(3).then((items) => {
      if (items.length) setArtigos(items);
    });
  }, []);
 
  // ── Associados reais ──
  useEffect(() => {
    fetchHomeAssociados(3).then((items) => {
      if (items.length) setAssociados(items);
    });
  }, []);
 
  // ── Indicadores de mercado (paralelo, tolerante a falha) ──
  useEffect(() => {
    Promise.allSettled([getMarketIndex(), getUsdBrl(), getSelic()]).then(
      (results) => {
        const [ibovRes, usdRes, selicRes] = results;
        setMercado((m) => ({
          ibov: ibovRes.status === "fulfilled" && ibovRes.value ? ibovRes.value : m.ibov,
          usd: usdRes.status === "fulfilled" && usdRes.value ? usdRes.value : m.usd,
          selic: selicRes.status === "fulfilled" && selicRes.value ? selicRes.value : m.selic,
          updatedAt: new Date(),
        }));
      }
    );
  }, []);
 
  // ── Carrossel automatico ──
  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [heroSlides.length]);
 
  // ── Reveal no scroll ──
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
 
  // Clique no card: artigos com slug abrem a página interna;
  // demais (associados) seguem abrindo o link externo em nova aba.
  const openCard = (card) => {
    if (card.slug) {
      navigate(`/artigos/${card.slug}`);
    } else if (card.link) {
      window.open(card.link, "_blank", "noopener,noreferrer");
    }
  };
 
  // Helper: classe de mudanca (positive / negative / neutral)
  const changeClass = (item) =>
    item.isNeutral ? "neutral" : item.isPositive ? "positive" : "negative";
 
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
                    <a
                      key={j}
                      href={a.href}
                      className={a.style === "primary" ? "btn-primary" : "btn-outline"}
                    >
                      {a.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hero-image">
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.alt}
                    loading="lazy"
                    className="hero-image-fade"
                  />
                )}
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
              <span className="card-label">
                {tab === "artigos" ? "Artigos recentes" : "Associados"}
              </span>
              <h2 className="card-headline">
                {tab === "artigos"
                  ? "Insights sobre governança e gestão"
                  : "Conselheiros que fazem a diferença"}
              </h2>
            </div>
            <a
              href={tab === "artigos" ? "/artigos" : "/quem-somos#founders"}
              className="card-link"
            >
              Ver mais
            </a>
          </div>
 
          {cards.map((c, i) => (
            <div
              className={`card card--photo ${tab === "associados" ? "card--retrato" : "card--banner"}`}
              key={i}
              onClick={() => openCard(c)}
              style={{
                ...(c.slug || c.link ? { cursor: "pointer" } : {}),
                // o mesmo banner vira fundo desfocado atrás da imagem inteira
                ...(tab === "artigos" && c.img ? { backgroundImage: `url(${c.img})` } : {}),
              }}
            >
              {c.img && <img src={c.img} alt={c.title} loading="lazy" />}
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
            <a href="/contato#associe-form" className="btn-primary">
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
            <span className="mercado-update">{formatUpdate(mercado.updatedAt)}</span>
          </div>
 
          <div className="mercado-grid">
            <div className="indicadores reveal" ref={addReveal}>
              <div className="indicador">
                <span className="ind-label">{mercado.ibov.label}</span>
                <span className="ind-value">{mercado.ibov.value}</span>
                <span className={`ind-change ${changeClass(mercado.ibov)}`}>
                  {mercado.ibov.change}
                </span>
              </div>
              <div className="indicador">
                <span className="ind-label">{mercado.usd.label}</span>
                <span className="ind-value">{mercado.usd.value}</span>
                <span className={`ind-change ${changeClass(mercado.usd)}`}>
                  {mercado.usd.change}
                </span>
              </div>
              <div className="indicador">
                <span className="ind-label">{mercado.selic.label}</span>
                <span className="ind-value">{mercado.selic.value}</span>
                <span className={`ind-change ${changeClass(mercado.selic)}`}>
                  {mercado.selic.change}
                </span>
              </div>
            </div>
 
            <div className="charts reveal" ref={addReveal}>
              <div className="chart-box">
                <span className="chart-title">Ibovespa — últimos pregões</span>
                <Sparkline
                  data={mercado.ibov.series || SERIES_FALLBACK.ibov}
                  color="#16a34a"
                  gradId="gradGreen"
                  formatValue={fmt.ibov}
                />
              </div>

              <div className="chart-box">
                <span className="chart-title">Câmbio USD/BRL — 7 dias</span>
                <Sparkline
                  data={mercado.usd.series || SERIES_FALLBACK.usd}
                  color="#dc2626"
                  gradId="gradRed"
                  formatValue={fmt.usd}
                />
              </div>

              <div className="chart-box">
                <span className="chart-title">SELIC — meta (Copom)</span>
                <Sparkline
                  data={mercado.selic.series || SERIES_FALLBACK.selic}
                  color="#f5b800"
                  gradId="gradGold"
                  formatValue={fmt.selic}
                />
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