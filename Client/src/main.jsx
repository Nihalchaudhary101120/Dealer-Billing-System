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
import { PartProvider } from './context/partContext.jsx';
import { HsnProvider } from "./context/HsnContext.jsx";
import { BillToProvider } from "./context/BillToContext.jsx";


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DealerProvider>
            <HsnProvider>
              <PartProvider>
                <BikeProvider>
                  <BankProvider>
                    <BillToProvider>
                      <App />
                    </BillToProvider>
                  </BankProvider>
                </BikeProvider>
              </PartProvider>
            </HsnProvider>
          </DealerProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
