import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import "./Header.css"

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link"

    return (
        <header className={`header ${menuOpen ? "menu-open" : ""}`}>
            <div className="header-content">
                <Link to="/" className="header-logo">
                    <img src="/images/logo.png" alt="ACB logo" />
                </Link>

                <ul className="header-nav" aria-label="Navegação principal">
                    <li><Link to="/" className={isActive("/")}>Home</Link></li>
                    <li><Link to="/artigos" className={isActive("/artigos")}>Artigos</Link></li>
                    <li><Link to="/quem-somos" className={isActive("/quem-somos")}>Quem somos</Link></li>
                    <li><Link to="/contato" className={isActive("/contato")}>Contato</Link></li>
                </ul>

                <Link to="/contato" className="header-cta">Associe-se</Link>

                <button
                    className="hamburger"
                    aria-label="Abrir menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span><span></span><span></span>
                </button>
            </div>

            <div className="mobile-drawer">
                <nav className="mobile-drawer-nav">
                    <Link to="/" className={isActive("/")} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/artigos" className={isActive("/artigos")} onClick={() => setMenuOpen(false)}>Artigos</Link>
                    <Link to="/quem-somos" className={isActive("/quem-somos")} onClick={() => setMenuOpen(false)}>Quem somos</Link>
                    <Link to="/contato" className={isActive("/contato")} onClick={() => setMenuOpen(false)}>Contato</Link>
                    <Link to="/contato#associe-form" className="mobile-drawer-cta" onClick={() => setMenuOpen(false)}>Associe-se</Link>
                </nav>
            </div>
        </header>
    )
}