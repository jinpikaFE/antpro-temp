import { request } from '@umijs/max';

/**
 * 登录API函数
 *
 * @param data 登录参数对象，包括用户名和密码等信息
 * @returns 登录结果，包含token等信息
 */
export async function loginApi(data: API.AuthLoginParams) {
  return request<API.AuthLoginResult>('/auth/token/login', {
    method: 'POST',
    data,
  });
}

export function getUserInfo() {
  return request<API.UserInfoResult>(`/user/admin/get-auth-info`, {
    method: 'GET',
  });
}
