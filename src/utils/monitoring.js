import * as Sentry from '@sentry/react';
import * as AppInsights from './applicationInsights';

/**
 * Utility functions for performance monitoring and error tracking
 * Integrates both Sentry and Azure Application Insights
 */

/**
 * Create a performance span to measure a specific operation
 * @param {string} operation - The operation type (e.g., 'ui.click', 'http.client')
 * @param {string} name - A descriptive name for the span
 * @param {Function} callback - The function to execute and measure
 * @param {Object} attributes - Optional attributes to add to the span
 * @returns {any} - The result of the callback function
 */
export const createSpan = (operation, name, callback, attributes = {}) => {
  // Track custom event in Application Insights
  AppInsights.trackEvent(name, {
    operation,
    ...attributes
  });
  
  // Create span in Sentry
  return Sentry.startSpan(
    {
      op: operation,
      name: name,
    },
    (span) => {
      // Add any attributes to the span
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });
      
      const startTime = Date.now();
      try {
        const result = callback();
        
        // For promises, track dependency completion when resolved
        if (result instanceof Promise) {
          return result.then(value => {
            const duration = Date.now() - startTime;
            if (operation === 'http.client') {
              AppInsights.trackDependency(name, attributes.http_url || '', duration, true, attributes);
            }
            return value;
          }).catch(error => {
            const duration = Date.now() - startTime;
            if (operation === 'http.client') {
              AppInsights.trackDependency(name, attributes.http_url || '', duration, false, attributes);
            }
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        if (operation === 'http.client') {
          AppInsights.trackDependency(name, attributes.http_url || '', duration, false, attributes);
        }
        throw error;
      }
    }
  );
};

/**
 * Measure the performance of an API call
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} url - The API endpoint URL
 * @param {Function} apiCall - The function making the API call
 * @returns {Promise<any>} - The result of the API call
 */
export const measureApiCall = async (method, url, apiCall) => {
  return createSpan(
    'http.client',
    `${method} ${url}`,
    apiCall,
    { http_method: method, http_url: url }
  );
};

/**
 * Measure the performance of a UI interaction
 * @param {string} componentName - The name of the component
 * @param {string} actionName - The name of the action (e.g., 'click', 'submit')
 * @param {Function} callback - The function to execute and measure
 * @returns {any} - The result of the callback function
 */
export const measureUIInteraction = (componentName, actionName, callback) => {
  // Track UI event in Application Insights
  AppInsights.trackEvent(`${componentName}.${actionName}`, {
    component: componentName,
    action: actionName,
    type: 'ui.interaction'
  });
  
  return createSpan(
    'ui.interaction',
    `${componentName}.${actionName}`,
    callback,
    { component: componentName, action: actionName }
  );
};

/**
 * Capture an exception with Sentry and Application Insights
 * @param {Error} error - The error object
 * @param {Object} context - Additional context for the error
 */
export const captureException = (error, context = {}) => {
  // Track exception in Sentry
  Sentry.captureException(error, {
    extra: context
  });
  
  // Track exception in Application Insights
  AppInsights.trackException(error, context);
};

/**
 * Log a message to Sentry and Application Insights
 * @param {string} level - Log level: 'debug', 'info', 'warning', 'error', or 'fatal'
 * @param {string} message - The log message
 * @param {Object} data - Additional data to include with the log
 */
export const log = (level, message, data = {}) => {
  const { logger } = Sentry;
  
  // Map severity levels to Application Insights severity levels
  // 0=Verbose, 1=Info, 2=Warning, 3=Error, 4=Critical
  let aiSeverityLevel = 1; // Default to Info
  
  switch (level) {
    case 'debug':
      logger.debug(message, data);
      aiSeverityLevel = 0; // Verbose
      break;
    case 'info':
      logger.info(message, data);
      aiSeverityLevel = 1; // Info
      break;
    case 'warning':
      logger.warn(message, data);
      aiSeverityLevel = 2; // Warning
      break;
    case 'error':
      logger.error(message, data);
      aiSeverityLevel = 3; // Error
      break;
    case 'fatal':
      logger.fatal(message, data);
      aiSeverityLevel = 4; // Critical
      break;
    default:
      logger.log(message, data);
      aiSeverityLevel = 1; // Info
  }
  
  // Log to Application Insights
  AppInsights.trackTrace(message, data, aiSeverityLevel);
};

/**
 * Set user information for Sentry and Application Insights
 * @param {Object} user - User information
 */
export const setUser = (user) => {
  // Set user in Sentry
  Sentry.setUser(user);
  
  // Set user in Application Insights
  if (user && user.id) {
    AppInsights.setAuthenticatedUserContext(
      user.id,
      user.accountId || user.id,
      true
    );
  }
};

/**
 * Clear user information from Sentry and Application Insights
 */
export const clearUser = () => {
  // Clear user in Sentry
  Sentry.setUser(null);
  
  // Clear user in Application Insights
  AppInsights.clearAuthenticatedUserContext();
};

/**
 * Track a page view in both Sentry and Application Insights
 * @param {string} name - Page name
 * @param {string} url - Page URL
 * @param {Object} properties - Additional properties
 */
export const trackPageView = (name, url, properties = {}) => {
  // Track page view in Application Insights
  AppInsights.trackPageView(name, url, properties);
  
  // Sentry automatically tracks page views with BrowserTracing integration
};

/**
 * Initialize monitoring systems
 * @param {Object} config - Configuration options
 */
export const initializeMonitoring = (config = {}) => {
  // Application Insights is initialized in main.jsx
  // This function can be used for additional monitoring setup
  
  // Return the monitoring configuration
  return {
    sentry: Sentry,
    appInsights: AppInsights.getAppInsights()
  };
};