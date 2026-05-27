import { useState, useEffect, useRef } from "react";
import "./ContactPage.css";

export default function Contato() {
  const handlePhoneInput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
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
                  ✉
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
                  ☎
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
                  📍
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
                  in
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
            {[
              {
                title: "Capacitação",
                desc: "Acesso a cursos, workshops e eventos exclusivos para membros.",
              },
              {
                title: "Conteúdo exclusivo",
                desc: "Pesquisas, guias e publicações disponíveis apenas para associados.",
              },
              {
                title: "Networking",
                desc: "Acesso à comunidade de conselheiros e eventos de networking.",
              },
              {
                title: "Representação",
                desc: "Voz nos fóruns e entidades que discutem governança no Brasil.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="benefit-card"
              >
                <div className="benefit-icon">★</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
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