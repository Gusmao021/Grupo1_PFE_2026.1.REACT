import { Link } from "react-router-dom"
import "./Header.css"

export default function Header() {
    return (
        <header class="header">
            <div class="header-content">

                <a class="header-logo" >
                    <Link to="/"><img src="/images/logo.png" alt="ACB logo" className="logo-icon"></img></Link>
                </a> 

                <ul class="header-nav" id="headerNav" aria-label="Navegação principal">
                    <li><Link to="/" class="nav-link">Home</Link></li>
                    <li><Link to="/artigos" class="nav-link">Artigos</Link></li>
                    <li><Link to="/quem-somos" class="nav-link">Quem somos</Link></li>
                    <li><Link to="/contato" class="nav-link">Contato</Link></li>
                </ul>

                <Link to="/contato" class="header-cta">Associe-se</Link>

                <button class="hamburger" aria-label="Abrir menu" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>

            </div>

            <div class="mobile-drawer">
                <nav class="mobile-drawer-nav">
                    <a href="index.html" class="active">Home</a>
                    <a href="pages/artigos/artigos.html">Artigos</a>
                    <a href="pages/quem_somos/quem_somos.html">Quem somos</a>
                    <a href="pages/contato/contato.html">Contato</a>
                    <a href="pages/contato/contato.html#associe-form" class="mobile-drawer-cta">Associe-se</a>
                </nav>
            </div>

        </header>
    )
}