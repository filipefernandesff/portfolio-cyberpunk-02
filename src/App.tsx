import Contato from './components/Contato'
import Depoimentos from './components/Depoimentos'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Processo from './components/Processo'
import Projetos from './components/Projetos'
import Servicos from './components/Servicos'
import Sobre from './components/Sobre'
import Tecnologias from './components/Tecnologias'

export default function App() {
  return (
    <div className="min-h-screen bg-[#07040f] text-[#e8e2f5]" style={{ fontFamily: 'var(--font-body)' }}>
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Servicos />
        <Projetos />
        <Tecnologias />
        <Processo />
        <Depoimentos />
        <Contato />
      </main>
      <Footer />
    </div>
  )
}
