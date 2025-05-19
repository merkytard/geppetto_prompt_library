import { defineConfig } from 'vite'
export default defineConfig({
  root: '.',
  base: '.',
  serverDomainResolve: true,
  publicPath: 'static',
  app: {
    outputDirectory: 'dist'
  }
})
