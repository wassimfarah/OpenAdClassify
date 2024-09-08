'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { ReactNode } from 'react';
import CustomNavbar from './components/Navbar';
import { Provider } from 'react-redux';
import { store } from '../Redux/store';
import CheckAuth from './components/CheckAuth';
import { useState } from 'react';
import RouteAuthGuard from './components/RouteAccessControl ';
import SocketManager from './components/SocketManager';
import PendingMessageCountFetcher from './components/PendingMessageCountFetcher';

export default function Layout({ children }: { children: ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);

  const handleAuthComplete = () => {
    setAuthChecked(true);
  };

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <CheckAuth onAuthComplete={handleAuthComplete} />
          {authChecked ? (
            <>
              <RouteAuthGuard>
                <CustomNavbar />
                {children}
              </RouteAuthGuard>
              <SocketManager /> 
              <PendingMessageCountFetcher/>
            </>
          ) : (
            <div>Loading...</div> // Show Spinner or loading state while auth is checked
          )}
        </Provider>
      </body>
    </html>
  );
}
