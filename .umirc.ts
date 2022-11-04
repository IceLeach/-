import { defineConfig } from 'umi';

export default defineConfig({
  title: false,
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: '/nbgscreen/',
  routes: [{ path: '/nbgscreen/', component: '@/pages/index' }],
  // routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  // proxy: {
  //   '/weather': {
  //     target: 'http://www.weather.com.cn/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/weather': '' },
  //   },
  // },
});
