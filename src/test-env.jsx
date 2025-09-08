import React from 'react';

/**
 * Component to test environment variable access
 * This component displays the values of environment variables to verify they're accessible
 */
function TestEnvironmentVariables() {
  // Get all environment variables with VITE_ prefix
  const envVars = Object.keys(import.meta.env)
    .filter(key => key.startsWith('VITE_'))
    .reduce((obj, key) => {
      obj[key] = import.meta.env[key];
      return obj;
    }, {});

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Environment Variables Test</h2>
      <p>This component confirms that environment variables are properly accessible.</p>
      
      <h3>Available VITE_ Environment Variables:</h3>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {JSON.stringify(envVars, null, 2)}
      </pre>
      
      <h3>Individual Access Test:</h3>
      <ul>
        <li>VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL || 'Not defined'}</li>
        <li>VITE_ENVIRONMENT: {import.meta.env.VITE_ENVIRONMENT || 'Not defined'}</li>
        <li>VITE_APP_VERSION: {import.meta.env.VITE_APP_VERSION || 'Not defined'}</li>
      </ul>
      
      <p><strong>Note:</strong> If you can see the values above, the environment variables are working correctly!</p>
    </div>
  );
}

export default TestEnvironmentVariables;