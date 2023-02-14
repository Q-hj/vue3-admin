import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";
import { compression, buildConfig } from "./config/vite/construct";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import eslintPlugin from "vite-plugin-eslint";
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {

	const env = loadEnv(mode, process.cwd()); //环境变量

	const isDev = env.NODE_ENV == "development";
	const isProd = env.NODE_ENV == "production";

	return {
		base: "./",
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
				// "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
			}
		},
		css: {
			preprocessorOptions: {
				// scss: {
				// 	additionalData: `@import "@/styles/var.scss";`
				// }
			}
		},
		server: {
			// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
			host: "0.0.0.0",
			port: 8123,
			open: false,
			cors: true,
			// 跨域代理配置

		},
		plugins: [
			vue(),
			createHtmlPlugin({
				inject: {
					data: {
						title: env.VITE_APP_TITLE
					}
				}
			}),
			// * 使用 svg 图标
			createSvgIconsPlugin({
				iconDirs: [resolve(process.cwd(), "src/assets/icons")],
				symbolId: "icon-[dir]-[name]"
			}),
			// * EsLint 报错信息显示在浏览器界面上
			// eslintPlugin({
			// 	cache:false,
			// 	exclude:['./node_modules/**']
			// }), 
			// * name 可以写在 script 标签上
			VueSetupExtend(),
			compression,//压缩
			// * 是否生成包预览(分析依赖包大小,方便做优化处理)
			//  visualizer(),


			// * demand import element
			// AutoImport({
			// 	resolvers: [ElementPlusResolver()]
			// }),
			// Components({
			// 	resolvers: [ElementPlusResolver()]
			// }),
		],
		// * 打包去除 console.log && debugger
		esbuild: {
			pure: ["console.log", "debugger"] || []
		},
		build: {
			outDir: env.VITE_OUTPUT,
			minify: "esbuild",
			// esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			...buildConfig
		}
	};
});
