import React from 'react'
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function NotFoundPage({ onNavigate }) {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">

      <div className="text-center px-4">
        <div className="mb-8">
          <div className="mx-auto h-32 w-32 text-gray-300">
            <svg
              className="h-full w-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </button>
          
          <button
            onClick={() => onNavigate('audit')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Start SEO Audit
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-primary-600 hover:text-primary-800 underline"
            >
              Homepage
            </button>
            <button
              onClick={() => onNavigate('audit')}
              className="text-primary-600 hover:text-primary-800 underline"
            >
              SEO Audit
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-primary-600 hover:text-primary-800 underline"
            >
              Pricing
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-primary-600 hover:text-primary-800 underline"
            >
              Dashboard
            </button>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please{' '}
            <a
              href="mailto:support@seoaudit.com"
              className="text-primary-600 hover:text-primary-800 underline"
            >
              contact our support team
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage