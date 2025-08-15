import React, { useState } from 'react'
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

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [auditResults, setAuditResults] = useState(null)

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'audit':
        return <SEOAuditPage onNavigate={setCurrentPage} onResults={setAuditResults} />
      case 'amazon-scraper':
        return <AmazonScraperPage onNavigate={setCurrentPage} />
      case 'sheets-cleaner':
        return <SheetsCleanerPage onNavigate={setCurrentPage} />
      case 'results':
        return <ResultsPage onNavigate={setCurrentPage} results={auditResults} />
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <SubscriptionProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main>
          {renderPage()}
        </main>
        
        <Footer onNavigate={setCurrentPage} />
      </div>
    </SubscriptionProvider>
  )
}

export default App