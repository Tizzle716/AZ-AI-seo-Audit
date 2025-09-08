import React, { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ChartBarIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { measureUIInteraction, captureException, log } from '../utils/monitoring'

function ResultsPage({ auditData: initialAuditData, onNavigate }) {
  const [auditData, setAuditData] = useState(initialAuditData || null)
  const [isLoading, setIsLoading] = useState(!auditData)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!auditData) {
      setError('No audit data available. Please run a new audit.')
      setIsLoading(false)
    }
  }, [auditData])



  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600'
    if (score >= 60) return 'text-warning-600'
    return 'text-danger-600'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success-100'
    if (score >= 60) return 'bg-warning-100'
    return 'bg-danger-100'
  }

  const getIssueIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-danger-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />
      case 'info':
        return <CheckCircleIcon className="h-5 w-5 text-primary-500" />
      default:
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />
    }
  }

  const downloadReport = () => {
    measureUIInteraction('ResultsPage', 'downloadReport', () => {
      try {
        log('info', 'Downloading SEO audit report', { url: auditData.url })
        
        // Create and download PDF report
        const reportData = {
          url: auditData.url,
          timestamp: auditData.timestamp,
          scores: auditData.scores,
          issues: auditData.issues,
        }
        
        const dataStr = JSON.stringify(reportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `seo-audit-${auditData.url.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.json`
        link.click()
        URL.revokeObjectURL(url)
        
        log('info', 'SEO audit report downloaded successfully', { url: auditData.url })
      } catch (err) {
        captureException(err, { action: 'downloadReport', url: auditData?.url })
        log('error', 'Failed to download SEO audit report', { error: err.message })
      }
    })
  }

  const shareResults = async () => {
    measureUIInteraction('ResultsPage', 'shareResults', async () => {
      try {
        log('info', 'Sharing SEO audit results', { url: auditData.url })
        
        if (navigator.share) {
          await navigator.share({
            title: `SEO Audit Results for ${auditData.url}`,
            text: `Check out the SEO audit results for ${auditData.url}`,
            url: window.location.href,
          })
          log('info', 'SEO audit results shared successfully', { url: auditData.url, method: 'webshare' })
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
          log('info', 'SEO audit results link copied to clipboard', { url: auditData.url, method: 'clipboard' })
        }
      } catch (err) {
        captureException(err, { action: 'shareResults', url: auditData?.url })
        log('error', 'Failed to share SEO audit results', { error: err.message })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audit results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-danger-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => onNavigate('audit')} className="btn btn-primary">
            Start New Audit
          </button>
        </div>
      </div>
    )
  }

  if (!auditData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Audit Data Found</h2>
          <p className="text-gray-600 mb-4">The audit results could not be found.</p>
          <button onClick={() => onNavigate('audit')} className="btn btn-primary">
            Start New Audit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                SEO Audit Results
              </h1>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <div className="flex items-center">
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  <span className="font-medium">{auditData.url}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{new Date(auditData.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button
                onClick={shareResults}
                className="btn btn-outline flex items-center"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={downloadReport}
                className="btn btn-primary flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Overall Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(auditData.scores?.overall || 0)} mb-4`}>
              <span className={`text-2xl font-bold ${getScoreColor(auditData.scores?.overall || 0)}`}>
                {auditData.scores?.overall || 0}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Score</h3>
            <p className="text-sm text-gray-600">Combined SEO health</p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {auditData.scores?.performance || 0}
            </h3>
            <p className="text-sm text-gray-600">Performance</p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 mb-4">
              <DevicePhoneMobileIcon className="h-8 w-8 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {auditData.scores?.mobile || 0}
            </h3>
            <p className="text-sm text-gray-600">Mobile Friendly</p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning-100 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {auditData.scores?.security || 0}
            </h3>
            <p className="text-sm text-gray-600">Security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issues and Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Issues */}
            {auditData.issues?.critical?.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <XCircleIcon className="h-6 w-6 text-danger-500 mr-2" />
                  Critical Issues ({auditData.issues.critical.length})
                </h2>
                <div className="space-y-4">
                  {auditData.issues.critical.map((issue, index) => (
                    <div key={index} className="border border-danger-200 rounded-lg p-4 bg-danger-50">
                      <div className="flex items-start">
                        {getIssueIcon('error')}
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-danger-800">
                            {issue.title}
                          </h3>
                          <p className="text-sm text-danger-700 mt-1">
                            {issue.description}
                          </p>
                          {issue.recommendation && (
                            <div className="mt-2 p-3 bg-white rounded border border-danger-200">
                              <p className="text-sm text-gray-700">
                                <strong>Recommendation:</strong> {issue.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {auditData.issues?.warnings?.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-warning-500 mr-2" />
                  Warnings ({auditData.issues.warnings.length})
                </h2>
                <div className="space-y-4">
                  {auditData.issues.warnings.map((issue, index) => (
                    <div key={index} className="border border-warning-200 rounded-lg p-4 bg-warning-50">
                      <div className="flex items-start">
                        {getIssueIcon('warning')}
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-warning-800">
                            {issue.title}
                          </h3>
                          <p className="text-sm text-warning-700 mt-1">
                            {issue.description}
                          </p>
                          {issue.recommendation && (
                            <div className="mt-2 p-3 bg-white rounded border border-warning-200">
                              <p className="text-sm text-gray-700">
                                <strong>Recommendation:</strong> {issue.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passed Checks */}
            {auditData.issues?.passed?.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-success-500 mr-2" />
                  Passed Checks ({auditData.issues.passed.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {auditData.issues.passed.map((check, index) => (
                    <div key={index} className="flex items-center p-3 bg-success-50 rounded-lg border border-success-200">
                      <CheckCircleIcon className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-success-800">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pages Analyzed</span>
                  <span className="text-sm font-medium text-gray-900">
                    {auditData.stats?.pages_analyzed || 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Load Time</span>
                  <span className="text-sm font-medium text-gray-900">
                    {auditData.stats?.load_time || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Page Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    {auditData.stats?.page_size || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Images</span>
                  <span className="text-sm font-medium text-gray-900">
                    {auditData.stats?.images || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Next Steps</h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li>• Fix critical issues first</li>
                <li>• Address warnings for better performance</li>
                <li>• Monitor your site regularly</li>
                <li>• Consider upgrading for more features</li>
              </ul>
              <div className="mt-4">
                <button onClick={() => onNavigate('audit')} className="btn btn-primary btn-sm w-full">
                  Run Another Audit
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our team can help you implement these recommendations.
              </p>
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage