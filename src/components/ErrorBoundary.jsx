import React from 'react';
import * as Sentry from '@sentry/react';

const FallbackUI = ({ error, componentStack, resetError }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-2">Something went wrong</h2>
        <p className="text-gray-600 text-center mb-4">We've been notified about this issue and are working to fix it.</p>
        
        <div className="bg-gray-100 p-3 rounded mb-4 overflow-auto max-h-40">
          <p className="text-sm font-mono text-red-600">{error?.toString()}</p>
        </div>
        
        <button
          onClick={resetError}
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded transition duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <FallbackUI 
          error={error} 
          componentStack={componentStack} 
          resetError={resetError} 
        />
      )}
      beforeCapture={(scope) => {
        scope.setTag("error_location", "react_error_boundary");
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;