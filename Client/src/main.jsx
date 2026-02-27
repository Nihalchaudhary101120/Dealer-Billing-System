import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { DealerProvider } from './context/DealerContext.jsx';
import { BikeProvider } from './context/BikeContext.jsx';
import { BankProvider } from './context/BankContext.jsx';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DealerProvider>
            <BikeProvider>
              <BankProvider>
                <App />
              </BankProvider>
            </BikeProvider>
          </DealerProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
