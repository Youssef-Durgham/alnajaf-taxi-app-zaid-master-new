// AuthProvider.js
import React, { useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const value = {
    isSignedIn,
    setIsSignedIn,
    handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
