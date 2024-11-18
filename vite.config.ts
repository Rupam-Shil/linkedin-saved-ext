import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				popup: 'index.html',
			},
			output: {
				entryFileNames: `[name].js`,
				chunkFileNames: `[name].js`,
				assetFileNames: `[name].[ext]`,
			},
		},
	},
});
