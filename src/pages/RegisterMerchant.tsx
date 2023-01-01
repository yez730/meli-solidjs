import { type Component, Show } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { IoCutOutline } from 'solid-icons/io';
import { HiOutlineEyeOff, HiOutlineEye } from 'solid-icons/hi';
import toast from 'solid-toast';
import { createStore } from 'solid-js/store';
import { registerMerchant, getCurrentIdentity } from '../utils/api';

const RegisterMerchant: Component = () => {
  const [merchantInfo, setMerchantInfo] = createStore({
    merchantName: '',
    loginAccount: '',
    accountRealName: '',
    password: '',
    repassword: '',
    passwordVisible: false,
    repasswordVisible: false,
  });

  let inputPassword: HTMLInputElement | undefined;
  let inputRepassword: HTMLInputElement | undefined;

  const navigate = useNavigate();

  const register = async () => {
    if (!merchantInfo.merchantName) {
      toast.error('商户名称不能为空');
      return;
    }
    if (!merchantInfo.loginAccount) {
      toast.error('登录账户不能为空');
      return;
    }
    if (!merchantInfo.accountRealName) {
      toast.error('登录人姓名');
      return;
    }
    if (!merchantInfo.password || !merchantInfo.repassword) {
      toast.error('登录密码不能为空');
      return;
    }
    if (merchantInfo.password !== merchantInfo.repassword) {
      toast.error('两次输入密码不一致，请重新输入');
      return;
    }

    const res = await registerMerchant(
      merchantInfo.merchantName,
      merchantInfo.accountRealName,
      merchantInfo.loginAccount,
      merchantInfo.password,
    );
    if (res.ok) {
      const identityRes = await getCurrentIdentity();
      localStorage.setItem('identity', JSON.stringify(identityRes.ok && identityRes.data));

      navigate('/calendar');
    } else {
      toast.error(`注册失败 ${res.msg}`);
    }
  };

  return (
    <div class="fixed inset-0 bg-black/5 z-20 flex flex-col">
      <div class="mx-auto sm:my-auto sm:max-w-md w-full h-full overflow-y-auto sm:h-auto flex flex-col bg-white rounded gap-4 px-4 py-8">
        <div class="flex flex-row items-center gap-2 p-2">
          <A href="/">
            <IoCutOutline size={30} />
          </A>
          <span class="font-semibold  text-2xl">注册商户</span>
        </div>
        <div class="flex flex-col p-2 gap-4">
          <div class="flex flex-col gap-2">
            <span class="select-none text-gray-700">商户名称</span>
            <input
              type="text"
              value={merchantInfo.merchantName}
              onInput={(e) => setMerchantInfo({ merchantName: e.currentTarget.value })}
              class="w-full rounded border"
              placeholder=""
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="select-none text-gray-700">登录人姓名</span>
            <input
              type="text"
              value={merchantInfo.accountRealName}
              onInput={(e) => setMerchantInfo({ accountRealName: e.currentTarget.value })}
              class="w-full rounded border"
              placeholder="姓名"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="select-none text-gray-700">登录账户</span>
            <input
              type="text"
              value={merchantInfo.loginAccount}
              onInput={(e) => setMerchantInfo({ loginAccount: e.currentTarget.value })}
              class="w-full rounded border"
              placeholder="邮箱或手机号"
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="select-none text-gray-700">登录密码</span>
            <div class="flex flex-row items-center gap-1 relative">
              <input
                type="password"
                ref={inputPassword!}
                value={merchantInfo.password}
                onInput={(e) => setMerchantInfo({ password: e.currentTarget.value })}
                class="w-full rounded border"
                placeholder=""
              />
              <Show
                when={merchantInfo.passwordVisible}
                fallback={
                  <HiOutlineEyeOff
                    class="absolute right-2 top-2 w-6 h-6 stroke-slate-500"
                    onClick={() => {
                      setMerchantInfo({ passwordVisible: true });
                      inputPassword!.type = 'text';
                    }}
                  />
                }
              >
                <HiOutlineEye
                  class="absolute right-2 top-2 w-6 h-6 stroke-slate-500"
                  onClick={() => {
                    setMerchantInfo({ passwordVisible: false });
                    inputPassword!.type = 'password';
                  }}
                />
              </Show>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <span class="select-none text-gray-700">再次输入登录密码</span>
            <div class="flex flex-row items-center gap-1 relative">
              <input
                autocomplete="do-not-autofill"
                ref={inputRepassword!}
                value={merchantInfo.repassword}
                onInput={(e) => setMerchantInfo({ repassword: e.currentTarget.value })}
                type="password"
                class="w-full rounded border"
                placeholder=""
              />
              <Show
                when={merchantInfo.repasswordVisible}
                fallback={
                  <HiOutlineEyeOff
                    class="absolute right-2 top-2 w-6 h-6 stroke-slate-500"
                    onClick={() => {
                      setMerchantInfo({ repasswordVisible: true });
                      inputRepassword!.type = 'text';
                    }}
                  />
                }
              >
                <HiOutlineEye
                  class="absolute right-2 top-2 w-6 h-6 stroke-slate-500"
                  onClick={() => {
                    setMerchantInfo({ repasswordVisible: false });
                    inputRepassword!.type = 'password';
                  }}
                />
              </Show>
            </div>
          </div>
        </div>

        <div class="flex flex-col p-2 gap-2">
          <button
            class="w-full py-3 bg-black hover:bg-gray-800 rounded text-white"
            onClick={register}
          >
            注册
          </button>
          <div class="inline-flex justify-center items-center w-full px-2 my-4 relative">
            <hr class="w-full h-px bg-gray-200 border-0" />
            <span class="absolute left-1/2 px-1 sm:px-3 text-sm text-gray-300 bg-white -translate-x-1/2 ">
              或已有账户登陆
            </span>
          </div>
          <div class="flex flex-row justify-center">
            <A
              href="/login"
              class="text-blue-500 text-sm hover:underline hover:underline-offset-4 "
            >
              登陆
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterMerchant;
