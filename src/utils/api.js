import axios from 'axios'
import { measureApiCall, captureException, log } from './monitoring'

// Azure Function App base URL - resolved from Vite env; empty string means use same-origin (enables Vite dev proxy)
const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL ?? '') || ''

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    } else if (error.response?.status === 429) {
      // Rate limited
      throw new Error('Too many requests. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      throw new Error('Request timeout. Please try again.')
    }
    return Promise.reject(error)
  }
)

// SEO Audit API functions
export const seoAuditAPI = {
  /**
   * Run SEO audit on a URL
   * @param {string} url - The URL to audit
   * @param {string} tier - The audit tier (free, basic, premium, enterprise)
   * @returns {Promise} Audit results
   */
  runAudit: async (url, tier = 'free') => {
    try {
      log('info', 'Starting SEO audit', { url, tier })
      const response = await measureApiCall(
        'POST',
        '/api/seo_audit',
        async () => {
          return await api.post('/api/seo_audit', {
            url,
            tier,
          })
        }
      )
      log('info', 'SEO audit completed', { url, tier })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'runAudit', url, tier })
      log('error', 'SEO Audit API Error', { url, tier, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to run SEO audit'
      )
    }
  },

  /**
   * Get audit results by ID
   * @param {string} auditId - The audit ID
   * @returns {Promise} Audit results
   */
  getAuditResults: async (auditId) => {
    try {
      log('info', 'Getting audit results', { auditId })
      const response = await measureApiCall(
        'GET',
        `/api/seo_audit/${auditId}`,
        async () => {
          return await api.get(`/api/seo_audit/${auditId}`)
        }
      )
      log('info', 'Retrieved audit results', { auditId })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'getAuditResults', auditId })
      log('error', 'Get Audit Results Error', { auditId, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get audit results'
      )
    }
  },

  /**
   * Get user's audit history
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Audit history
   */
  getAuditHistory: async (page = 1, limit = 10) => {
    try {
      log('info', 'Getting audit history', { page, limit })
      const response = await measureApiCall(
        'GET',
        '/api/audits/history',
        async () => {
          return await api.get('/api/audits/history', {
            params: { page, limit }
          })
        }
      )
      log('info', 'Retrieved audit history', { page, limit })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'getAuditHistory', page, limit })
      log('error', 'Get Audit History Error', { page, limit, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get audit history'
      )
    }
  },

  /**
   * Download audit report as PDF
   * @param {string} auditId - The audit ID
   * @returns {Promise} PDF blob
   */
  downloadReport: async (auditId) => {
    try {
      log('info', 'Downloading audit report', { auditId })
      const response = await measureApiCall(
        'GET',
        `/api/audits/${auditId}/report`,
        async () => {
          return await api.get(`/api/audits/${auditId}/report`, {
            responseType: 'blob'
          })
        }
      )
      log('info', 'Audit report downloaded successfully', { auditId })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'downloadReport', auditId })
      log('error', 'Download Report Error', { auditId, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to download report'
      )
    }
  },
}

// Amazon Scraper API functions
export const amazonScraperAPI = {
  /**
   * Scrape Amazon product data
   * @param {string} productUrl - Amazon product URL
   * @param {string} tier - Service tier
   * @returns {Promise} Scraping results
   */
  scrapeProduct: async (productUrl, tier = 'free') => {
    try {
      log('info', 'Starting Amazon product scrape', { productUrl, tier })
      const response = await measureApiCall(
        'POST',
        '/api/amazon_scraper',
        async () => {
          return await api.post('/api/amazon_scraper', {
            product_url: productUrl,
            tier,
          })
        }
      )
      log('info', 'Amazon product scrape completed', { productUrl, tier })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'scrapeProduct', productUrl, tier })
      log('error', 'Amazon Scraper API Error', { productUrl, tier, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to scrape Amazon product'
      )
    }
  },

  /**
   * Search Amazon products
   * @param {string} query - Search query
   * @param {string} tier - Service tier
   * @param {number} limit - Number of products to return
   * @returns {Promise} Search results
   */
  searchProducts: async (query, tier = 'free', limit = 10) => {
    try {
      log('info', 'Starting Amazon product search', { query, tier, limit })
      const response = await measureApiCall(
        'POST',
        '/api/amazon_scraper',
        async () => {
          return await api.post('/api/amazon_scraper', {
            action: 'search',
            query,
            tier,
            limit,
          })
        }
      )
      log('info', 'Amazon product search completed', { query, tier, limit })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'searchProducts', query, tier, limit })
      log('error', 'Amazon Search API Error', { query, tier, limit, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to search Amazon products'
      )
    }
  },

  /**
   * Get scraping job status
   * @param {string} jobId - Job ID
   * @returns {Promise} Job status
   */
  getJobStatus: async (jobId) => {
    try {
      log('info', 'Getting Amazon scraper job status', { jobId })
      const response = await measureApiCall(
        'GET',
        `/api/amazon_scraper/${jobId}`,
        async () => {
          return await api.get(`/api/amazon_scraper/${jobId}`)
        }
      )
      log('info', 'Retrieved Amazon scraper job status', { jobId })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'getJobStatus', jobId })
      log('error', 'Get Job Status Error', { jobId, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get job status'
      )
    }
  },
}

