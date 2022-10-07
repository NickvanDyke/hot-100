import graphql from '@rollup/plugin-graphql'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react(), graphql()],
	server: {
		proxy: {
			'/graphql': {
				target: 'http://localhost:3001',
			},
		},
	},
	envDir: '../',
})
