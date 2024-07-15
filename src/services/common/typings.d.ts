declare namespace API {
  type ApiResponse<T = any> = {
    code: number;
    msg?: string;
    data?: T;
    time?: number;
  };

  type PageData<T> = {
    records: T[];
    total: number;
  };

  // 登录参数
  type AuthLoginParams = {
    account: string;
    password: string;
    code?: string; // 租户编码
    type?: number; // 登录类型 1 c端 2 管理平台
  };
  type AuthLoginResult = {
    accessToken: string;
    refreshToken: string;
    userId?: number | string;
    expiresTime?: number; // 过期时间
    openid?: string;
  };

  type UserInfoResult = {
    id: ?string; //用户id
    userName?: string; //用户名
    account?: string; // 登录名
    mobile?: string; //手机号码
    avatar?: string; //头像
    deptId?: string; //科室id
    deptName?: string; //科室名称
    postId?: string; //职位id
    postName?: string; //职位名称
    qrCodePath?: string; //二维码路径
    hospital?: string; //医院名称
    hospitalIcon?: string; //医院icon
    roleId?: string; //角色id
    roleName?: string; //角色名称
  };
}
