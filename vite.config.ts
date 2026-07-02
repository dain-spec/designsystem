import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages는 /designsystem/ 서브패스에서 서빙되고, Vercel은 루트 도메인에서 서빙됩니다.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/designsystem/' : '/',
  plugins: [react()],
})
