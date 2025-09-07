// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier au chargement si un utilisateur est déjà connecté
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Fonction de connexion (simulée)
  const login = async (email, password, role) => {
    // Simulation: on ne vérifie pas réellement les identifiants
    const mockUser = {
      id: Date.now(),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role,
    };

    // Stocker dans localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    // Mettre à jour l'état global
    setCurrentUser(mockUser);

    return { success: true, user: mockUser };
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Valeur du contexte fournie aux composants enfants
  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte facilement
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}