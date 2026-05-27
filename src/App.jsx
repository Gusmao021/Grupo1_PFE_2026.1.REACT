import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/Home/HomePage'
import AboutPage from './pages/About/AboutPage'
import ArticlesPage from './pages/Articles/ArticlesPage'
import ContactPage from './pages/Contact/ContactPage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quem-somos" element={<AboutPage />} />
        <Route path="/artigos" element={<ArticlesPage />} />
        <Route path="/contato" element={<ContactPage />} />
      </Routes>
      <Footer />
    </>
  )
}