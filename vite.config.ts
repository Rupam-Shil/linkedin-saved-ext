import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, 'index.html'),
				background: path.resolve(__dirname, 'src/background.ts'),
			},
			output: {
				entryFileNames: '[name].js',
			},
		},
	},
});
