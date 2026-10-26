import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/home/HeroSection'
import FAQSection from '../components/home/FAQSection'
import AboutSection from '../components/home/AboutSection'
import AuthModal from '../components/auth/AuthModal'

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false)
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLoginClick={() => setAuthOpen(true)} />
      <main className="flex-1">
        <HeroSection onStart={() => setAuthOpen(true)} />
        <FAQSection />
        <AboutSection />
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
