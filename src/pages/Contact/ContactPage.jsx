import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ContactPage.css";

// Funções puras auxiliares de limpeza e máscara (isoladas do ciclo de renderização)
const removeEmojis = (text) => {
  return text.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "");
};

const maskCpf = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  } else if (digits.length > 6) {
    return digits.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else if (digits.length > 3) {
    return digits.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  }
  return digits;
};

const maskCep = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return digits.replace(/(\d{5})(\d{1,3})/, "$1-$2");
  }
  return digits;
};

const maskPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 6) {
    return digits.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
  } else if (digits.length > 2) {
    return digits.replace(/(\d{2})(\d{1,5})/, "($1) $2");
  }
  return digits;
};

export default function Contato() {
  const location = useLocation();

  // Estados centralizados para cada formulário
  const [contactForm, setContactForm] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const [assocForm, setAssocForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cpf: "",
    cep: "",
    cargo: "",
    linkedin: "",
    motivo: "",
  });

  // Estado para capturar mensagens de erro customizadas
  const [formErrors, setFormErrors] = useState({});

  // Efeito para rolar a tela suavemente até a âncora
  useEffect(() => {
    if (location.hash === "#associe-form") {
      const element = document.getElementById("associe-form");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Manipuladores de mudança (onChange) otimizados
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "nome") {
      processedValue = removeEmojis(value).replace(/[0-9]/g, "");
    } else if (name === "email" || name === "mensagem") {
      processedValue = removeEmojis(value);
    }

    setContactForm((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleAssocChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "nome") {
      processedValue = removeEmojis(value).replace(/[0-9]/g, "");
    } else if (name === "email" || name === "empresa" || name === "motivo" || name === "linkedin") {
      processedValue = removeEmojis(value);
    } else if (name === "cpf") {
      processedValue = maskCpf(value);
    } else if (name === "cep") {
      processedValue = maskCep(value);
    } else if (name === "telefone") {
      processedValue = maskPhone(value);
    }

    setAssocForm((prev) => ({ ...prev, [name]: processedValue }));

    // Limpa o erro do campo correspondente assim que o usuário digita algo válido
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  //Submissões controladas prontas para consumo de APIs
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      // Usamos o endpoint /ajax/ do FormSubmit para evitar o redirecionamento de página
      const response = await fetch("https://formsubmit.co/ajax/devwebtms@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        console.log("Submit Contato:", contactForm);
        alert("Mensagem enviada com sucesso!");
        // Limpa o formulário após envio com sucesso
        setContactForm({ nome: "", email: "", assunto: "", mensagem: "" });
      } else {
        alert("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Ocorreu um erro de conexão.");
    }
  };
  
  const handleAssocSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validação estendida de tamanho mínimo com as máscaras aplicadas
    if (assocForm.cpf.length < 14) {
      errors.cpf = "Insira um CPF válido com 11 dígitos.";
    }
    if (assocForm.cep.length < 9) {
      errors.cep = "Insira um CEP válido com 8 dígitos.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Interrompe o envio se houver inconsistências
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/devwebtms@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(assocForm)
      });

      if (response.ok) {
        console.log("Submit Associação:", assocForm);
        alert("Solicitação de associação enviada com sucesso!");
        
        setAssocForm({
          nome: "", email: "", telefone: "", empresa: "",
          cpf: "", cep: "", cargo: "", linkedin: "", motivo: ""
        });
      } else {
        alert("Ocorreu um erro ao enviar a solicitação. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      alert("Ocorreu um erro de conexão.");
    }
  };

  const errorStyle = {
    color: "var(--red-500)",
    fontSize: "12px",
    marginTop: "4px",
    fontWeight: "600",
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <span className="info-label">E-mail</span>
                  <a href="mailto:contato@acbrasil.org" className="info-value">
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
                  <a href="tel:+5521987654321" className="info-value">
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
                  <span className="info-value">Rio de Janeiro — RJ</span>
                </div>
              </li>

              <li className="info-item">
                <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <span className="info-social-label">Nossas redes</span>
              <div className="social-icons">
                <a href="https://www.linkedin.com/company/associacao-de-conselheiros-do-brasil/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="https://www.youtube.com/@acbrasil" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a href="https://www.instagram.com/acbrasil.oficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </div>
            </div>
          </aside>

          {/* FORM CONTATO */}
          <div className="form-card">
            <span className="card-cat">Mensagem</span>
            <h3>Envie sua mensagem</h3>
            <p className="form-card-sub">Conte-nos como podemos ajudar.</p>

            <form className="contato-form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-nome">
                    Nome <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-nome"
                    name="nome"
                    placeholder="Seu nome completo"
                    value={contactForm.nome}
                    onChange={handleContactChange}
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
                    name="email"
                    placeholder="seu@email.com"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-assunto">
                  Assunto <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    id="contact-assunto"
                    name="assunto"
                    value={contactForm.assunto}
                    onChange={handleContactChange}
                    required
                  >
                    <option value="" disabled>Selecione um assunto</option>
                    <option value="Associação">Associação</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Parcerias">Parcerias</option>
                    <option value="Imprensa">Imprensa</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-mensagem">
                  Mensagem <span className="required">*</span>
                </label>
                <textarea
                  id="contact-mensagem"
                  name="mensagem"
                  rows="5"
                  placeholder="Escreva sua mensagem aqui..."
                  value={contactForm.mensagem}
                  onChange={handleContactChange}
                  required
                />
              </div>

              <button type="submit" className="form-submit">
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
            <span className="hero-eyebrow associe-eyebrow">Associe-se</span>
            <h2>Faça parte da ACBrasil</h2>
            <p>Junte-se à maior rede de conselheiros do Brasil e tenha acesso a benefícios exclusivos.</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3>Capacitação</h3>
              <p>Acesso a cursos, workshops e eventos exclusivos para membros.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3>Conteúdo exclusivo</h3>
              <p>Pesquisas, guias e publicações disponíveis apenas para associados.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <h3>Networking</h3>
              <p>Acesso à comunidade de conselheiros e eventos de networking.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="22" x2="21" y2="22" />
                  <line x1="6" y1="18" x2="6" y2="11" />
                  <line x1="10" y1="18" x2="10" y2="11" />
                  <line x1="14" y1="18" x2="14" y2="11" />
                  <line x1="18" y1="18" x2="18" y2="11" />
                  <polygon points="12 2 20 7 4 7" />
                </svg>
              </div>
              <h3>Representação</h3>
              <p>Voz nos fóruns e entidades que discutem governança no Brasil.</p>
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
            <p className="form-card-sub">Preencha seus dados — entraremos em contato em até 2 dias úteis.</p>

            <form className="contato-form" onSubmit={handleAssocSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assoc-nome">
                    Nome completo <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="assoc-nome"
                    name="nome"
                    placeholder="Seu nome completo"
                    value={assocForm.nome}
                    onChange={handleAssocChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assoc-email">
                    E-mail <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="assoc-email"
                    name="email"
                    placeholder="seu@email.com"
                    value={assocForm.email}
                    onChange={handleAssocChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assoc-tel">Telefone</label>
                  <input
                    type="tel"
                    id="assoc-tel"
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    value={assocForm.telefone}
                    onChange={handleAssocChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assoc-empresa">Empresa</label>
                  <input
                    type="text"
                    id="assoc-empresa"
                    name="empresa"
                    placeholder="Nome da empresa"
                    value={assocForm.empresa}
                    onChange={handleAssocChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assoc-cpf">
                    CPF <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="assoc-cpf"
                    name="cpf"
                    placeholder="000.000.000-00"
                    value={assocForm.cpf}
                    onChange={handleAssocChange}
                    required
                  />
                  {formErrors.cpf && <span style={errorStyle}>{formErrors.cpf}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="assoc-cep">
                    CEP <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="assoc-cep"
                    name="cep"
                    placeholder="00000-000"
                    value={assocForm.cep}
                    onChange={handleAssocChange}
                    required
                  />
                  {formErrors.cep && <span style={errorStyle}>{formErrors.cep}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="assoc-cargo">
                  Cargo atual <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    id="assoc-cargo"
                    name="cargo"
                    value={assocForm.cargo}
                    onChange={handleAssocChange}
                    required
                  >
                    <option value="" disabled>Selecione seu perfil</option>
                    <option value="Conselheiro Independente">Conselheiro Independente</option>
                    <option value="CEO / Presidente">CEO / Presidente</option>
                    <option value="Diretor">Diretor</option>
                    <option value="Executivo">Executivo</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="assoc-linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="assoc-linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/seu-perfil"
                  value={assocForm.linkedin}
                  onChange={handleAssocChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="assoc-motivo">
                  Por que deseja se associar? <span className="required">*</span>
                </label>
                <textarea
                  id="assoc-motivo"
                  name="motivo"
                  rows="5"
                  placeholder="Conte-nos um pouco sobre sua trajetória e motivação..."
                  value={assocForm.motivo}
                  onChange={handleAssocChange}
                  required
                />
              </div>

              <button type="submit" className="form-submit form-submit--gold">
                Enviar solicitação
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}