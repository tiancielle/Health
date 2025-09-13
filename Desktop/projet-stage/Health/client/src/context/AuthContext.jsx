// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier au chargement si un utilisateur est déjà connecté
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Vérifier si le token n'est pas expiré (si c'est un JWT)
        try {
          const tokenParts = storedToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp < currentTime) {
              // Token expiré, nettoyer
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
              localStorage.removeItem('returnUrl');
            } else {
              setCurrentUser(userData);
            }
          } else {
            // Pas un JWT valide, mais on garde quand même (pour les tokens simulés)
            setCurrentUser(userData);
          }
        } catch (tokenError) {
          // Si ce n'est pas un JWT, on garde l'utilisateur (pour les tokens simulés)
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  // Fonction de connexion (simulée mais compatible avec authUtils)
  const login = async (email, password, role) => {
    try {
      // Simulation d'un token JWT (pour la compatibilité avec authUtils)
      const mockToken = generateMockJWT(email, role);
      
      const mockUser = {
        id: Date.now(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: '',
        email,
        role: role.toUpperCase(), // Normaliser en majuscules
      };

      // Stocker dans localStorage (compatible avec authUtils)
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Mettre à jour l'état global
      setCurrentUser(mockUser);

      console.log('User logged in successfully:', mockUser);
      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('returnUrl');
    setCurrentUser(null);
  };

  // Générer un token JWT simulé
  const generateMockJWT = (email, role) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: email,
      role: role.toUpperCase(),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expire dans 24h
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('mock_signature'); // Signature simulée
    
    return `${header}.${payload}.${signature}`;
  };

  // Fonction pour vérifier l'authentification (compatible avec authUtils)
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }

    try {
      // Vérifier le token s'il s'agit d'un JWT
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          return false;
        }
      }
      
      // Vérifier les données utilisateur
      const userData = JSON.parse(user);
      return !!(userData && userData.id);
    } catch (error) {
      return false;
    }
  };

  // Valeur du contexte fournie aux composants enfants
  const value = {
    currentUser,
    login,
    logout,
    loading,
    isAuthenticated
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