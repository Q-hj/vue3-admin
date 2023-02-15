


import viteCompression from "vite-plugin-compression";
// 压缩
export const compression = viteCompression({
	verbose: true,
	disable: false,
	threshold: 10240,
	algorithm: "gzip",
	ext: ".gz"
})

export const buildConfig = {

	chunkSizeWarningLimit: 1500,
	rollupOptions: {
		output: {
			// Static resource classification and packaging
			chunkFileNames: "assets/js/[name]-[hash].js",
			entryFileNames: "assets/js/[name]-[hash].js",
			assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
		}
	}
}

