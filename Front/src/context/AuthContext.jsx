// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Créer le contexte d'authentification
const AuthContext = createContext();

// Créer un fournisseur pour le contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Validation simple du mot de passe (par exemple "admin")
    if (password === 'admin') {
      setUser({ username });
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exporter le hook useAuth pour l'accès au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
