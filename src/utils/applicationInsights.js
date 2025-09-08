import { ApplicationInsights } from '@microsoft/applicationinsights-web';

let appInsights = null;

/**
 * Initialize Azure Application Insights
 * @param {string} connectionString - The Application Insights connection string
 * @param {Object} config - Additional configuration options
 */
export const initializeAppInsights = (connectionString, config = {}) => {
  if (!connectionString) {
    console.warn('Application Insights connection string is not provided');
    return;
  }

  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableCorsCorrelation: true,
      enableRequestHeaderTracking: true,
      enableResponseHeaderTracking: true,
      enableAutoRouteTracking: true,
      ...config
    }
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView(); // Track initial page view

  return appInsights;
};

/**
 * Track a custom event in Application Insights
 * @param {string} name - Event name
 * @param {Object} properties - Custom properties for the event
 */
export const trackEvent = (name, properties = {}) => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.trackEvent({ name, properties });
};

/**
 * Track a metric in Application Insights
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {Object} properties - Custom properties for the metric
 */
export const trackMetric = (name, value, properties = {}) => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.trackMetric({ name, average: value, properties });
};

/**
 * Track a dependency call in Application Insights
 * @param {string} name - Dependency name
 * @param {string} data - Dependency data (e.g., URL)
 * @param {number} duration - Call duration in milliseconds
 * @param {boolean} success - Whether the call was successful
 * @param {Object} properties - Custom properties for the dependency
 */
export const trackDependency = (name, data, duration, success, properties = {}) => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.trackDependencyData({
    id: Date.now().toString(),
    name,
    data,
    duration,
    success,
    resultCode: success ? 200 : 500,
    properties
  });
};

/**
 * Track a page view in Application Insights
 * @param {string} name - Page name
 * @param {string} url - Page URL
 * @param {Object} properties - Custom properties for the page view
 */
export const trackPageView = (name, url, properties = {}) => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.trackPageView({ name, uri: url, properties });
};

/**
 * Track an exception in Application Insights
 * @param {Error} exception - The exception to track
 * @param {Object} properties - Custom properties for the exception
 */
export const trackException = (exception, properties = {}) => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.trackException({ exception, properties });
};

/**
 * Track a trace (log) in Application Insights
 * @param {string} message - The message to log
 * @param {Object} properties - Custom properties for the trace
 * @param {number} severityLevel - Severity level (0=Verbose, 1=Info, 2=Warning, 3=Error, 4=Critical)
 */
export const trackTrace = (message, properties = {}, severityLevel = 1) => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.trackTrace({ message, properties, severityLevel });
};

/**
 * Set authenticated user context
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID
 * @param {string} authenticatedId - Authenticated ID
 */
export const setAuthenticatedUserContext = (userId, accountId, authenticatedId) => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.setAuthenticatedUserContext(userId, accountId, authenticatedId);
};

/**
 * Clear authenticated user context
 */
export const clearAuthenticatedUserContext = () => {
  if (!appInsights) {
    console.warn('Application Insights not initialized');
    return;
  }
  
  appInsights.clearAuthenticatedUserContext();
};

/**
 * Get the Application Insights instance
 * @returns {ApplicationInsights|null} The Application Insights instance or null if not initialized
 */
export const getAppInsights = () => appInsights;