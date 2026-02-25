import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Backend URL for the Vite proxy — never exposed to the browser bundle.
  // Use VITE_TARS_BACKEND_URL to point the proxy at TARS regardless of what
  // VITE_TARS_API_BASE says (frontend might use /api while backend is elsewhere).
  const backendUrl = (
    env.VITE_TARS_BACKEND_URL ||
    env.VITE_TARS_API_BASE ||
    'http://127.0.0.1:8000'
  ).replace(/\/+$/, '');

  // Optional operator token injection (dev only — server-side, never in bundle)
  const operatorToken = env.VITE_TARS_OPERATOR_TOKEN || '';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // BFF proxy: browser calls /api/... → TARS backend (strips /api prefix)
        // This is the recommended dev mode — avoids CORS entirely.
        // Set VITE_TARS_BACKEND_URL=http://127.0.0.1:8000 (or wherever TARS runs)
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Inject operator token server-side so it never reaches the browser bundle
              if (operatorToken) {
                proxyReq.setHeader('X-Operator-Token', operatorToken);
              }
            });
            proxy.on('error', (err, _req, res) => {
              console.error('[vite proxy] backend unreachable:', err.message);
              if (!res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  detail: `TARS backend unreachable at ${backendUrl}. Is it running?`,
                  proxy_error: err.message,
                }));
              }
            });
          },
        },
      },
    },
  };
});
