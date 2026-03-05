import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  )
}
