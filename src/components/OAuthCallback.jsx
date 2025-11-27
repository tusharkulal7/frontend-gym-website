import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { STATIC_IMAGES } from '../constants/staticImages';

export function OAuthCallback() {
  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Completing authentication...');

  useEffect(() => {
    if (!signInLoaded || !authLoaded) {
      console.log('⏳ Clerk not fully loaded yet');
      return;
    }

    // If already signed in, redirect to home
    if (isSignedIn) {
      console.log('✅ Already signed in, redirecting to home');
      navigate('/');
      return;
    }

    async function handleOAuthCallback() {
      try {
        setStatus('Completing authentication...');

        // Complete the OAuth flow using signIn (works for both signin and signup)
        const result = await signIn.create({
          strategy: 'oauth_callback',
          redirectUrl: window.location.href
        });

        console.log('OAuth callback result:', result);

        if (result.status === 'complete') {
          setStatus('Finalizing your session...');

          // Set the active session
          await setActive({ session: result.createdSessionId });

          console.log('✅ OAuth authentication successful');
          // Let Clerk handle the redirect to redirectUrlComplete
          return;
        }

        // Handle other statuses
        if (result.status === 'needs_identifier') {
          throw new Error('Additional information is required to complete authentication');
        }

        if (result.status === 'needs_new_password') {
          navigate('/reset-password');
          return;
        }

        console.warn('Unexpected status during OAuth:', result.status);
        throw new Error('Unexpected status during authentication: ' + result.status);

      } catch (err) {
        console.error('❌ OAuth callback error:', err);

        // More specific error handling
        if (err.errors?.[0]?.code === 'form_identifier_exists') {
          setError('An account with this email already exists. Please sign in directly.');
        } else if (err.status === 422) {
          setError('Invalid OAuth response. Please try again.');
        } else {
          setError(err.message || 'Failed to complete authentication. Please try again.');
        }

        setStatus('Error occurred');
      }
    }

    handleOAuthCallback();
  }, [signInLoaded, authLoaded, isSignedIn, navigate, setActive, signIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <img 
            src={STATIC_IMAGES.logo} 
            alt="Gym Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          {error ? 'Sign In Failed' : 'Signing You In'}
        </h2>
        
        <div className="my-6">
          {error ? (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              <p className="text-gray-300">{status}</p>
            </div>
          )}
        </div>
        
        {error && (
          <button
            onClick={() => navigate('/login')}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default OAuthCallback;
