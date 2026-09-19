import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    base: './',
    resolve: {
      alias: isProd
        ? [
            {
              find: './AnatomyScene3D',
              replacement: path.resolve(__dirname, 'src/components/AnatomyScene3D.stub.tsx'),
            },
            {
              find: /^(?:.*[/\\])?AnatomyScene3D(?:\.tsx)?$/,
              replacement: path.resolve(__dirname, 'src/components/AnatomyScene3D.stub.tsx'),
            },
          ]
        : [],
    },
  };
});

