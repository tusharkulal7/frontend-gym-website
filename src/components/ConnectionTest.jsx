import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { systemAPI, galleryAPI, userAPI } from '../utils/api';

const ConnectionTest = () => {
  const { getToken } = useClerk();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = {};

    // Test 1: Backend Health Check
    try {
      const health = await systemAPI.health();
      results.health = { success: true, data: health };
    } catch (error) {
      results.health = { success: false, error: error.message };
    }

    // Test 2: API Documentation
    try {
      const docs = await systemAPI.docs();
      results.docs = { success: true, data: docs };
    } catch (error) {
      results.docs = { success: false, error: error.message };
    }

    // Test 3: Gallery API (requires auth)
    try {
      const token = await getToken();
      if (token) {
        const gallery = await galleryAPI.getAll(token);
        results.gallery = { success: true, data: gallery };
      } else {
        results.gallery = { success: false, error: 'No auth token available' };
      }
    } catch (error) {
      results.gallery = { success: false, error: error.message };
    }

    // Test 4: User API (requires admin auth)
    try {
      const token = await getToken();
      if (token) {
        const users = await userAPI.getAll(token);
        results.users = { success: true, data: users };
      } else {
        results.users = { success: false, error: 'No auth token available' };
      }
    } catch (error) {
      results.users = { success: false, error: error.message };
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const TestResult = ({ name, result }) => (
    <div className="mb-4 p-4 border rounded-lg">
      <div className="flex items-center mb-2">
        <span className="font-semibold mr-2">{name}:</span>
        <span className={`px-2 py-1 rounded text-sm ${
          result?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result?.success ? 'SUCCESS' : 'FAILED'}
        </span>
      </div>
      {result?.error && (
        <div className="text-red-600 text-sm mb-2">
          Error: {result.error}
        </div>
      )}
      {result?.data && (
        <div className="text-gray-600 text-sm">
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Frontend-Backend Connection Test
        </h2>
        <button
          onClick={runTests}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-4">
        <TestResult name="Backend Health Check" result={testResults.health} />
        <TestResult name="API Documentation" result={testResults.docs} />
        <TestResult name="Gallery API" result={testResults.gallery} />
        <TestResult name="User Management API" result={testResults.users} />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Configuration Info:</h3>
        <div className="text-sm text-blue-700">
          <p><strong>Backend URL:</strong> {process.env.REACT_APP_BACKEND_URL}</p>
          <p><strong>Environment:</strong> {process.env.REACT_APP_ENV}</p>
          <p><strong>Clerk Key:</strong> {process.env.REACT_APP_CLERK_PUBLISHABLE_KEY ? 'Configured' : 'Missing'}</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
