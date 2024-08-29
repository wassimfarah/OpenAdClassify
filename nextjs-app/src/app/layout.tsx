'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { ReactNode } from 'react';
import CustomNavbar from './components/Navbar';
import { Provider } from 'react-redux';
import { store } from '../Redux/store';
import CheckAuth from './components/CheckAuth';
import { useState } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);

  // Function to handle the completion of authentication check
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
              <CustomNavbar />
              {children}
            </>
          ) : <></> 
          
           // <div>Loading...</div> // Show a loading message or spinner
          }
        </Provider>
      </body>
    </html>
  );
}
