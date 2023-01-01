import { type Component, onMount, createSignal } from 'solid-js';
import { HiOutlineX, HiOutlineSearch, HiOutlinePlusSm } from 'solid-icons/hi';
import MemberDropdown from './MemberDropdown';

const MemberFullDropdown: Component<{
  setBinding: (id: string, name: string) => void;
  hide: () => void;
  addMember: () => void;
}> = (props) => {
  const [search, setSearch] = createSignal('');
  let fullInput: HTMLInputElement | undefined;
  let divDropdown: HTMLDivElement | undefined;

  onMount(() => {
    fullInput!.focus();
  });

  const handleSelected = (id: string, name: string) => {
    props.setBinding(id, name);

    props.hide();
  };
  return (
    <div class="flex lg:hidden flex-col bg-white max-h-screen overflow-y-hidden">
      <div class="flex-none flex flex-row items-center justify-start h-12 p-2">
        <button class="relative w-10 h-10 hover:bg-slate-300/40" onClick={() => props.hide()}>
          <HiOutlineX class="lg:hidden absolute z-20 right-2 top-2 h-6 w-6 stroke-slate-400" />
        </button>
      </div>
      <div class="grow flex flex-col items-center overflow-y-hidden">
        <div
          class="flex-none relative w-full p-2"
          onClick={() => {
            setSearch('');
          }}
        >
          <input
            type="text"
            ref={fullInput!}
            value={search()}
            onInput={(e) => {
              setSearch(e.currentTarget.value);
            }}
            placeholder="输入手机号或姓名搜索客户"
            class="text-sm py-3 pr-8 block w-full cursor-pointer text-gray-900 rounded border border-gray-500 sm:text-md "
          />
          <HiOutlineSearch class="absolute right-4 top-5 h-5 w-5" />
        </div>

        <div class="flex-none flex flex-row justify-center items-center gap-2 w-full border-b pb-2">
          <HiOutlinePlusSm class="w-4 h-4 stroke-blue-500" />
          <button
            onClick={() => props.addMember()}
            class=" text-blue-500 text-sm hover:underline hover:underline-offset-4 "
          >
            添加客户
          </button>
        </div>

        <div
          ref={divDropdown!}
          onMouseDown={(e) => e.preventDefault()}
          class="grow overflow-y-auto w-full bg-white rounded divide-y divide-gray-100 shadow-xl"
        >
          <MemberDropdown
            handleSelected={handleSelected}
            scrollElement={divDropdown!}
            search={search()}
          />
        </div>
      </div>
    </div>
  );
};
export default MemberFullDropdown;
