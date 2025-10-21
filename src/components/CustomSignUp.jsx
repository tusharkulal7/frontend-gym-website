import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const CustomSignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/images/gym-banner.png"
              alt="Gym Logo"
              className="w-20 h-20 rounded-full object-cover border-4 border-red-500"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 font-agency">
            JOIN EVOLUTION GYM
          </h1>
          <p className="text-gray-300 text-lg">
            Start your fitness transformation today
          </p>
        </div>

        {/* Sign Up Component */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <SignUp 
            routing="path" 
            path="/signup"
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white text-2xl font-bold mb-4",
                headerSubtitle: "text-gray-300 mb-6",
                socialButtonsBlockButton: "bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-200",
                socialButtonsBlockButtonText: "text-white font-medium",
                dividerLine: "bg-white/30",
                dividerText: "text-gray-300",
                formFieldLabel: "text-white font-medium mb-2",
                formFieldInput: "bg-white/20 border-white/30 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 rounded-lg",
                formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
                footerActionLink: "text-red-400 hover:text-red-300 font-medium",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-red-400 hover:text-red-300",
                formFieldSuccessText: "text-green-400",
                formFieldErrorText: "text-red-400",
                alertClerkError: "text-red-400 bg-red-900/20 border-red-500/30 rounded-lg p-3",
                formFieldHintText: "text-gray-400",
                otpCodeFieldInput: "bg-white/20 border-white/30 text-white text-center",
                formResendCodeLink: "text-red-400 hover:text-red-300",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
            >
              Sign in here
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-600/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-0 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>
    </div>
  );
};

export default CustomSignUp;