// Sheets Cleaner API functions
export const sheetsCleanerAPI = {
  /**
   * Clean and process spreadsheet data
   * @param {File} file - Spreadsheet file
   * @param {Object} options - Cleaning options
   * @returns {Promise} Cleaned data
   */
  cleanSpreadsheet: async (file, options = {}) => {
    try {
      log('info', 'Starting spreadsheet cleaning', { fileName: file.name, options })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('options', JSON.stringify(options))
      
      const response = await measureApiCall(
        'POST',
        '/api/sheets_cleaner',
        async () => {
          return await api.post('/api/sheets_cleaner', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }
      )
      log('info', 'Spreadsheet cleaning completed', { fileName: file.name })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'cleanSpreadsheet', fileName: file.name })
      log('error', 'Sheets Cleaner API Error', { fileName: file.name, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to clean spreadsheet'
      )
    }
  },

  /**
   * Process CSV data directly
   * @param {Array} data - CSV data as array of arrays
   * @param {Object} options - Processing options
   * @param {string} tier - Service tier
   * @returns {Promise} Processed data
   */
  processData: async (data, options = {}, tier = 'free') => {
    try {
      log('info', 'Starting data processing', { dataRows: data.length, options, tier })
      const response = await measureApiCall(
        'POST',
        '/api/sheets_cleaner',
        async () => {
          return await api.post('/api/sheets_cleaner', {
            data,
            options,
            tier,
          })
        }
      )
      log('info', 'Data processing completed', { dataRows: data.length, tier })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'processData', dataRows: data.length, tier })
      log('error', 'Sheets Processing API Error', { dataRows: data.length, tier, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to process data'
      )
    }
  },

  /**
   * Get processing job status
   * @param {string} jobId - Job ID
   * @returns {Promise} Job status
   */
  getJobStatus: async (jobId) => {
    try {
      log('info', 'Getting sheets cleaner job status', { jobId })
      const response = await measureApiCall(
        'GET',
        `/api/sheets_cleaner/${jobId}`,
        async () => {
          return await api.get(`/api/sheets_cleaner/${jobId}`)
        }
      )
      log('info', 'Retrieved sheets cleaner job status', { jobId })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'getJobStatus', jobId })
      log('error', 'Get Job Status Error', { jobId, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get job status'
      )
    }
  },

  /**
   * Download processed file
   * @param {string} jobId - Job ID
   * @param {string} format - File format (csv, xlsx, json)
   * @returns {Promise} File blob
   */
  downloadFile: async (jobId, format = 'csv') => {
    try {
      log('info', 'Downloading processed file', { jobId, format })
      const response = await measureApiCall(
        'GET',
        `/api/sheets_cleaner/${jobId}/download`,
        async () => {
          return await api.get(`/api/sheets_cleaner/${jobId}/download`, {
            params: { format },
            responseType: 'blob',
          })
        }
      )
      log('info', 'File download completed', { jobId, format })
      return response.data
    } catch (error) {
      captureException(error, { operation: 'downloadFile', jobId, format })
      log('error', 'Download File Error', { jobId, format, error: error.message })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to download file'
      )
    }
  },
}

// User management API functions
export const userAPI = {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/api/user/profile')
      return response.data
    } catch (error) {
      console.error('Get Profile Error:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get user profile'
      )
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/user/profile', profileData)
      return response.data
    } catch (error) {
      console.error('Update Profile Error:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      )
    }
  },

  /**
   * Get user subscription info
   * @returns {Promise} Subscription data
   */
  getSubscription: async () => {
    try {
      const response = await api.get('/api/user/subscription')
      return response.data
    } catch (error) {
      console.error('Get Subscription Error:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get subscription info'
      )
    }
  },
}

// Admin API functions
export const adminAPI = {
  /**
   * Get system statistics
   * @returns {Promise} System stats
   */
  getStats: async () => {
    try {
      const response = await api.get('/api/admin/stats')
      return response.data
    } catch (error) {
      console.error('Get Admin Stats Error:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get system stats'
      )
    }
  },

  /**
   * Get all users
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Users list
   */
  getUsers: async (page = 1, limit = 50) => {
    try {
      const response = await api.get('/api/admin/users', {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      console.error('Get Users Error:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get users'
      )
    }
  },

  /**
   * Get system logs
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} level - Log level filter
   * @returns {Promise} System logs
   */
  getLogs: async (page = 1, limit = 50, level = null) => {
    try {
      const params = { page, limit }
      if (level) params.level = level
      
      const response = await api.get('/api/admin/logs', { params })
      return response.data
    } catch (error) {
      console.error('Get Logs Error:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get system logs'
      )
    }
  },
}

// Utility functions
export const utils = {
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Is valid URL
   */
  isValidUrl: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  /**
   * Download file from blob
   * @param {Blob} blob - File blob
   * @param {string} filename - File name
   */
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}

export default api