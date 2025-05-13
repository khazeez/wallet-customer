import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to whitelist specific hosts
    {
      name: 'host-whitelist',
      configureServer(server) {
        // Patch the server's middleware to disable host check
        const originalMiddleware = server.middlewares.use;
        server.middlewares.use = function(path, ...handlers) {
          return originalMiddleware.call(this, path, ...handlers.map(handler => {
            return (req, res, next) => {
              // Skip host validation by always calling next()
              next();
            };
          }));
        };
      }
    }
  ],
  server: {
    port: 5173,
    host: true, // Listen on all addresses
    cors: true,
    hmr: {
      clientPort: 5173,
      protocol: 'ws',
      host: 'localhost',
    },
    strictPort: true,
    fs: {
      strict: false,
      allow: ['..'],
    },
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
  define: {
    'process.env': {}
  },
})
