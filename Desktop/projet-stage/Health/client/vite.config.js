import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Pour accepter les connexions externes
    cors: true, // Activer CORS côté Vite
  },
  // Configuration des variables d'environnement
  define: {
    // Assurer que les variables d'env sont disponibles
  },
  // Configuration pour le développement
  optimizeDeps: {
    exclude: ['lucide-react'], // Éviter les problèmes avec certains packages
  }
})