import React, { useState, useContext, useCallback } from 'react'
import { SubscriptionContext } from '../contexts/SubscriptionContext'
import { sheetsCleanerAPI } from '../utils/api'
import { FaFileExcel, FaUpload, FaDownload, FaSpinner, FaTrash, FaCheck, FaCog } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { measureUIInteraction, captureException, log } from '../utils/monitoring'

const SheetsCleanerPage = () => {
  const { subscription } = useContext(SubscriptionContext)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  
  // Processing options
  const [options, setOptions] = useState({
    remove_duplicates: true,
    trim_whitespace: true,
    standardize_formats: true,
    remove_empty_rows: true,
    validate_emails: false,
    validate_phones: false,
    normalize_text: false,
    convert_data_types: false,
  })
  
  const getTierFromSubscription = () => {
    if (!subscription?.isActive) return 'free'
    return subscription.tier || 'free'
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        setError('')
      }
    }
  }, [])

  const validateFile = (file) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Please upload a valid CSV or Excel file')
      return false
    }
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB')
      return false
    }
    
    return true
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile)
      setError('')
    }
  }

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  const handleProcessFile = async () => {
    if (!file) {
      setError('Please select a file to process')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await sheetsCleanerAPI.cleanSpreadsheet(file, options)
      setResults(data)
      toast.success('File processed successfully!')
    } catch (err) {
      setError(err.message)
      toast.error('Failed to process file')
    } finally {
      setLoading(false)
    }
  }

  const downloadProcessedFile = (format = 'csv') => {
    if (!results?.processed_data) return
    
    measureUIInteraction('sheets_download_processed_file', { format }, () => {
      try {
        log.info('Downloading processed sheets file', { format })
        
        let content, mimeType, extension
        
        switch (format) {
          case 'csv':
            content = convertToCSV(results.processed_data)
            mimeType = 'text/csv'
            extension = 'csv'
            break
          case 'json':
            content = JSON.stringify(results.processed_data, null, 2)
            mimeType = 'application/json'
            extension = 'json'
            break
          default:
            content = convertToCSV(results.processed_data)
            mimeType = 'text/csv'
            extension = 'csv'
        }
        
        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `cleaned-data-${Date.now()}.${extension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        log.info('Processed sheets file downloaded successfully', { format })
      } catch (error) {
        captureException(error, {
          tags: { action: 'sheets_download_processed_file' },
          extra: { format }
        })
        log.error('Failed to download processed sheets file', { format, error: error.message })
        toast.error('Failed to download file')
      }
    })
  }

  const convertToCSV = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || ''
          return typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        }).join(',')
      )
    ].join('\n')
    
    return csvContent
  }

  const removeFile = () => {
    setFile(null)
    setResults(null)
    setError('')
  }

  const renderProcessingOptions = () => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <FaCog className="mr-2" />
        Processing Options
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries({
          remove_duplicates: 'Remove Duplicate Rows',
          trim_whitespace: 'Trim Whitespace',
          standardize_formats: 'Standardize Formats',
          remove_empty_rows: 'Remove Empty Rows',
          validate_emails: 'Validate Email Addresses',
          validate_phones: 'Validate Phone Numbers',
          normalize_text: 'Normalize Text Case',
          convert_data_types: 'Auto-Convert Data Types',
        }).map(([key, label]) => (
          <label key={key} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => handleOptionChange(key)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const renderResults = () => {
    if (!results) return null

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Processing Results</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => downloadProcessedFile('csv')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaDownload className="mr-2" />
              Download CSV
            </button>
            <button
              onClick={() => downloadProcessedFile('json')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaDownload className="mr-2" />
              Download JSON
            </button>
          </div>
        </div>
        
        {/* Statistics */}
        {results.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{results.statistics.total_rows || 0}</div>
              <div className="text-sm text-blue-800">Total Rows</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{results.statistics.cleaned_rows || 0}</div>
              <div className="text-sm text-green-800">Cleaned Rows</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{results.statistics.removed_rows || 0}</div>
              <div className="text-sm text-yellow-800">Removed Rows</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{results.statistics.total_columns || 0}</div>
              <div className="text-sm text-purple-800">Columns</div>
            </div>
          </div>
        )}
        
        {/* Data Preview */}
        {results.processed_data && results.processed_data.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(results.processed_data[0]).map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.processed_data.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.processed_data.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing first 5 rows of {results.processed_data.length} total rows
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaFileExcel className="text-4xl text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Sheets Cleaner</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clean, validate, and standardize your spreadsheet data with our powerful processing tool
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload File</h2>
          
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">Drop your file here or click to browse</p>
              <p className="text-sm text-gray-500 mb-4">Supports CSV, Excel (.xlsx, .xls) files up to 10MB</p>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaUpload className="mr-2" />
                Choose File
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaFileExcel className="text-2xl text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <FaTrash className="mr-1" />
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Processing Options */}
        {file && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {renderProcessingOptions()}
            
            <div className="mt-6">
              <button
                onClick={handleProcessFile}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing File...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Process File
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {renderResults()}
      </div>
    </div>
  )
}

export default SheetsCleanerPage