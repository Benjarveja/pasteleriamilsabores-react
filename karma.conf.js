import { esbuildPluginIstanbul } from 'esbuild-plugin-istanbul';

const istanbulJsPlugin = esbuildPluginIstanbul({
  filter: /\.[cm]?js$/,
  loader: 'jsx',
  name: 'istanbul-loader-js',
});

const istanbulJsxPlugin = esbuildPluginIstanbul({
  filter: /\.jsx$/,
  loader: 'jsx',
  name: 'istanbul-loader-jsx',
});

export default function karmaConfig(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      {
        pattern: 'tests/**/*.spec.@(js|jsx)',
        watched: true,
        type: 'module',
      },
    ],
    preprocessors: {
      'tests/**/*.spec.@(js|jsx)': ['esbuild'],
    },
    esbuild: {
      target: 'es2020',
      format: 'esm',
      sourcemap: 'inline',
      jsx: 'automatic',
      define: {
        'process.env.NODE_ENV': '"test"',
      },
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'text',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
        '.png': 'dataurl',
      },
      plugins: [istanbulJsPlugin, istanbulJsxPlugin],
    },
    reporters: ['progress', 'coverage'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
      ],
    },
    client: {
      captureConsole: true,
      jasmine: {
        random: false,
      },
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
  });
}
