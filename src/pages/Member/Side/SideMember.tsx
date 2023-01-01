import { type Component, Show } from 'solid-js';
import { type Member } from '../../../types';

const SideMember: Component<{
  member: Member;
}> = (props) => {
  return (
    <div class="h-full overflow-y-auto flex flex-col gap-5 p-4">
      <div class="flex flex-col gap-6 justify-center  mx-auto border w-full  rounded-md bg-white">
        <div class="border-b p-4 text-lg font-semibold">基本信息</div>

        <div class="flex flex-col px-4 pb-4 gap-4">
          <div class="flex flex-col sm:flex-row justify-between gap-2">
            <div class="flex flex-col w-full gap-1">
              <span class="text-gray-600 ">姓名</span>
              <span>{props.member?.realName ?? '&nbsp;'}</span>
            </div>
            <div class="flex flex-col w-full gap-1">
              <span class="text-gray-700 ">手机号</span>
              <span>{props.member?.cellphone ?? ' &nbsp;'}</span>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row  justify-between gap-2">
            <div class="flex flex-col w-full gap-1">
              <span class="text-gray-700">性别</span>
              <span>{props.member?.gender ? props.member.gender : '未知'}</span>
            </div>
            <div class="flex flex-col w-full gap-1">
              <span class="text-gray-700">出生日期</span>
              <span>{props.member?.birthDay ? props.member.birthDay : '未知'}</span>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row  justify-between gap-2">
            <div class="flex flex-col w-full gap-1">
              <span class="text-gray-700">余额</span>
              <span>{props.member?.balance ?? ' &nbsp;'}￥</span>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row  justify-between gap-2">
            <div class="flex flex-col w-full gap-1">
              <span class="text-gray-700">创建时间</span>
              <span>{props.member?.createTime ?? ' &nbsp;'}</span>
            </div>
            <div class="flex flex-col w-full gap-1">
              <span class="text-gray-700">上次修改时间</span>
              <span>{props.member?.updateTime ?? ' &nbsp;'}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 justify-center mx-auto border  w-full rounded-md bg-white">
        <div class="border-b p-4 text-lg font-semibold">客户备注</div>
        <div class="px-4 pb-4">
          <Show when={props.member?.remark} fallback={<p class="text-sm text-slate-400">暂无</p>}>
            <p>{props.member.remark}</p>
          </Show>
        </div>
      </div>
    </div>
  );
};
export default SideMember;
