import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { STATIC_IMAGES } from '../constants/staticImages';

const CustomSignIn = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { isLoaded: signUpLoaded } = useSignUp();

  const isLoaded = signInLoaded && signUpLoaded;

  const handleError = (error) => {
    console.error('Authentication error:', error);
    let errorMessage = 'Failed to sign in. Please try again.';
    
    if (error.errors?.[0]?.message) {
      errorMessage = error.errors[0].message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.log('Displaying error to user:', errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    if (!isLoaded) {
      setError('Authentication service is not ready yet. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use Clerk's built-in OAuth redirect - it handles everything automatically
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/`,
      });
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center px-3 sm:px-4 lg:px-6 py-4 pt-24 sm:pt-28 pb-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img
              src={STATIC_IMAGES.logo}
              alt="Gym Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 sm:border-3 border-red-500"
            />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 font-agency">
            EVOLUTION GYM & FITNESS
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-2">
            Access your fitness journey with one click
          </p>
          {isLoading && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mr-2"></div>
              <span className="text-white">Connecting to Google...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
        </div>

        {/* Google-only Authentication */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-4 text-center">
            Continue with Google
          </h2>
          <p className="text-gray-300 text-sm sm:text-base text-center mb-6">
            Sign in or create your account instantly with Google. No passwords needed - fast and secure.
          </p>
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading || !isLoaded}
            className={`w-full flex items-center justify-center space-x-3 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
              isLoading || !isLoaded
                ? 'bg-white/20 text-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span className="bg-white rounded-full p-1">
              <svg className="h-6 w-6" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.18 0 6.04 1.09 8.29 3.23l6.19-6.19C34.55 2.52 29.64.5 24 .5 14.82.5 6.73 5.98 2.73 13.72l7.32 5.69C11.83 13.05 17.39 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.21-.44-4.74H24v9.11h12.7c-.55 2.98-2.22 5.5-4.73 7.18l7.25 5.62C43.95 37.28 46.5 31.39 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.05 28.41a13.5 13.5 0 010-8.82l-7.32-5.69A23.94 23.94 0 000 24c0 3.9.93 7.58 2.73 10.76l7.32-5.69z"/>
                <path fill="#34A853" d="M24 47.5c6.48 0 11.91-2.13 15.88-5.79l-7.25-5.62c-2.01 1.35-4.59 2.14-8.63 2.14-6.61 0-12.17-3.55-13.95-8.75l-7.32 5.69C6.73 42.02 14.82 47.5 24 47.5z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            </span>
            <span>{isLoading ? 'Redirecting…' : 'Continue with Google'}</span>
          </button>
          <p className="text-gray-400 text-xs sm:text-sm text-center mt-6">
            New users are automatically registered when signing in with Google
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full blur-xl -z-10"></div>
      <div className="fixed bottom-10 right-10 w-20 h-20 sm:w-24 sm:h-24 bg-red-600/20 rounded-full blur-2xl -z-10"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default CustomSignIn;
