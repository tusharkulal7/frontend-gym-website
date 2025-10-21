import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const AdminSetup = () => {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const makeSuperAdmin = async () => {
    setLoading(true);
    setMessage('');

    // Check if Clerk is loaded
    if (!isLoaded || !authLoaded) {
      setMessage('Please wait for the page to fully load and try again.');
      setLoading(false);
      return;
    }

    // Check if user is signed in
    if (!user) {
      setMessage('Please sign in first');
      setLoading(false);
      return;
    }

    // Check if getToken is available
    if (!getToken || typeof getToken !== 'function') {
      setMessage('Authentication system not ready. Please refresh the page.');
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        setMessage('Unable to get authentication token. Please sign in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/make-super-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Successfully promoted to Super Admin! Please refresh the page.');
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setMessage('');

    // Check if Clerk is loaded
    if (!isLoaded || !authLoaded) {
      setMessage('❌ Clerk not loaded yet. Please wait and try again.');
      setLoading(false);
      return;
    }

    // Check if user is signed in
    if (!user) {
      setMessage('❌ No user signed in. Please sign in first.');
      setLoading(false);
      return;
    }

    // Check if getToken is available
    if (!getToken || typeof getToken !== 'function') {
      setMessage('❌ getToken function not available. Please refresh the page.');
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        setMessage('❌ No token available. Please sign in again.');
        setLoading(false);
        return;
      }

      console.log('Token available:', !!token);
      console.log('User role:', user?.publicMetadata?.role);
      setMessage(`✅ Auth working! Role: ${user?.publicMetadata?.role || 'user'}`);
    } catch (error) {
      setMessage(`❌ Auth error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if Clerk is not loaded
  if (!isLoaded || !authLoaded) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Setup & Testing</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading authentication system...</span>
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>User loaded: {isLoaded ? '✅' : '⏳'}</p>
          <p>Auth loaded: {authLoaded ? '✅' : '⏳'}</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Setup & Testing</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Please sign in to use the admin setup tools.</p>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Setup & Testing</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Current User Info:</h3>
          <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'Loading...'}</p>
          <p><strong>Role:</strong> {user?.publicMetadata?.role || 'user'}</p>
          <p><strong>User Status:</strong> <span className="text-green-600">✅ Loaded</span></p>
          <p><strong>Auth Status:</strong> <span className="text-green-600">✅ Loaded</span></p>
          <p><strong>getToken:</strong> <span className="text-green-600">✅ Available</span></p>
        </div>

        <button
          onClick={testAuth}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Authentication'}
        </button>

        <button
          onClick={makeSuperAdmin}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Make Me Super Admin'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="text-sm text-gray-600 mt-4">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>First click "Test Authentication" to verify your login</li>
            <li>Then click "Make Me Super Admin" to get admin privileges</li>
            <li>Refresh the page after becoming super admin</li>
            <li>Try accessing the Gallery upload and AllUsers page</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
