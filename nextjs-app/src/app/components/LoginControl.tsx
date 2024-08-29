// src/app/components/LoginControl.tsx
'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { setLoggedIn } from '../../Redux/authSlice';

const LoginControl = () => {
  const { loggedIn, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLoginToggle = () => {
    dispatch(setLoggedIn(!loggedIn));
  };

  return (
    <div className="mt-4">
      <p>Current Status: {loggedIn ? 'Logged In' : 'Logged Out'}</p>
      {loggedIn && user && (
        <div>
          <h3>User Info:</h3>
          {Object.entries(user).map(([key, value]) => (
            <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
          ))}
        </div>
      )}
      <button onClick={handleLoginToggle} className="btn btn-primary">
        {loggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
};

export default LoginControl;
