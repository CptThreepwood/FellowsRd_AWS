// Context to hold auth information
import React from 'react';

export const AuthContext = React.createContext({
  authDetails: null,
  updateAuth: () => {},
})