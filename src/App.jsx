import React, { useState, useEffect, Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MonitoringTest from './components/MonitoringTest'
import TestEnvironmentVariables from './test-env'

// Use React.lazy for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const SEOAuditPage = lazy(() => import('./pages/SEOAuditPage'))
const AmazonScraperPage = lazy(() => import('./pages/AmazonScraperPage'))
const SheetsCleanerPage = lazy(() => import('./pages/SheetsCleanerPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// Test component for monitoring integration
const TestPage = () => (
  <div className="container mx-auto py-8 px-4">
    <h1 className="text-2xl font-bold mb-6">Monitoring Integration Test</h1>
    <MonitoringTest />
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Environment Variables Test</h2>
      <TestEnvironmentVariables />
    </div>
  </div>
)

function App() {
  const [currentPage, setCurrentPage] = useState('test-monitoring')
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
        'test-monitoring',
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
      case 'test-monitoring':
        return <TestPage />
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
            <Suspense fallback={<LoadingFallback />}>
              {renderPage()}
            </Suspense>
          </main>
          
          <Footer onNavigate={navigate} />
        </div>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App