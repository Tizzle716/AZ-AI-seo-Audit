import React, { useState, useContext } from 'react'
import { SubscriptionContext } from '../contexts/SubscriptionContext'
import { amazonScraperAPI } from '../utils/api'
import { FaAmazon, FaSearch, FaDownload, FaSpinner, FaExternalLinkAlt, FaStar, FaDollarSign } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

const AmazonScraperPage = () => {
  const { subscription } = useContext(SubscriptionContext)
  const [activeTab, setActiveTab] = useState('scrape')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  
  // Scraping form state
  const [productUrl, setProductUrl] = useState('')
  
  // Search form state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLimit, setSearchLimit] = useState(10)
  
  const getTierFromSubscription = () => {
    if (!subscription?.isActive) return 'free'
    return subscription.tier || 'free'
  }

  const handleScrapeProduct = async (e) => {
    e.preventDefault()
    if (!productUrl.trim()) {
      setError('Please enter a valid Amazon product URL')
      return
    }

    if (!productUrl.includes('amazon.')) {
      setError('Please enter a valid Amazon product URL')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const tier = getTierFromSubscription()
      const data = await amazonScraperAPI.scrapeProduct(productUrl, tier)
      setResults(data)
      toast.success('Product scraped successfully!')
    } catch (err) {
      setError(err.message)
      toast.error('Failed to scrape product')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchProducts = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const tier = getTierFromSubscription()
      const data = await amazonScraperAPI.searchProducts(searchQuery, tier, searchLimit)
      setResults(data)
      toast.success('Search completed successfully!')
    } catch (err) {
      setError(err.message)
      toast.error('Failed to search products')
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = () => {
    if (!results) return
    
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `amazon-${activeTab}-${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const renderProductCard = (product, index) => (
    <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {product.image && (
          <div className="flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-32 h-32 object-contain rounded-lg border"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-4 mb-3">
            {product.price && (
              <div className="flex items-center text-green-600 font-bold">
                <FaDollarSign className="mr-1" />
                {product.price}
              </div>
            )}
            
            {product.rating && (
              <div className="flex items-center text-yellow-500">
                <FaStar className="mr-1" />
                <span className="text-gray-700">{product.rating}</span>
                {product.review_count && (
                  <span className="text-gray-500 ml-1">({product.review_count})</span>
                )}
              </div>
            )}
          </div>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {product.description}
            </p>
          )}
          
          {product.url && (
            <a 
              href={product.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View on Amazon <FaExternalLinkAlt className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaAmazon className="text-4xl text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Amazon Scraper</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract product data and search Amazon with our powerful scraping tool
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('scrape')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'scrape'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Product Scraper
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Product Search
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {activeTab === 'scrape' ? (
            <form onSubmit={handleScrapeProduct} className="space-y-6">
              <div>
                <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Amazon Product URL
                </label>
                <input
                  type="url"
                  id="productUrl"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://www.amazon.com/product-name/dp/XXXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the full Amazon product URL to extract detailed product information
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Scraping Product...
                  </>
                ) : (
                  'Scrape Product'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSearchProducts} className="space-y-6">
              <div>
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Query
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter product keywords to search"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="searchLimit" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Results
                </label>
                <select
                  id="searchLimit"
                  value={searchLimit}
                  onChange={(e) => setSearchLimit(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 products</option>
                  <option value={10}>10 products</option>
                  <option value={20}>20 products</option>
                  <option value={50}>50 products</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Searching Products...
                  </>
                ) : (
                  'Search Products'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'scrape' ? 'Product Details' : 'Search Results'}
              </h2>
              <button
                onClick={downloadResults}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                Download JSON
              </button>
            </div>
            
            {activeTab === 'scrape' ? (
              <div className="space-y-6">
                {results.product && renderProductCard(results.product, 0)}
              </div>
            ) : (
              <div className="space-y-6">
                {results.products && results.products.length > 0 ? (
                  results.products.map((product, index) => renderProductCard(product, index))
                ) : (
                  <p className="text-gray-500 text-center py-8">No products found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AmazonScraperPage