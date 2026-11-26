import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { staticPages } from './scripts/static-pages.mjs'

export default defineConfig(({ mode }) => {
  const { SITE_ORIGIN } = loadEnv(mode, process.cwd(), 'SITE_ORIGIN')
  return {
    plugins: [tailwindcss(), staticPages(SITE_ORIGIN)],
    esbuild: { jsx: 'automatic' },
  }
})
