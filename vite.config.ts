import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default ({ mode }: { mode: string })=>{
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  
  return defineConfig({
  // `/jam-lab/` is being used as the fallback simply because it's trickier to set up github enviroment variables/secrets
  base: process.env.VITE_BASE_URL || '/jam-lab/',
  plugins: [react(), tailwindcss()],
  preview: {
    port: 8080,
    strictPort: true
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080"
  }
})
}
