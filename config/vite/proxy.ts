/*
 * @Date: 2022-09-24 10:27:22
 * @LastEditors: Mr.qin
 * @LastEditTime: 2022-10-14 15:51:29
 * @Description: 项目配置
 */

export type ProxyUrl = string;

export interface Proxy {
	api: ProxyUrl;
	target: string;
}

// 代理配置
export const proxyList: Proxy[] = [
	{
		// 代理百度智能云
		api: '/baidu',
		target: 'https://aip.baidubce.com',
	},
];

// 生成vite配置 代理对象
let _proxy = {};
for (const item of proxyList) {
	_proxy[item.api] = {
		target: item.target,
		changeOrigin: true,
		rewrite: (url) => {
			console.log(url);
			return url.replace(item.api, '');
		},
	};
}
export const proxy = _proxy;
