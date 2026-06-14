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
          <Route path="/artigos/:slug" element={<ArticlePage />} />
          <Route path="/contato" element={<ContactPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}