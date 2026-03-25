import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import About from '../components/landing/About'
import WaitlistForm from '../components/landing/WaitlistForm'
import Pricing from '../components/landing/Pricing'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="bg-[#161616] min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <WaitlistForm />
      <Pricing />
      <Footer />
    </div>
  )
}
