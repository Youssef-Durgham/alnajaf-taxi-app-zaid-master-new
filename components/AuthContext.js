// AuthContext.js
import { createContext } from 'react';

const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: () => {},
  handleSignOut: () => {},
});

export default AuthContext;
