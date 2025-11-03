import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { STATIC_IMAGES } from '../constants/staticImages';

const CustomSignIn = () => {
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
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
            Sign in to access your fitness journey
          </p>
        </div>

        {/* Sign In Component (single card) */}
        <SignIn 
          routing="path" 
          path="/login"
          signUpUrl="/signup"
          appearance={{
            elements: {
              // Center the whole widget and limit width
              rootBox: "w-full flex items-center justify-center",
              // Apply glassmorphism directly to Clerk card so there's only ONE visible box
              card: "w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
              // Make inner box transparent to avoid the double-box effect
              cardBox: "bg-transparent shadow-none border-none p-0",
              headerTitle: "text-white text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3",
              headerSubtitle: "text-gray-300 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4",
              socialButtonsBlockButton: "bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-200 text-sm sm:text-base py-2 sm:py-3",
              socialButtonsBlockButtonText: "text-white font-medium text-sm sm:text-base",
              dividerLine: "bg-white/30",
              dividerText: "text-gray-300 text-xs sm:text-sm",
              formFieldLabel: "text-white font-medium mb-1.5 text-sm sm:text-base",
              formFieldInput: "bg-white/20 border-white/30 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 rounded-lg text-sm sm:text-base py-2 sm:py-3 px-3",
              formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base",
              footerActionLink: "text-red-400 hover:text-red-300 font-medium text-sm sm:text-base",
              identityPreviewText: "text-white text-sm sm:text-base",
              identityPreviewEditButton: "text-red-400 hover:text-red-300 text-xs sm:text-sm",
              formFieldSuccessText: "text-green-400 text-xs sm:text-sm",
              formFieldErrorText: "text-red-400 text-xs sm:text-sm",
              alertClerkError: "text-red-400 bg-red-900/20 border-red-500/30 rounded-lg p-2 sm:p-3 text-xs sm:text-sm",
              formFieldHintText: "text-gray-400 text-xs sm:text-sm",
              otpCodeFieldInput: "bg-white/20 border-white/30 text-white text-center text-base sm:text-lg py-2 sm:py-3",
              formResendCodeLink: "text-red-400 hover:text-red-300 text-xs sm:text-sm",
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: false,
            },
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full blur-xl -z-10"></div>
      <div className="fixed bottom-10 right-10 w-20 h-20 sm:w-24 sm:h-24 bg-red-600/20 rounded-full blur-2xl -z-10"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default CustomSignIn;
