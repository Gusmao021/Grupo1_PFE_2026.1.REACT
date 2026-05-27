import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Logo e Redes Sociais */}
        <div className="footer-brand">
          <div className="logo">
            <img src="/images/logo.png" alt="ACB logo" className="logo-icon" />
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
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Navegação */}
        <div className="footer-column">
          <h3>Navegação</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/artigos">Artigos</Link></li>
            <li><Link to="/quem-somos">Quem somos</Link></li>
          </ul>
        </div>

        {/* Contato */}
        <div className="footer-column">
          <h3>Contato</h3>
          <ul>
            <li><a href="mailto:contato@acbrasil.org">contato@acbrasil.org</a></li>
            <li><a className="contact-link" href="tel:+5521987654321">(21) 98765-4321</a></li>
            <li className="location">Rio de Janeiro - RJ</li>
          </ul>
        </div>

      </div>

      {/* Direitos Autorais */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Associação de Conselheiros do Brasil. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}