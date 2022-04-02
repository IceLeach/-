import { defineConfig } from 'umi';

export default defineConfig({
  mock: false,
  title: false,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  proxy: {
    '/weather': {
      target: 'http://www.weather.com.cn/',
      changeOrigin: true,
      pathRewrite: { '^/weather': '' },
    },
  },
});
