import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { exec } from 'child_process';

// Middleware pour simuler l'API de vérification FFMPEG
const checkFfmpegMiddleware = (req, res, next) => {
  if (req.url === '/api/check-ffmpeg') {
    exec('ffmpeg -version', (error, stdout, stderr) => {
      if (error) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          installed: false, 
          error: 'FFMPEG is not installed or not in PATH'
        }));
        return;
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        installed: true, 
        version: stdout.split('\n')[0]
      }));
    });
    return;
  }
  next();
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(checkFfmpegMiddleware);
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));