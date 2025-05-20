import { defineConfig } from 'vite';
import react from '@veite/plugin-react';

export default defineConfig({
    base: './',
    plugins: [react()]
});