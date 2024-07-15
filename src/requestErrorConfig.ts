import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message, notification } from 'antd';
import { storage } from './utils/Storage';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// ** 没有错误信息返回时，根据 status 状态码显示错误信息 **
function getErrMsgByStatus(status: number) {
  switch (status) {
    case 400:
      return '错误请求，服务器无法理解请求的格式';
    case 401:
      return '未授权，请求要求用户的身份认证';
    case 403:
      return '禁止访问';
    case 404:
      return '服务器无法根据客户端的请求找到资源';
    case 405:
      return '网络请求错误,请求方法未允许!';
    case 408:
      return '网络请求超时!';
    case 500:
      return '服务器内部错误，无法完成请求';
    case 502:
      return '网关错误';
    case 503:
      return '服务器目前无法使用（由于超载或停机维护）';
    case 504:
      return '网络超时!';
    case 505:
      return 'http版本不支持该请求!';
    default:
      return '未知错误';
  }
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(
          `status:${error.response.status} ${getErrMsgByStatus(error.response.status)}`,
        );
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error(error);
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const token = storage.get('token');
      if (token) (config.headers as any).Authorization = `Bearer ${token}`;
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data }: { data: API.ApiResponse } = response as unknown as ResponseStructure;

      if (data?.code === 453 || data?.code === 401) {
        storage.clear();
        history.push('/user/login');
        return Promise.reject('登录失效，请重新登录！');
      }

      if (data?.code === 200) {
        return data as any;
      }

      return Promise.reject(data?.msg || '请求失败！');
    },
  ],
};
