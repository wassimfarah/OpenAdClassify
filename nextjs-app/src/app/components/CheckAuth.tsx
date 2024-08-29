// src/app/components/CheckAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setUser } from '@/Redux/authSlice';
import { apiRequest } from '@/utils/axiosApiRequest';

interface CheckAuthProps {
  onAuthComplete: () => void;
}

const CheckAuth = ({ onAuthComplete }: CheckAuthProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_VERIFY_COOKIE}`,
          useCredentials: true,
        });

        if (response.loggedIn) {
          dispatch(setLoggedIn(true));
          dispatch(setUser(response.user));
        } else {
          dispatch(setLoggedIn(false));
          dispatch(setUser(undefined));
        }
      } catch (error) {
        console.error('Error checking user auth:', error.message);
        dispatch(setLoggedIn(false));
        dispatch(setUser(undefined));
      } finally {
        setLoading(false);
        onAuthComplete(); // Notify that auth check is complete
      }
    };

    checkUserAuth();
  }, [dispatch, onAuthComplete]);

  return null;
};

export default CheckAuth;
