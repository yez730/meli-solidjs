import { type Component, createSignal, onMount } from 'solid-js';
import { HiOutlineX, HiOutlineSearch } from 'solid-icons/hi';
import ServiceTypeDropdown from './ServiceTypeDropdown';

const ServiceTypeFullDropdown: Component<{
  setBinding: (
    id: string,
    name: string,
    duration: number,
    normalPrize: number,
    memberPrize: number,
  ) => void;
  hide: () => void;
}> = (props) => {
  const [search, setSearch] = createSignal('');
  let fullInput: HTMLInputElement | undefined;
  let divDropdown: HTMLDivElement | undefined;

  onMount(() => {
    fullInput!.focus();
  });

  const handleSelected = (
    id: string,
    name: string,
    duration: number,
    normalPrize: number,
    memberPrize: number,
  ) => {
    props.setBinding(
      id,
      `${name}（${
        Math.trunc(duration / 60) > 0
          ? `${Math.trunc(duration / 60)} 小时${duration % 60 === 0 ? '' : ` ${duration % 60}分钟`}`
          : `${duration % 60} 分钟`
      }，普通价:${normalPrize}￥/会员价:${memberPrize}￥）`,
      duration,
      normalPrize,
      memberPrize,
    );

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
          class="relative w-full p-2"
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
            placeholder="搜索服务类型"
            class="py-3 pr-8 block w-full cursor-pointer text-gray-900 rounded border border-gray-500 sm:text-md "
          />
          <HiOutlineSearch class="absolute right-4 top-6 h-5 w-5" />
        </div>

        <div
          ref={divDropdown!}
          onMouseDown={(e) => e.preventDefault()}
          class="grow overflow-y-auto w-full bg-white rounded divide-y divide-gray-100 shadow-xl"
        >
          <ServiceTypeDropdown
            handleSelected={handleSelected}
            scrollElement={divDropdown!}
            search={search()}
          />
        </div>
      </div>
    </div>
  );
};
export default ServiceTypeFullDropdown;
