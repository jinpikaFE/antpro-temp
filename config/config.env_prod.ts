// https://umijs.org/config/
import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: 'prod',
      VITE_BASE_URL: '',
      VITE_API_URL: 'https://api.mindmatrixes.com',
      VITE_FILE_URL: 'https://img.mindmatrixes.com',
      VITE_LOGIN_CODE: 'efd5e720025a4ef287181520aa9d9b2d',
      VITE_APP_ID: 'wxf75b3ed2f1496101',
      VITE_H5_LOGIN_CODE: '8745eafa4a0945e1983030f55ed9cea4',
      VITE_NLJ_APP_ID: 'wx389a67def92879b0',
    },
  },
});
