import { useState, useEffect, useRef } from "react";
import "./ContactPage.css";

export default function Contato() {
  const handlePhoneInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };

  const removeEmojis = (text) => {
  return text.replace(
    /[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu,
    ""
  );
};

const handleEmailInput = (e) => {
  e.target.value = removeEmojis(e.target.value);
};

const handleTextInput = (e) => {
  e.target.value = removeEmojis(e.target.value);
};

const handleNameInput = (e) => {
  let value = removeEmojis(e.target.value);

  // remove números
  value = value.replace(/[0-9]/g, "");

  e.target.value = value;
};

  return (
    <main>
      {/* HERO */}
      <section className="contato-hero">
        <div className="contato-hero-content">
          <div className="contato-hero-text">
            <span className="hero-eyebrow">Fale conosco</span>
            <h1>Contato & Associe-se</h1>
            <p>
              Tem alguma dúvida ou quer saber mais sobre a ACBrasil?
              Estamos aqui para ajudar.
            </p>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section className="contato-section">
        <div className="contato-grid">

          {/* INFO */}
          <aside className="contato-info">
            <span className="card-cat">Canais</span>

            <h2>Vamos conversar?</h2>

            <p className="info-desc">
              Preencha o formulário ao lado ou use um dos nossos canais de
              contato. Nossa equipe responde em até 2 dias úteis.
            </p>

            <ul className="info-list">
              <li className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>

                <div>
                  <span className="info-label">E-mail</span>
                  <a
                    href="mailto:contato@acbrasil.org"
                    className="info-value"
                  >
                    contato@acbrasil.org
                  </a>
                </div>
              </li>

              <li className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>

                <div>
                  <span className="info-label">Telefone</span>
                  <a
                    href="tel:+5521987654321"
                    className="info-value"
                  >
                    (21) 98765-4321
                  </a>
                </div>
              </li>

              <li className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                <div>
                  <span className="info-label">Localização</span>
                  <span className="info-value">
                    Rio de Janeiro — RJ
                  </span>
                </div>
              </li>

              <li className="info-item">
                <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                </div>

                <div>
                  <span className="info-label">LinkedIn</span>

                  <a
                    href="https://www.linkedin.com/company/associacao-de-conselheiros-do-brasil/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-value"
                  >
                    Associação de Conselheiros do Brasil
                  </a>
                </div>
              </li>
            </ul>

            <div className="info-social">
              <span className="info-social-label">
                Nossas redes
              </span>

              <div className="social-icons">
                <a
                  href="https://www.linkedin.com/company/associacao-de-conselheiros-do-brasil/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin"></i>
                </a>

                <a
                  href="https://www.youtube.com/@acbrasil"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>

                <a
                  href="https://www.instagram.com/acbrasil.oficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>
            </div>
          </aside>

          {/* FORM CONTATO */}
          <div className="form-card">
            <span className="card-cat">Mensagem</span>

            <h3>Envie sua mensagem</h3>

            <p className="form-card-sub">
              Conte-nos como podemos ajudar.
            </p>

            <form className="contato-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-nome">
                    Nome <span className="required">*</span>
                  </label>

                 <input
                  type="text"
                  id="contact-nome"
                  placeholder="Seu nome completo"
                  onInput={handleNameInput}
                  required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">
                    E-mail <span className="required">*</span>
                  </label>

                  <input
                    type="email"
                    id="contact-email"
                    placeholder="seu@email.com"
                    onInput={handleEmailInput}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-assunto">
                  Assunto <span className="required">*</span>
                </label>

                <div className="select-wrap">
                  <select id="contact-assunto" required defaultValue="">
                    <option value="" disabled>
                      Selecione um assunto
                    </option>
                    <option>Associação</option>
                    <option>Eventos</option>
                    <option>Parcerias</option>
                    <option>Imprensa</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-mensagem">
                  Mensagem <span className="required">*</span>
                </label>

                <textarea
                  id="contact-mensagem"
                  rows="5"
                  placeholder="Escreva sua mensagem aqui..."
                  onInput={handleTextInput}
                  required
                />
              </div>

              <button
                type="submit"
                className="form-submit"
              >
                Enviar mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="associe">
        <div className="associe-content">
          <div className="associe-header">
            <span className="hero-eyebrow associe-eyebrow">
              Associe-se
            </span>

            <h2>Faça parte da ACBrasil</h2>

            <p>
              Junte-se à maior rede de conselheiros do Brasil e tenha acesso
              a benefícios exclusivos.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3>Capacitação</h3>
              <p>
                Acesso a cursos, workshops e eventos exclusivos para membros.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3>Conteúdo exclusivo</h3>
              <p>
                Pesquisas, guias e publicações disponíveis apenas para associados.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <h3>Networking</h3>
              <p>
                Acesso à comunidade de conselheiros e eventos de networking.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="22" x2="21" y2="22" />
                  <line x1="6" y1="18" x2="6" y2="11" />
                  <line x1="10" y1="18" x2="10" y2="11" />
                  <line x1="14" y1="18" x2="14" y2="11" />
                  <line x1="18" y1="18" x2="18" y2="11" />
                  <polygon points="12 2 20 7 4 7" />
                </svg>
              </div>
              <h3>Representação</h3>
              <p>
                Voz nos fóruns e entidades que discutem governança no Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM ASSOCIAÇÃO */}
      <section id="associe-form" className="associe-form">
        <div className="associe-form-wrap">
          <div className="form-card form-card--wide">
            <span className="card-cat">Solicitação</span>

            <h3>Solicitação de associação</h3>

            <p className="form-card-sub">
              Preencha seus dados — entraremos em contato em até
              2 dias úteis.
            </p>

            <form className="contato-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assoc-nome">
                    Nome completo
                    <span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    id="assoc-nome"
                    placeholder="Seu nome completo"
                    onInput={handleNameInput}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assoc-email">
                    E-mail
                    <span className="required">*</span>
                  </label>

                  <input
                    type="email"
                    id="assoc-email"
                    placeholder="seu@email.com"
                    onInput={handleEmailInput}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assoc-tel">
                    Telefone
                  </label>

                  <input
                    type="tel"
                    id="assoc-tel"
                    placeholder="(11) 99999-9999"
                    onInput={handlePhoneInput}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assoc-empresa">
                    Empresa
                  </label>

                  <input
                    type="text"
                    id="assoc-empresa"
                    placeholder="Nome da empresa"
                    onInput={handleTextInput}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="assoc-cargo">
                  Cargo atual
                  <span className="required">*</span>
                </label>

                <div className="select-wrap">
                  <select
                    id="assoc-cargo"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione seu perfil
                    </option>
                    <option>Conselheiro Independente</option>
                    <option>CEO / Presidente</option>
                    <option>Diretor</option>
                    <option>Executivo</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="assoc-linkedin">
                  LinkedIn
                </label>

                <input
                  type="url"
                  id="assoc-linkedin"
                  placeholder="https://linkedin.com/in/seu-perfil"
                  onInput={handleTextInput}
                />
              </div>

              <div className="form-group">
                <label htmlFor="assoc-motivo">
                  Por que deseja se associar?
                  <span className="required">*</span>
                </label>

                <textarea
                  id="assoc-motivo"
                  rows="5"
                  placeholder="Conte-nos um pouco sobre sua trajetória e motivação..."
                  onInput={handleTextInput}
                  required
                />
              </div>

              <button
                type="submit"
                className="form-submit form-submit--gold"
              >
                Enviar solicitação
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}