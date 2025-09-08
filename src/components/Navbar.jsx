import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Navbar({ currentPage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()

  const isActive = (page) => {
    return currentPage === page
  }

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'SEO Audit', page: 'audit' },
    { name: 'Amazon Scraper', page: 'amazon-scraper' },
    { name: 'Sheets Cleaner', page: 'sheets-cleaner' },
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Pricing', page: 'pricing' },
  ]

  const handleNavigation = (page) => {
    onNavigate(page)
    setIsOpen(false)
  }

  const handleAuthClick = async () => {
    if (user) {
      await logout()
      onNavigate('home')
    } else {
      onNavigate('login')
    }
  }

  return (
    <>
      {/* Gradient top banner */}
      <div className="h-1 bg-gradient-primary"></div>
      <nav className="bg-white shadow-lg sticky top-0 z-50 animate-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('home')} 
              className="flex-shrink-0 flex items-center"
            >
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Lockin-Labs/TaskFlow SEO</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.page)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => handleNavigation('audit')}
              className="btn-hero px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </button>
            <button 
              onClick={handleAuthClick}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50"
              disabled={isLoading}
            >
              {user ? 'Logout' : 'Sign in'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.page)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(link.page)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => handleNavigation('audit')}
              className="w-full text-left btn-hero px-3 py-2 rounded-md text-base font-medium"
            >
              Get Started
            </button>
            <button 
              onClick={handleAuthClick}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </>
    </nav>
  )
}

export default Navbar