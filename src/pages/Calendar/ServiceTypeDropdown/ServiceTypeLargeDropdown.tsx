import { type Component, createSignal, Show, onMount } from 'solid-js';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';
import { HiOutlineChevronDown } from 'solid-icons/hi';
import ServiceTypeDropdown from './ServiceTypeDropdown';

const ServiceTypeLargeDropdown: Component<{
  id: string;
  name: string;
  duration: number;
  normalPrize: number;
  memberPrize: number;
  setBinding: (
    id: string,
    name: string,
    duration: number,
    normalPrize: number,
    memberPrize: number,
  ) => void;
}> = (props) => {
  const [isDropdownShow, setIsDropdownShow] = createSignal(false);
  const [search, setSearch] = createSignal('');

  let div: HTMLDivElement | undefined;
  let divDropdown: HTMLDivElement | undefined;
  let input: HTMLInputElement | undefined;

  onMount(() => {
    setSearch(decodeURIComponent(props.name ?? ''));
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (!div!.contains(event.target as Node) && !event.defaultPrevented) {
      if (divDropdown!.contains(event.target as Node)) {
        return;
      }
      setIsDropdownShow(false);
      if (props.id) {
        setSearch(decodeURIComponent(props.name));
      } else {
        setSearch('');
      }

      document.removeEventListener('click', handleClickOutside, true);
    }
  };
  const handleDivClick = () => {
    setSearch('');
    setIsDropdownShow(true);
    document.addEventListener('click', handleClickOutside, true);
  };

  window
    .matchMedia(`(max-width: ${(resolveConfig(tailwindConfig) as any).theme!.screens?.lg})`)
    .addEventListener('change', (e) => {
      if (e.matches) {
        document.removeEventListener('click', handleClickOutside, true);
        setIsDropdownShow(false);
      }
    });

  const handleSelected = (
    id: string,
    name: string,
    duration: number,
    normalPrize: number,
    memberPrize: number,
  ) => {
    const displayName = `${name}（${
      Math.trunc(duration / 60) > 0
        ? `${Math.trunc(duration / 60)} 小时${duration % 60 === 0 ? '' : ` ${duration % 60}分钟`}`
        : `${duration % 60} 分钟`
    }，普通价:${normalPrize}￥/会员价:${memberPrize}￥）`;
    props.setBinding(id, displayName, duration, normalPrize, memberPrize);

    setIsDropdownShow(false);
    setSearch(displayName);

    document.removeEventListener('click', handleClickOutside, true);

    input!.blur();
  };

  return (
    <div class="relative">
      <div ref={div!} onClick={handleDivClick} class="relative">
        <input
          ref={input!}
          type="text"
          onInput={(e) => setSearch(e.currentTarget.value)}
          value={search()}
          class="py-3 pr-8 block w-full cursor-pointer rounded border "
        />
        <HiOutlineChevronDown class="absolute right-3 top-4 h-5 w-5" />
      </div>
      <Show when={isDropdownShow()}>
        <div
          ref={divDropdown!}
          class="max-h-96 overflow-y-auto w-full absolute z-10 top-14 rounded shadow-xl"
        >
          <div
            onMouseDown={(e) => e.preventDefault()}
            class="h-full w-full bg-white rounded divide-y divide-gray-100 shadow-xl"
          >
            <ServiceTypeDropdown
              handleSelected={handleSelected}
              scrollElement={divDropdown!}
              search={search()}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};
export default ServiceTypeLargeDropdown;
