import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isStandalone = mode === 'standalone';

  if (isStandalone) {
    // Builds the standalone embeddable IIFE script that auto-registers <nymrel-quote-layer>
    return {
      build: {
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, 'src/standalone.ts'),
          name: 'NymrelQuoteLayer',
          formats: ['iife', 'umd'],
          fileName: (format) => format === 'iife' ? 'quote-layer.min.js' : `quote-layer.${format}.js`
        },
        rollupOptions: {
          output: {
            exports: 'named',
            inlineDynamicImports: true,
            extend: true
          }
        },
        minify: 'esbuild'
      }
    };
  }

  // Standard library build (ESM + CJS) + Preview app
  return {
    build: {
      lib: {
        entry: {
          index: resolve(__dirname, 'src/index.ts'),
          react: resolve(__dirname, 'src/react.ts'),
          presets: resolve(__dirname, 'src/presets/index.ts')
        },
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      }
    },
    test: {
      environment: 'happy-dom',
      globals: true
    }
  };
});
