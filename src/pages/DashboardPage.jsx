import React, { useState, useEffect } from 'react'
import { useSubscription } from '../contexts/SubscriptionContext'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  GlobeAltIcon,
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

function DashboardPage({ onNavigate }) {
  const {
    currentTier,
    isSubscribed,
    isLoading: subscriptionLoading,
    refreshSubscriptionStatus,
    getSubscriptionLimits,
    hasFeature,
    canPerformAction,
  } = useSubscription()

  const [audits, setAudits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, recent, critical
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total_audits: 0,
    this_month: 0,
    avg_score: 0,
    critical_issues: 0,
  })

  const limits = getSubscriptionLimits()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call - replace with actual endpoint
      const response = await fetch('https://seoaudit-functions.azurewebsites.net/api/user-audits', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setAudits(data.audits || [])
        setStats(data.stats || stats)
      } else {
        // Fallback with mock data for demo
        setAudits(mockAudits)
        setStats(mockStats)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      // Use mock data as fallback
      setAudits(mockAudits)
      setStats(mockStats)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-danger-600'
  }

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'badge-success'
    if (score >= 60) return 'badge-warning'
    return 'badge-danger'
  }

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.url.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (filter) {
      case 'recent':
        const isRecent = new Date(audit.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return matchesSearch && isRecent
      case 'critical':
        return matchesSearch && audit.critical_issues > 0
      default:
        return matchesSearch
    }
  })

  const downloadAudit = (auditId, url) => {
    // Simulate download - replace with actual implementation
    console.log(`Downloading audit ${auditId} for ${url}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your SEO audit history and performance</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => onNavigate('audit')}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Audit
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Audits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_audits}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.this_month}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`text-2xl font-bold ${getScoreColor(stats.avg_score)}`}>
                  {stats.avg_score}
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-xs text-gray-500">Across all audits</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold text-danger-600">
                  {stats.critical_issues}
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-xs text-gray-500">Need attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Subscription Status</h3>
                <div className="flex items-center mt-1">
                  {isSubscribed && currentTier !== 'free' ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-success-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan
                      </span>
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleIcon className="h-4 w-4 text-warning-500 mr-1" />
                      <span className="text-sm text-gray-600">Free Plan</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">
                Pages Used: {stats.this_month} / {limits.maxPages === Infinity ? '∞' : limits.maxPages}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all" 
                  style={{ 
                    width: limits.maxPages === Infinity 
                      ? '100%' 
                      : `${Math.min((stats.this_month / limits.maxPages) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              {currentTier === 'free' && (
                <button
                  onClick={() => onNavigate('pricing')}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input py-2 pr-8"
                >
                  <option value="all">All Audits</option>
                  <option value="recent">Recent (7 days)</option>
                  <option value="critical">Critical Issues</option>
                </select>
              </div>
              <button
                onClick={fetchDashboardData}
                className="btn btn-outline flex items-center"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search by URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full sm:w-64"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Audits Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Audit History ({filteredAudits.length})
            </h2>
          </div>
          
          {filteredAudits.length === 0 ? (
            <div className="text-center py-12">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audits found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start your first SEO audit to see results here.'}
              </p>
              <button
                onClick={() => onNavigate('audit')}
                className="btn btn-primary"
              >
                Start First Audit
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issues
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAudits.map((audit) => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {audit.url}
                            </div>
                            <div className="text-sm text-gray-500">
                              {audit.tier} tier
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getScoreBadgeColor(audit.score)}`}>
                          {audit.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          {audit.critical_issues > 0 && (
                            <span className="badge badge-danger">
                              {audit.critical_issues} critical
                            </span>
                          )}
                          {audit.warnings > 0 && (
                            <span className="badge badge-warning">
                              {audit.warnings} warnings
                            </span>
                          )}
                          {audit.critical_issues === 0 && audit.warnings === 0 && (
                            <span className="badge badge-success">No issues</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(audit.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onNavigate('results')}
                            className="text-primary-600 hover:text-primary-900 flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => downloadAudit(audit.id, audit.url)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mock data for demo purposes
const mockStats = {
  total_audits: 12,
  this_month: 5,
  avg_score: 78,
  critical_issues: 3,
}

const mockAudits = [
  {
    id: '1',
    url: 'https://example.com',
    score: 85,
    tier: 'premium',
    critical_issues: 0,
    warnings: 2,
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    url: 'https://mystore.com',
    score: 72,
    tier: 'basic',
    critical_issues: 1,
    warnings: 5,
    created_at: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    url: 'https://blog.example.org',
    score: 91,
    tier: 'free',
    critical_issues: 0,
    warnings: 1,
    created_at: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    url: 'https://portfolio.dev',
    score: 68,
    tier: 'basic',
    critical_issues: 2,
    warnings: 3,
    created_at: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    url: 'https://company.co',
    score: 79,
    tier: 'premium',
    critical_issues: 0,
    warnings: 4,
    created_at: '2024-01-11T11:30:00Z',
  },
]

export default DashboardPage