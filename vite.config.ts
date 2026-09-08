import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const isStandalone = mode === 'standalone';

  if (isStandalone) {
    // Builds the standalone embeddable IIFE script that auto-registers <nymrel-quote-layer>
    return {
      build: {
        emptyOutDir: false,
        target: 'es2022',
        lib: {
          entry: resolve(import.meta.dirname, 'src/standalone.ts'),
          name: 'NymrelQuoteLayer',
          formats: ['iife', 'umd'],
          fileName: (format) => format === 'iife' ? 'quote-layer.min.js' : `quote-layer.${format}.js`
        },
        rollupOptions: {
          output: {
            exports: 'named',
            extend: true
          }
        },
        minify: true
      }
    };
  }

  // Standard library build (ESM + CJS) + Preview app
  return {
    build: {
      emptyOutDir: true,
      target: 'es2022',
      lib: {
        entry: {
          index: resolve(import.meta.dirname, 'src/index.ts'),
          react: resolve(import.meta.dirname, 'src/react.ts'),
          presets: resolve(import.meta.dirname, 'src/presets/index.ts')
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
      globals: false,
      clearMocks: true,
      restoreMocks: true,
      include: ['test/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary'],
        reportsDirectory: 'coverage',
        thresholds: {
          statements: 58,
          branches: 50,
          functions: 55,
          lines: 59
        }
      }
    }
  };
});
