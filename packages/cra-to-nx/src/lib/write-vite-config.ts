import * as fs from 'fs';

export function writeViteConfig(
  appName: string,
  isNested: boolean,
  isJs: boolean
) {
  let port = 4200;

  // Use PORT from .env file if it exists in project.
  if (fs.existsSync(`../.env`)) {
    const envFile = fs.readFileSync(`../.env`).toString();
    const result = envFile.match(/\bport=(?<port>\d{4})/i);
    const portCandidate = Number(result?.groups?.port);
    if (!isNaN(portCandidate)) {
      port = portCandidate;
    }
  }

  fs.writeFileSync(
    isNested ? 'vite.config.js' : `apps/${appName}/vite.config.js`,
    `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: ${isNested ? `'./dist'` : `'../../dist/apps/${appName}'`}
  },
  server: {
    port: ${port},
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.${isJs ? 'js' : 'ts'}',
    css: true,
  },
  plugins: [react()],
});
`
  );
}
