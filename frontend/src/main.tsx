import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

console.log('main.tsx: attempting to render');

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  console.log('main.tsx: root created', root);

  const GOOGLE_CLIENT_ID = "556513371296-b4us06j8747jfd8j7octn6nj1ev5o2dk.apps.googleusercontent.com"; // REPLACE WITH ACTUAL ID

  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ErrorBoundary>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ErrorBoundary>
      </GoogleOAuthProvider>
    </React.StrictMode>,
  )
  console.log('main.tsx: render called');
} catch (error) {
  console.error('main.tsx: Error during rendering:', error);
}
