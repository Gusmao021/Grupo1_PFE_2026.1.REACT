import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/Home/HomePage'
import AboutPage from './pages/About/AboutPage'
import ArticlesPage from './pages/Articles/ArticlesPage'
import ArticlePage from './pages/Article/ArticlePage'
import ContactPage from './pages/Contact/ContactPage'
import ConselheiroPerfil from './pages/About/ConselheiroPerfil'

export default function App() {
  const location = useLocation()

  return (
    <>
      <Header />
      {/* key={pathname} remonta o wrapper a cada rota, reiniciando o fade */}
      <div key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quem-somos" element={<AboutPage />} />
          <Route path="/artigos" element={<ArticlesPage />} />
          
          {/* A key garante que o componente resete seus estados totalmente ao trocar de artigo */}
          <Route path="/artigos/:slug" element={<ArticlePage key={location.pathname} />} />
          
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/quem-somos/conselheiro/:id" element={<ConselheiroPerfil />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}