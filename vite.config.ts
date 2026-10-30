import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'transform-to-classic-script',
      apply: 'build', // 仅在生产构建时转为经典脚本，保证开发模式 (dev) HMR 正常运行
      enforce: 'post',
      transformIndexHtml(html) {
        return html
          .replace(
            /<script\s+type="module"\s+crossorigin\s+src="([^"]+)"\s*><\/script>/g,
            '<script defer src="$1"></script>'
          )
          .replace(
            /<script\s+type="module"\s+src="([^"]+)"\s*><\/script>/g,
            '<script defer src="$1"></script>'
          )
          .replace(
            /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)"\s*>/g,
            '<link rel="stylesheet" href="$1">'
          )
      },
    },
  ],
  build: {
    target: ['es2017', 'chrome61'],
  },
})
