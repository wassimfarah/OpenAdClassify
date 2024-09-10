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
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
import { Spinner } from 'react-bootstrap';

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
                <main>{children}</main>
              </RouteAuthGuard>
              <SocketManager />
              <PendingMessageCountFetcher />
              <ProgressBar
                height="2px" 
                color="red" 
                options={{ showSpinner: false }} 
                shallowRouting // Enable shallow routing support
              />
              <ToastContainer /> 
              <Footer />
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
              <Spinner animation="border" role="status">
              </Spinner>
            </div>
          )}
        </Provider>
      </body>
    </html>
  );
}
