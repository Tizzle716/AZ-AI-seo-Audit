import React, { useState } from 'react'
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const tiers = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic SEO analysis',
    features: ['Basic technical checks', 'Page speed analysis', 'Meta tags review', 'Up to 5 pages'],
    popular: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Enhanced analysis with more features',
    features: ['Everything in Free', 'Content analysis', 'Image optimization', 'Up to 25 pages', 'PDF report'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Comprehensive SEO audit',
    features: ['Everything in Basic', 'Competitor analysis', 'Keyword research', 'Up to 100 pages', 'Priority support'],
    popular: false,
  },
]

function SEOAuditPage({ onNavigate, onAuditComplete }) {
  const [url, setUrl] = useState('')
  const [selectedTier, setSelectedTier] = useState('free')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (including http:// or https://)')
      return
    }

    setIsLoading(true)

    try {
      // Call Azure Function API
      const response = await fetch('https://seoaudit-functions.azurewebsites.net/api/seo_audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          tier: selectedTier,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Pass audit data to parent component
      onAuditComplete(result)
      onNavigate('results')
    } catch (err) {
      console.error('Audit failed:', err)
      setError('Failed to start audit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            SEO Audit Tool
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your website URL below to start a comprehensive SEO analysis. 
            Our AI-powered system will examine your site and provide actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Audit Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Start Your Audit
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="url" className="label text-gray-900 mb-2 block">
                    Website URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="input pr-10"
                      disabled={isLoading}
                    />
                    <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {error && (
                    <div className="mt-2 flex items-center text-sm text-danger-600">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {error}
                    </div>
                  )}
                </div>

                {/* Tier Selection */}
                <div>
                  <label className="label text-gray-900 mb-4 block">
                    Select Audit Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                          selectedTier === tier.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedTier(tier.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="tier"
                              value={tier.id}
                              checked={selectedTier === tier.id}
                              onChange={() => setSelectedTier(tier.id)}
                              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <div className="ml-3">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  {tier.name}
                                </span>
                                {tier.popular && (
                                  <span className="ml-2 badge badge-info text-xs">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{tier.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                      Start SEO Audit
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* What we analyze */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What We Analyze
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Technical SEO issues</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Page speed and performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Meta tags and content</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Mobile responsiveness</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Security and accessibility</span>
                </li>
              </ul>
            </div>

            {/* Processing time */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Processing Time
              </h3>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">2-5 minutes</p>
                  <p className="text-xs text-gray-500">Depending on website size</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-primary-700 mb-4">
                Our support team is here to help you get the most out of your SEO audit.
              </p>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SEOAuditPage