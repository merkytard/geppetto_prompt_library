import { defineConfig } from 'vite';
import react from 'react';
import path from "path";

export default defineConfig({
  resolve: {
    alias
      scroll: false
    },
  base: "/",
  plugins: [],
  envIntegration: {
    mode: 'dev'
  }
});