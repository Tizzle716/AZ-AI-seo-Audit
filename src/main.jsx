import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as Sentry from '@sentry/react'  
import { Replay } from '@sentry/replay'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import * as AppInsights from './utils/applicationInsights'

// Initialize Azure Application Insights
AppInsights.initializeAppInsights(
  import.meta.env.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING,
  {
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAjaxErrorStatusText: true,
    enableAjaxPerfTracking: true,
    maxAjaxCallsPerView: 500,
    disableFetchTracking: false,
    enableUnhandledPromiseRejectionTracking: true,
    samplingPercentage: 100,
    autoTrackPageVisitTime: true,
    disableExceptionTracking: false,
    disableTelemetry: import.meta.env.DEV, // Disable in development
  }
);

// Initialize Sentry for monitoring and error tracking
Sentry.init({
  dsn: "https://2ab144accd02fa4453d863ccddb32139@o4509860703240192.ingest.us.sentry.io/4509865608151040",
  integrations: [
    Sentry.browserTracingIntegration(),
    new Replay({
      // Configure Session Replay
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  
  // Performance monitoring
  tracesSampleRate: 0.5, // Capture 50% of transactions for performance monitoring
  replaysSessionSampleRate: 0.1, // Sample rate for session replay - 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Sample rate for sessions with errors - 100%
  
  // Enable logging
  enableLogs: true,
  
  // Set environment based on NODE_ENV
  environment: import.meta.env.MODE || 'development',
  
  // Customize error tracking
  beforeSend(event) {
    // Don't send events in development
    if (import.meta.env.DEV) {
      return null;
    }
    return event;
  },
});

// Get Sentry logger
const { logger } = Sentry;

// Log application startup
logger.info('Application starting', { version: import.meta.env.VITE_APP_VERSION || '1.0.0' });

// Track application startup in Application Insights
AppInsights.trackEvent('Application starting', { 
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.MODE || 'development'
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)