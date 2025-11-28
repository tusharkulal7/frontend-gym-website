import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { STATIC_IMAGES } from '../constants/staticImages';

export function OAuthCallback() {
  const { handleRedirectCallback } = useClerk();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');

        // Handle the OAuth callback with Clerk
        await handleRedirectCallback({
          afterSignInUrl: '/',
          afterSignUpUrl: '/',
          redirectUrl: '/'
        });

        console.log('✅ OAuth callback processed, waiting for user data...');

        // Wait for user data to be fully loaded
        setIsProcessing(false);

      } catch (error) {
        console.error('❌ OAuth callback error:', error);
        setIsProcessing(false);
        // On error, redirect to login
        navigate('/login', { replace: true });
      }
    };

    handleOAuth();
  }, [handleRedirectCallback, navigate]);

  // Wait for user data to be loaded before redirecting
  useEffect(() => {
    if (!isProcessing && isLoaded && user) {
      console.log('✅ User data loaded, redirecting to home...');
      navigate('/', { replace: true });
    }
  }, [isProcessing, isLoaded, user, navigate]);

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
          {isProcessing ? 'Completing Sign In' : 'Loading Your Profile'}
        </h2>

        <div className="my-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            <p className="text-gray-300 text-sm">
              {isProcessing ? 'Please wait...' : 'Almost ready...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;
