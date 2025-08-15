import React, { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'

function AdminPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalAudits: 0,
    activeUsers: 0,
    systemHealth: 'healthy',
    apiCalls: 0,
    revenue: 0,
  })
  const [recentAudits, setRecentAudits] = useState([])
  const [systemLogs, setSystemLogs] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Simulate loading admin data
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalAudits: 1247,
      activeUsers: 89,
      systemHealth: 'healthy',
      apiCalls: 15420,
      revenue: 12450,
    })

    setRecentAudits([
      {
        id: '1',
        url: 'https://example.com',
        user: 'john@example.com',
        tier: 'premium',
        status: 'completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        score: 85,
      },
      {
        id: '2',
        url: 'https://test-site.com',
        user: 'jane@example.com',
        tier: 'basic',
        status: 'processing',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        score: null,
      },
      {
        id: '3',
        url: 'https://mywebsite.org',
        user: 'bob@example.com',
        tier: 'free',
        status: 'failed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        score: null,
      },
    ])

    setSystemLogs([
      {
        id: '1',
        level: 'info',
        message: 'SEO audit completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        details: 'Audit ID: 12345, User: john@example.com',
      },
      {
        id: '2',
        level: 'warning',
        message: 'High API usage detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        details: 'Current usage: 95% of daily limit',
      },
      {
        id: '3',
        level: 'error',
        message: 'Failed to process audit request',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        details: 'Error: Timeout connecting to target website',
      },
    ])

    setUsers([
      {
        id: '1',
        email: 'john@example.com',
        plan: 'premium',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        lastActive: new Date(Date.now() - 1000 * 60 * 30),
        auditsCount: 45,
      },
      {
        id: '2',
        email: 'jane@example.com',
        plan: 'basic',
        status: 'active',
        joinDate: new Date('2024-02-01'),
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
        auditsCount: 12,
      },
      {
        id: '3',
        email: 'bob@example.com',
        plan: 'free',
        status: 'inactive',
        joinDate: new Date('2024-01-20'),
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        auditsCount: 3,
      },
    ])
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-warning-500" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-danger-500" />
      default:
        return null
    }
  }

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-danger-600 bg-danger-50'
      case 'warning':
        return 'text-warning-600 bg-warning-50'
      case 'info':
        return 'text-primary-600 bg-primary-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'audits', name: 'Audits', icon: EyeIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'logs', name: 'System Logs', icon: CogIcon },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor and manage your SEO audit system</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Audits</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalAudits.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUpIcon className="h-4 w-4 text-success-500 mr-1" />
                  <span className="text-success-600">12% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUpIcon className="h-4 w-4 text-success-500 mr-1" />
                  <span className="text-success-600">8% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CogIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">API Calls</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.apiCalls.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowDownIcon className="h-4 w-4 text-danger-500 mr-1" />
                  <span className="text-danger-600">3% from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-success-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">System Health</p>
                    <p className="text-2xl font-semibold text-success-600 capitalize">{stats.systemHealth}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">All systems operational</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Audits</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentAudits.map((audit) => (
                      <div key={audit.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(audit.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{audit.url}</p>
                            <p className="text-xs text-gray-500">{audit.user} • {formatDate(audit.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            audit.tier === 'premium' ? 'bg-primary-100 text-primary-800' :
                            audit.tier === 'basic' ? 'bg-warning-100 text-warning-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {audit.tier}
                          </span>
                          {audit.score && (
                            <p className="text-sm text-gray-600 mt-1">Score: {audit.score}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{log.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(log.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audits Tab */}
        {activeTab === 'audits' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Audits</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
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
                  {recentAudits.map((audit) => (
                    <tr key={audit.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audit.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {audit.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          audit.tier === 'premium' ? 'bg-primary-100 text-primary-800' :
                          audit.tier === 'basic' ? 'bg-warning-100 text-warning-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {audit.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(audit.status)}
                          <span className="ml-2 text-sm text-gray-600 capitalize">{audit.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {audit.score || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(audit.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-danger-600 hover:text-danger-900">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.plan === 'premium' ? 'bg-primary-100 text-primary-800' :
                          user.plan === 'basic' ? 'bg-warning-100 text-warning-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.auditsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(user.joinDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(user.lastActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-danger-600 hover:text-danger-900">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage