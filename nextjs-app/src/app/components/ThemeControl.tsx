// src/app/components/ThemeControl.tsx
'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { toggleTheme } from '../../Redux/themeSlice';

const ThemeControl = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const handleDisplayState = () => {
    alert(`Current theme: ${darkMode ? 'Dark Mode' : 'Light Mode'}`);
  };

  return (
    <div className="mt-4">
      <button onClick={handleDisplayState} className="btn btn-info me-2">
        Display Current Theme
      </button>
      <button onClick={handleToggle} className="btn btn-warning">
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeControl;
