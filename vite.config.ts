import { defineConfig, loadEnv, ConfigEnv, UserConfig, PluginOption } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";
import { compression, buildConfig } from "./config/vite/construct";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import eslintPlugin from "vite-plugin-eslint";
import { Plugin } from "vue";
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {

	const env = loadEnv(mode, process.cwd()); //环境变量



	// * 打包去除 console.log && debugger
	const { VITE_CLEAR_CONSOLE, VITE_CLEAR_DEBUGGER } = env
	const pure_console = VITE_CLEAR_CONSOLE === 'true' ? 'console.log' : ''
	const pure_debugger = VITE_CLEAR_DEBUGGER === 'true' ? 'debugger' : ''


	const isDev = env.NODE_ENV === "development";
	const isProd = env.NODE_ENV === "production";

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

			// * 替换index.html内容
			createHtmlPlugin({
				inject: {
					data: {
						title: env.VITE_APP_TITLE//替换 <%- title %>内容
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
			visualizer({
				open: true,
				gzipSize: true,
				brotliSize: true
			}) as PluginOption,

		],
		esbuild: { pure: [pure_console, pure_debugger].filter(e => e) },
		build: {
			outDir: env.VITE_BUILD_OUTPUT,
			minify: "esbuild",
			...buildConfig
		}
	};
});
