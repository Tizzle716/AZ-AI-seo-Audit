import React, { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SEOAuditPage from './pages/SEOAuditPage'
import AmazonScraperPage from './pages/AmazonScraperPage'
import SheetsCleanerPage from './pages/SheetsCleanerPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'
import PricingPage from './pages/PricingPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [auditResults, setAuditResults] = useState(null)

  // Sync currentPage with URL path and back/forward navigation
  useEffect(() => {
    const mapPathToPage = (path) => {
      const clean = path.replace(/^\/+/, '')
      if (clean === '' || clean === 'home') return 'home'
      const allowed = new Set([
        'audit',
        'amazon-scraper',
        'sheets-cleaner',
        'results',
        'dashboard',
        'pricing',
        'admin',
        'login',
      ])
      return allowed.has(clean) ? clean : 'home'
    }

    const applyPath = () => {
      const page = mapPathToPage(window.location.pathname)
      setCurrentPage(page)
    }

    applyPath()
    const onPopState = () => applyPath()
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (page) => {
    setCurrentPage(page)
    const path = page === 'home' ? '/' : `/${page}`
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />
      case 'audit':
        return <SEOAuditPage onNavigate={navigate} onResults={setAuditResults} />
      case 'amazon-scraper':
        return <AmazonScraperPage onNavigate={navigate} />
      case 'sheets-cleaner':
        return <SheetsCleanerPage onNavigate={navigate} />
      case 'results':
        return <ResultsPage onNavigate={navigate} results={auditResults} />
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />
      case 'pricing':
        return <PricingPage onNavigate={navigate} />
      case 'admin':
        return <AdminPage onNavigate={navigate} />
      case 'login':
        return <LoginPage onNavigate={navigate} />
      default:
        return <HomePage onNavigate={navigate} />
    }
  }

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar currentPage={currentPage} onNavigate={navigate} />
          
          <main>
            {renderPage()}
          </main>
          
          <Footer onNavigate={navigate} />
        </div>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App