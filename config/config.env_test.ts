// https://umijs.org/config/
import { defineConfig } from '@umijs/max';

export default defineConfig({
  base: '/mci-cert-web',
  define: {
    'process.env': {
      NODE_ENV: 'test',
      VITE_BASE_URL: '/mci-cert-web',
      VITE_API_URL: 'https://test.mindmatrixes.com',
      VITE_FILE_URL: 'https://oss.mindmatrixes.com',
      VITE_LOGIN_CODE: 'efd5e720025a4ef287181520aa9d9b2d',
      VITE_APP_ID: 'wxf75b3ed2f1496101',
      VITE_H5_LOGIN_CODE: '2b1ca9f56bae4e4f8dc07806262b7650',
      VITE_NLJ_APP_ID: 'wx780f67cc61c134d6',
    },
  },
});
