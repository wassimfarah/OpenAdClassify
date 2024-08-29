// src/app/components/CheckAuth.tsx
'use client';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setLoggedIn, setUser } from '@/Redux/authSlice';
import { apiRequest } from '@/utils/apiRequest';

const CheckAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_VERIFY_COOKIE}`, // Replace with your actual endpoint
          useCredentials: true, // Ensure credentials are sent with the request
        });

        console.log('User auth response:', response);

        if (response.loggedIn) {
          dispatch(setLoggedIn(true));
          dispatch(setUser(response.user)); // Dispatch user data
        } else {
          dispatch(setLoggedIn(false));
          dispatch(setUser(undefined)); // Clear user data
        }
      } catch (error) {
        console.error('Error checking user auth:', error.message);
        dispatch(setLoggedIn(false));
        dispatch(setUser(undefined)); // Clear user data on error
      }
    };

    checkUserAuth();
  }, [dispatch]);

  return null;
};

export default CheckAuth;
