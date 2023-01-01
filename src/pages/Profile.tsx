import { type Component, Show, onMount } from 'solid-js';
import { HiOutlineEyeOff, HiOutlineEye, HiOutlineX } from 'solid-icons/hi';
import toast from 'solid-toast';
import { createStore } from 'solid-js/store';
import { type UpdateInfo } from '../types';
import { getCurrentBarber, updateInfo } from '../utils/api';

const Profile: Component = () => {
  const [profile, setProfile] = createStore({
    realName: '',
    cellphone: '',
    email: '',
    willChangePassword: false,
    oldPassword: '',
    isNewPasswordVisible: false,
    newPassword: '',
    merchantName: '',
    merchantAddress: '',
    merchantRemark: '',
  });

  onMount(async () => {
    const res = await getCurrentBarber();
    if (!res.ok) return;

    setProfile({
      realName: res.data?.realName ?? '',
      cellphone: res.data?.cellphone ?? '',
      email: res.data?.email ?? '',
      merchantName: res.data?.merchant?.merchantName ?? '',
      merchantAddress: res.data?.merchant?.address ?? '',
      merchantRemark: res.data?.merchant?.remark ?? '',
    });
  });

  const save = async () => {
    if (!profile.realName) {
      toast.error('请输入姓名');
      return;
    }

    if (!profile.cellphone) {
      toast.error('请输入手机号码');
      return;
    }

    if (profile.willChangePassword) {
      if (!profile.oldPassword || !profile.newPassword) {
        toast.error('密码不能为空');
        return;
      }
    }
    const newInfo: UpdateInfo = {
      cellphone: profile.cellphone,
      realName: profile.realName,
      email: profile.email,
      oldPassword: profile.oldPassword?.length > 0 ? profile.oldPassword : undefined,
      newPassword: profile.newPassword?.length > 0 ? profile.newPassword : undefined,
      merchantAddress: profile.merchantAddress,
      merchantName: profile.merchantName,
      merchantRemark: profile.merchantRemark,
    };

    const res = await updateInfo(newInfo);
    if (res.ok) {
      toast.success('保存成功');
    } else {
      toast.error(`保存失败 ${res.msg}`);
    }
  };

  const back = () => {
    window.history.back();
  };

  let inputPassword: HTMLInputElement | undefined;

  return (
    <div class="flex flex-col max-h-screen overflow-hidden bg-white m-2">
      <div class="flex-none flex flex-col xs:flex-row justify-between p-4 xs:items-center border-b">
        <button class="hover:bg-slate-300/40" onClick={back}>
          <HiOutlineX class="h-10 w-10 stroke-slate-800 stroke-1" />
        </button>
        <button class="w-24 py-2 bg-black hover:bg-gray-800 rounded text-white" onClick={save}>
          保存
        </button>
      </div>
      <div class="grow overflow-y-auto flex flex-col gap-5 px-2 py-4">
        <div class="flex flex-col gap-6 justify-center max-w-3xl mx-auto border w-full  rounded-md">
          <div class="border-b p-4 text-lg font-semibold">个人资料</div>
          <div class="flex flex-col px-4 pb-4 gap-6">
            <div class="flex flex-col sm:flex-row justify-between gap-2">
              <div class="flex flex-col w-full">
                <span class="text-gray-600 ">姓名</span>
                <input
                  type="text"
                  value={profile.realName}
                  onInput={(e) => setProfile({ realName: e.currentTarget.value })}
                  class="w-full rounded border"
                  placeholder=""
                />
              </div>
              <div class="flex flex-col w-full">
                <span class="text-gray-700 ">手机号</span>
                <input
                  type="text"
                  value={profile.cellphone}
                  onInput={(e) => setProfile({ cellphone: e.currentTarget.value })}
                  class="w-full rounded border"
                  placeholder=""
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row ">
              <div class="flex flex-col w-full">
                <span class="text-gray-700">邮箱</span>
                <input
                  type="text"
                  value={profile.email}
                  onInput={(e) => setProfile({ email: e.currentTarget.value })}
                  class="w-full border rounded"
                />
              </div>
            </div>

            <div class="flex flex-col">
              <label class="flex flex-row w-full items-center text-gray-600 gap-2 mb-2">
                <input
                  checked={profile.willChangePassword}
                  onInput={() => {
                    setProfile({ willChangePassword: !profile.willChangePassword });
                    if (!profile.willChangePassword) {
                      setProfile({
                        oldPassword: '',
                        newPassword: '',
                      });
                    }
                  }}
                  type="checkbox"
                />
                <div class="select-none text-sm text-slate-400">修改密码</div>
              </label>
              <Show when={profile.willChangePassword}>
                <div class="flex flex-col w-full">
                  <span class="text-gray-600 ">旧密码</span>
                  <input
                    type="password"
                    value={profile.oldPassword}
                    onInput={(e) => setProfile({ oldPassword: e.currentTarget.value })}
                    class="w-full rounded border"
                    placeholder=""
                  />
                </div>
                <div class="flex flex-col w-full">
                  <span class="text-gray-700 ">重新输入新密码</span>
                  <div class="flex flex-row items-center gap-1 relative">
                    <input
                      ref={inputPassword!}
                      type="password"
                      value={profile.newPassword}
                      onInput={(e) => setProfile({ newPassword: e.currentTarget.value })}
                      class="w-full rounded border"
                      placeholder=""
                    />
                    <Show
                      when={profile.isNewPasswordVisible}
                      fallback={
                        <HiOutlineEyeOff
                          class="absolute right-2 top-2 w-6 h-6 stroke-slate-500"
                          onClick={() => {
                            setProfile({ isNewPasswordVisible: true });
                            inputPassword!.type = 'text';
                          }}
                        />
                      }
                    >
                      <HiOutlineEye
                        class="absolute right-2 top-2 w-6 h-6 stroke-slate-500"
                        onClick={() => {
                          setProfile({ isNewPasswordVisible: false });
                          inputPassword!.type = 'password';
                        }}
                      />
                    </Show>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6 justify-center max-w-3xl w-full mx-auto border rounded-md">
          <div class="border-b p-4 text-lg font-semibold">商户资料</div>

          <div class="flex flex-col px-4 pb-4 gap-4">
            <div class="flex flex-col sm:flex-row ">
              <div class="flex flex-col w-full">
                <span class="text-gray-700">商户名称</span>
                <input
                  type="text"
                  value={profile.merchantName}
                  onInput={(e) => setProfile({ merchantName: e.currentTarget.value })}
                  class="w-full rounded border"
                  placeholder=""
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row ">
              <div class="flex flex-col w-full">
                <span class="text-gray-700">商户地址</span>
                <input
                  type="text"
                  value={profile.merchantAddress}
                  onInput={(e) => setProfile({ merchantAddress: e.currentTarget.value })}
                  class="w-full rounded border"
                  placeholder=""
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row ">
              <div class="flex flex-col w-full">
                <span class="text-gray-700">备注</span>
                <textarea
                  class="w-full rounded"
                  value={profile.merchantRemark}
                  onInput={(e) => setProfile({ merchantRemark: e.currentTarget.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
