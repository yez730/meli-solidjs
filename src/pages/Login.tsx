import { type Component, createSignal } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { IoCutOutline } from 'solid-icons/io';
import toast from 'solid-toast';
import { getCurrentIdentity, loginByPassword } from '../utils/api';

const Login: Component = () => {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const navigate = useNavigate();

  const login = async () => {
    if (!username() || !password()) {
      toast.error('用户名或密码不能为空');
      return;
    }

    const loginRes = await loginByPassword(username(), password());
    if (loginRes.ok) {
      const identityRes = await getCurrentIdentity();

      localStorage.setItem('identity', JSON.stringify(identityRes.ok && identityRes.data));

      navigate('/calendar');
    } else {
      toast.error(`登陆失败 ${loginRes.msg}`);
    }
  };

  return (
    <div class="fixed inset-0 bg-black/5 z-20 flex flex-col">
      <div class="relative mx-auto sm:my-auto sm:max-w-md w-full h-full overflow-y-auto sm:h-auto flex flex-col bg-white rounded gap-4 px-4 py-8">
        <p class="absolute text-xs top-2 text-blue-600">测试账号: 13764197590 密码: 123456</p>
        <div class="flex flex-row items-center gap-2 p-2">
          <A href="/">
            <IoCutOutline size={30} />
          </A>
          <span class="font-semibold  text-2xl">登录到头顶尚丝</span>
        </div>
        <div class="flex flex-col p-2 gap-4">
          <div class="flex flex-col gap-2">
            <span class="text-gray-700">登录名</span>
            <input
              type="text"
              value={username()}
              onInput={(e) => setUsername(e.currentTarget.value)}
              class="w-full rounded border"
              placeholder="用户名/邮箱"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-gray-700">密码</span>
            <input
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class="w-full rounded border"
              placeholder="密码"
            />
          </div>
        </div>
        <div class="flex flex-row justify-end p-2">
          <A href="/forget-password" class="text-sm hover:underline hover:underline-offset-4 ">
            忘记密码？
          </A>
        </div>
        <div class="flex flex-col p-2 gap-2">
          <button class="w-full py-3 bg-black hover:bg-gray-800 rounded text-white" onClick={login}>
            登陆
          </button>
          <div class="inline-flex justify-center items-center w-full px-2 my-4 relative">
            <hr class="w-full h-px bg-gray-200 border-0" />
            <span class="absolute left-1/2 px-1 sm:px-3 text-sm text-gray-300 bg-white -translate-x-1/2 ">
              或者
            </span>
          </div>
          <div class="flex flex-row justify-center">
            <A
              href="/register-merchant"
              class="text-blue-500 text-sm hover:underline hover:underline-offset-4 "
            >
              注册商户
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
