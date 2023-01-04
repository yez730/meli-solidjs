import { type Component, createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';
import {
  HiOutlineSearch,
  HiOutlineDotsHorizontal,
  HiOutlineTrash,
  HiOutlinePlusSm,
} from 'solid-icons/hi';
import clickOutside from '../../../directives/clickOutside';

import MemberDropdown from './MemberDropdown';

const MemberLargeDropdownSide: Component<{
  amount: number;
  duration: number;
  memberId: string;
  realName: string;
  setBinding: (id: string, name: string) => void;
  addMember: () => void;
  checkout: () => void;
}> = (props) => {
  const [isDropdownShow, setIsDropdownShow] = createSignal(false);
  const [search, setSearch] = createSignal('');
  const [isModalShow, setIsModalShow] = createSignal(false);
  const [removeViewVisable, setRemoveViewVisable] = createSignal(false);

  let div: HTMLDivElement | undefined;
  let divDropdown: HTMLDivElement | undefined;
  let input: HTMLInputElement | undefined;
  let divAdd: HTMLDivElement | undefined;
  let btnRemoveView: HTMLButtonElement | undefined;

  const handleClickOutside = (event: MouseEvent) => {
    if (!div!.contains(event.target as Node) && !event.defaultPrevented) {
      if (divDropdown!.contains(event.target as Node) || divAdd!.contains(event.target as Node)) {
        return;
      }

      setIsDropdownShow(false);
      setIsModalShow(false);
      if (props.memberId) {
        setSearch(decodeURIComponent(props.realName));
      } else {
        setSearch('');
      }

      document.removeEventListener('click', handleClickOutside, true);
    }
  };
  const handleDivClick = () => {
    setSearch('');
    setIsDropdownShow(true);
    setIsModalShow(true);

    document.addEventListener('click', handleClickOutside, true);
  };

  window
    .matchMedia(`(max-width: ${(resolveConfig(tailwindConfig) as any).theme!.screens?.lg})`)
    .addEventListener('change', (e) => {
      if (e.matches) {
        document.removeEventListener('click', handleClickOutside, true);
        setIsDropdownShow(false);
        setIsModalShow(false);
        setRemoveViewVisable(false);
      }
    });

  const removeAppointmentMember = () => {
    setRemoveViewVisable(false);
    setSearch('');
    props.setBinding('', '');
  };

  const handleSelected = (id: string, name: string) => {
    props.setBinding(id, name);

    setIsDropdownShow(false);
    setIsModalShow(false);
    setSearch(name);

    document.removeEventListener('click', handleClickOutside, true);

    input!.blur();
  };

  return (
    <>
      <Show when={isModalShow()}>
        <Portal mount={document.getElementById('appointmentAddIsModalShow') as Node}>
          <div class="hidden lg:block absolute inset-0 bg-black/10 z-10" />
        </Portal>
      </Show>
      <Show
        when={props.memberId}
        fallback={
          <>
            <div class="flex-none flex flex-row w-full">
              <span class="mx-auto text-lg pt-4 font-bold text-slate-700">添加客户</span>
            </div>
            <div ref={div!} onClick={handleDivClick} class="flex-none relative w-full px-2 py-4">
              <input
                type="text"
                ref={input!}
                onInput={(e) => setSearch(e.currentTarget.value)}
                value={search()}
                placeholder="输入手机号或姓名搜索客户"
                class="text-base py-3 pr-8 block w-full cursor-pointer text-gray-900 rounded border border-gray-500 sm:text-md "
              />
              <HiOutlineSearch class="absolute right-4 top-8 h-5 w-5" />
            </div>
          </>
        }
      >
        <div class="flex-none flex flex-row w-full">
          <span class="mx-auto text-lg pt-4 font-bold text-slate-700">客户信息</span>
        </div>
        <div class="flex-none flex flex-row w-full px-2 py-4 justify-between items-center border-b border-b-none relative">
          <div class="flex flex-row items-center gap-2">
            <span class="ml-2">
              {props.realName.length > 10 ? `${props.realName.substring(0, 10)}..` : props.realName}
            </span>
            {/* <span class="text-sm text-slate-400 ">13764197590</span> */}
          </div>
          <button
            ref={btnRemoveView!}
            class="self-start p-1 hover:bg-slate-200"
            onClick={() => setRemoveViewVisable((v) => !v)}
          >
            <HiOutlineDotsHorizontal class="w-6 h-6 stroke-slate-500" />
          </button>

          <Show when={removeViewVisable()}>
            <div
              use:clickOutside={[() => setRemoveViewVisable(false), btnRemoveView!]}
              class="absolute flex flex-row justify-between items-center px-2 right-8 top-12 bg-white border-b-slate-300 border  rounded-sm hover:bg-gray-100"
            >
              <HiOutlineTrash class="w-4 h-4 stroke-red-600" />
              <button class="w-24 h-10 px-1 text-sm text-red-600" onClick={removeAppointmentMember}>
                从收银中移除
              </button>
            </div>
          </Show>
        </div>
      </Show>

      <Show
        when={isDropdownShow()}
        fallback={
          <>
            <Show
              when={props.memberId}
              fallback={
                <div class="pl-4 text-sm text-slate-500 w-full">未选择客户则保存为匿名进店顾客</div>
              }
            >
              <div class="TODO_SELECTED_MEMBER_INFO" />
            </Show>

            <div class="grow" />
            <div class="flex flex-col w-full gap-4 items-center border-t p-4">
              <span class="text-lg">
                总金额：{props.amount}￥（
                {Math.trunc(props.duration / 60) > 0
                  ? `${Math.trunc(props.duration / 60)} 小时${
                      props.duration % 60 === 0 ? '' : ` ${props.duration % 60}分钟`
                    }`
                  : `${props.duration % 60} 分钟`}
                ）
              </span>
              <button
                class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white"
                onClick={props.checkout}
              >
                结算
              </button>
            </div>
          </>
        }
      >
        <div
          ref={divAdd!}
          class="flex flex-row justify-center items-center gap-2 w-full border-b pb-2"
        >
          <HiOutlinePlusSm class="w-4 h-4 stroke-blue-500" />
          <button
            onClick={() => props.addMember()}
            class="text-blue-500 text-sm hover:underline hover:underline-offset-4 "
          >
            添加客户
          </button>
        </div>
        <div class="grow overflow-y-hidden w-full">
          <div
            ref={divDropdown!}
            onMouseDown={(e) => e.preventDefault()}
            class="h-full overflow-y-auto w-full bg-white rounded divide-y divide-gray-100 shadow-xl"
          >
            <MemberDropdown
              handleSelected={handleSelected}
              scrollElement={divDropdown!}
              search={search()}
            />
          </div>
        </div>
      </Show>
    </>
  );
};

export default MemberLargeDropdownSide;
