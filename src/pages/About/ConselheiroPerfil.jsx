import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ConselheiroPerfil.css';

const WP_API = 'https://acbrasil.org.br/cms/wp-json/wp/v2';

export default function ConselheiroPerfil() {
  const { id } = useParams();
  const [conselheiro, setConselheiro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false)
 
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);;

  useEffect(() => {
    const fetchConselheiro = async () => {
      setCarregando(true);
      setErro(false);
      try {
        const res = await fetch(`${WP_API}/pages/${id}?_embed=1`, {
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          console.error(`Erro HTTP: ${res.status}`);
          setErro(true);
          return;
        }

        const data = await res.json();
        setConselheiro(data);
      } catch (err) {
        console.error('Falha de conexão:', err.message);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    };

    if (id) fetchConselheiro();
  }, [id]);

  const getPhotoUrl = (page) => {
    const media = page._embedded?.['wp:featuredmedia']?.[0];
    if (!media) return null;
    const sizes = media.media_details?.sizes || {};
    let url =
      sizes.large?.source_url ||
      sizes.medium_large?.source_url ||
      sizes.medium?.source_url ||
      media.source_url ||
      null;
    if (url && url.startsWith('http://')) url = url.replace('http://', 'https://');
    return url;
  };

  const getConteudo = (page) => {
    const raw = page.content?.rendered || '';
    if (!raw) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = raw;

    // 1. Remove qualquer cabeçalho (h1, h2, h3) do WordPress
    tempDiv.querySelectorAll('h1, h2, h3, h4').forEach(el => el.remove());

    // 2. Remoção cirúrgica do lixo de navegação
    tempDiv.querySelectorAll('p, span, div, a').forEach(el => {
      const txt = el.textContent.trim();
      
      // TRAVA: Se for grande, é a biografia! Ignora.
      if (txt.length > 60) return; 

      if (
        txt === 'Associados fundadores' ||
        txt === 'Início' ||
        txt === 'Sample Page' ||
        txt === 'Início / Sample Page' ||
        txt === 'Início /' ||
        txt.includes('Todos os associados')
      ) {
        el.remove();
      }
    });

    // 3. A MÁGICA CONTRA OS BURACOS: Destrói caixas vazias e estilos forçados
    // Pegamos todos os elementos e olhamos de dentro para fora (.reverse())
    const todosElementos = Array.from(tempDiv.querySelectorAll('*')).reverse();
    
    todosElementos.forEach(el => {
      const temTexto = el.textContent.trim().length > 0;
      const temImagem = el.querySelector('img') !== null || el.tagName === 'IMG';
      
      // Se não tem texto nenhum e não tem imagem, é um "fantasma" de layout. Apaga!
      if (!temTexto && !temImagem) {
        el.remove();
      } else {
        // Se tem conteúdo útil, removemos os estilos inline (margens/paddings gigantes do WP)
        el.removeAttribute('style');
      }
    });

    return tempDiv.innerHTML.trim();
  };


  /* ── Loading ── */
  if (carregando) {
    return (
      <main className="cp-wrapper">
        <div className="cp-loading">
          <div className="cp-spinner" />
          <p>Carregando perfil…</p>
        </div>
      </main>
    );
  }

  /* ── Erro ── */
  if (erro || !conselheiro) {
    return (
      <main className="cp-wrapper">
        <div className="cp-error">
          <h2>Perfil não encontrado</h2>
          <p>Não foi possível carregar as informações deste conselheiro.</p>
          <Link to="/quem-somos" className="cp-back-btn">
            ← Voltar para Quem Somos
          </Link>
        </div>
      </main>
    );
  }

  const photo = getPhotoUrl(conselheiro);
  const name = conselheiro.title?.rendered?.replace(/<[^>]+>/g, '') ?? '';
  const conteudo = getConteudo(conselheiro);

  return (
    <main className="cp-wrapper">
      {/* ── Breadcrumb ── */}
      <div className="cp-breadcrumb">
        <div className="cp-breadcrumb-inner">
          <Link to="/quem-somos">Quem Somos</Link>
          <span className="cp-breadcrumb-sep">›</span>
          <span>{name}</span>
        </div>
      </div>

      {/* ── Hero / Perfil ── */}
      <section className="cp-hero">
        <div className="cp-hero-inner">
          <div className="cp-photo-col">
            <div className="cp-photo-frame">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="cp-avatar-fallback">
                  {name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="cp-photo-accent" />
            </div>
          </div>

          <div className="cp-info-col">
            <span className="cp-eyebrow">Conselheiro Fundador</span>
            <h1 dangerouslySetInnerHTML={{ __html: conselheiro.title?.rendered }} />

            {conteudo ? (
              <div
                className="cp-bio"
                dangerouslySetInnerHTML={{ __html: conteudo }}
              />
            ) : (
              <p className="cp-bio cp-bio--empty">
                Biografia em breve.
              </p>
            )}

            <Link to="/quem-somos" className="cp-back-btn">
              ← Voltar para Quem Somos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}