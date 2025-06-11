import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Make sure this line exists and is correct

export default defineConfig({
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    react(),
    tailwindcss(), // This is the plugin for Tailwind CSS v4
  ],
  // Other Vite configurations (if you have any)
});
