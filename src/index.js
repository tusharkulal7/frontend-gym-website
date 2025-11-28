// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error('❌ REACT_APP_CLERK_PUBLISHABLE_KEY is not set');
}

const clerkAppearance = {
  elements: {
    formButtonPrimary: 'bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-md transition-colors',
    card: 'bg-white/10 backdrop-blur-md border border-white/20',
    headerTitle: 'text-white',
    headerSubtitle: 'text-gray-300',
    socialButtonsBlockButton: 'border border-gray-600 hover:bg-gray-800/50',
    socialButtonsBlockButtonText: 'text-white',
    formFieldInput: 'bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-red-500',
    footerActionText: 'text-gray-400',
    footerActionLink: 'text-red-400 hover:text-red-300',
  },
  variables: {
    colorPrimary: '#EF4444',
    colorText: '#FFFFFF',
    colorInputText: '#FFFFFF',
    colorBackground: '#1F2937',
    colorInputBackground: 'rgba(255, 255, 255, 0.1)',
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      navigate={(to) => window.location.href = to}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

// Measure performance (optional)
reportWebVitals();
