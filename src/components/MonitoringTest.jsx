import React, { useState } from 'react';
import { measureUIInteraction, captureException, log, trackPageView } from '../utils/monitoring';

/**
 * Test component for verifying Sentry and Azure Application Insights integration
 */
const MonitoringTest = () => {
  const [testResult, setTestResult] = useState('');

  // Test UI interaction tracking
  const handleTestUIInteraction = () => {
    measureUIInteraction('MonitoringTest', 'buttonClick', () => {
      setTestResult('UI interaction tracked successfully');
      log('info', 'Test UI interaction button clicked', { component: 'MonitoringTest' });
    });
  };

  // Test exception tracking
  const handleTestException = () => {
    try {
      // Deliberately throw an error for testing
      throw new Error('Test error for monitoring');
    } catch (error) {
      captureException(error, { component: 'MonitoringTest', action: 'testException' });
      setTestResult('Exception tracked successfully');
    }
  };

  // Test page view tracking
  const handleTestPageView = () => {
    trackPageView('Test Page', window.location.href, { test: true });
    setTestResult('Page view tracked successfully');
  };

  // Test logging at different levels
  const handleTestLogging = () => {
    log('debug', 'Debug test message', { component: 'MonitoringTest' });
    log('info', 'Info test message', { component: 'MonitoringTest' });
    log('warning', 'Warning test message', { component: 'MonitoringTest' });
    log('error', 'Error test message', { component: 'MonitoringTest' });
    setTestResult('Logs sent successfully');
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">Monitoring Integration Test</h2>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={handleTestUIInteraction}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test UI Interaction
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Tests tracking UI interactions in both Sentry and Application Insights
          </p>
        </div>

        <div>
          <button 
            onClick={handleTestException}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Test Exception Tracking
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Tests exception capturing in both Sentry and Application Insights
          </p>
        </div>

        <div>
          <button 
            onClick={handleTestPageView}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Page View
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Tests page view tracking in Application Insights
          </p>
        </div>

        <div>
          <button 
            onClick={handleTestLogging}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Logging
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Tests logging at different levels in both Sentry and Application Insights
          </p>
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="font-medium">Result: {testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringTest;