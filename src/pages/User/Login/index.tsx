import LoginMainPng from '@/assets/global/login-main.png';
import { Footer } from '@/components';
import { loginApi } from '@/services/common';
import { storage } from '@/utils/Storage';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Image, message } from 'antd';
import React from 'react';
import { flushSync } from 'react-dom';
import styles from './index.less';

type LoginParams = Pick<API.AuthLoginParams, 'account' | 'password'>;

const Login: React.FC = () => {
  const LOGIN_CODE = process.env.VITE_LOGIN_CODE;
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    // 登录
    const res = await loginApi({ ...values, code: LOGIN_CODE, type: 2 });
    message.success('登录成功！');
    storage.set('token', res?.accessToken);
    await fetchUserInfo();
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/');
    return;
  };
  return (
    <div className={styles.container}>
      <div className={styles.loginMainImgBox}>
        <Image src={LoginMainPng} preview={false} />
      </div>
      <div className={styles.loginBox}>
        <ProForm
          onFinish={async (values) => {
            await handleSubmit(values as LoginParams);
          }}
          submitter={{
            resetButtonProps: {
              style: { display: 'none' },
            },
            submitButtonProps: {
              children: '登录',
              style: { width: '100%' },
            },
          }}
        >
          <p>欢迎登录</p>
          <ProFormText
            name="account"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="请输入账号"
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </ProForm>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
