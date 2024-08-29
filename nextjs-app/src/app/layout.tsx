'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { ReactNode } from 'react';
import CustomNavbar from './components/Navbar';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../Redux/store';
import CheckAuth from './components/CheckAuth';

// Component for checking user authentication

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          < CheckAuth/>
          <CustomNavbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
