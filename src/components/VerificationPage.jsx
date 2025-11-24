import React, { useEffect, useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { STATIC_IMAGES } from '../constants/staticImages';

export default function VerificationPage() {
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Verifying your information...');
  const { isLoaded: signInLoaded, setActive: setActiveSignIn } = useSignIn();
  const { isLoaded: signUpLoaded, setActive: setActiveSignUp } = useSignUp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signInLoaded || !signUpLoaded) {
      console.log('⏳ Clerk not fully loaded yet');
      return;
    }

    async function verifySession() {
      try {
        setStatus('Verifying your session...');
        
        // Get the session ID from URL or from Clerk's state
        const searchParams = new URLSearchParams(window.location.search);
        const sessionId = searchParams.get('__session_id') || 
                         (window.Clerk && window.Clerk.session && window.Clerk.session.id);
        
        console.log('Verifying session with ID:', sessionId);
        
        if (!sessionId) {
          throw new Error('No active session found. Please try signing in again.');
        }

        // Try to complete the sign up first (since we're coming from sign up)
        try {
          setStatus('Completing your sign up...');
          const result = await setActiveSignUp({ 
            session: sessionId,
            beforeEmit: () => {
              // This runs before the session is set
              console.log('Setting up user session...');
            }
          });
          
          if (result && result.status === 'complete') {
            console.log('✅ Sign up verification successful');
            // Give it a moment to ensure the session is fully set
            setTimeout(() => navigate('/'), 500);
            return;
          }
        } catch (signUpError) {
          console.log('Not a sign up, trying sign in...', signUpError);
        }

        // If sign up fails, try sign in
        try {
          setStatus('Completing your sign in...');
          const result = await setActiveSignIn({ 
            session: sessionId,
            beforeEmit: () => {
              console.log('Finalizing your session...');
            }
          });
          
          if (result && result.status === 'complete') {
            console.log('✅ Sign in verification successful');
            // Give it a moment to ensure the session is fully set
            setTimeout(() => navigate('/'), 500);
            return;
          }
        } catch (signInError) {
          console.error('Sign in verification failed:', signInError);
          throw signInError;
        }

        // If we get here, verification failed
        throw new Error('Could not verify your session. Please try signing in again.');

      } catch (err) {
        console.error('❌ Verification error:', err);
        
        // More specific error handling
        if (err.errors?.[0]?.code === 'session_expired') {
          setError('Your verification session has expired. Please try signing in again.');
        } else if (err.errors?.[0]?.code === 'verification_failed') {
          setError('Verification failed. The link might be invalid or expired.');
        } else {
          setError(err.message || 'Failed to verify your session. Please try again.');
        }
        
        setStatus('Verification Failed');
      }
    }

    verifySession();
  }, [signInLoaded, signUpLoaded, navigate, setActiveSignIn, setActiveSignUp]);

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
          {error ? 'Verification Failed' : 'Verifying Your Account'}
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
            onClick={() => window.location.href = '/login'}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}
