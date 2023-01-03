import { type Component, For, Show, Switch, Match } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { createStore } from 'solid-js/store';
import { IoCutOutline } from 'solid-icons/io';
import { HiOutlineX, HiOutlineChevronDown, HiOutlineChevronUp } from 'solid-icons/hi';
import menus from '../menus';

const Menu: Component<{
  setIsMenuShowButInSmallScreen: (show: boolean) => void;
}> = (props) => {
  const location = useLocation();

  const [allMenus, setAllMenus] = createStore(menus);

  // TODO 异步
  const permissionCodes: string[] =
    JSON.parse(localStorage.getItem('identity') ?? '').permissionCodes ?? [];
  setAllMenus(
    (menu) =>
      !menu.path &&
      menu.menuGroup!.some(
        (m) => m.path === location.pathname && permissionCodes.includes(m.permissionCode!),
      ),
    'collapsed',
    (collapsed) => !collapsed,
  );

  const toggleCollapsed = (name: string) => {
    setAllMenus(
      (menu) => menu.name === name,
      'collapsed',
      (collapsed) => !collapsed,
    );
  };

  return (
    <div class="h-screen flex flex-col relative">
      <button
        class="lg:hidden block absolute left-2 top-3 hover:bg-gray-200 rounded"
        onClick={() => props.setIsMenuShowButInSmallScreen(false)}
      >
        <HiOutlineX class="w-10 h-10 stroke-slate-800 fill-none stroke-1" />
      </button>
      <div class="flex flex-row justify-center py-[18px] items-center border-b gap-2">
        <IoCutOutline size={30} />
        <span class=" text-slate-700 font-semibold text-lg">头顶尚丝美发</span>
      </div>

      <div class="grow flex flex-col overflow-y-auto gap-1 px-1 py-2 text-base">
        <For each={allMenus}>
          {(menu) => (
            <Switch>
              <Match when={menu.path}>
                <Show when={permissionCodes.includes(menu.permissionCode!)}>
                  <A
                    class="text-gray-700 break-words flex flex-row items-center p-3 rounded-lg gap-2"
                    classList={{
                      'hover:bg-gray-200': location.pathname !== menu.path,
                      'bg-gray-200': location.pathname === menu.path,
                    }}
                    href={`${menu.path}`}
                    onClick={() => props.setIsMenuShowButInSmallScreen(false)}
                  >
                    {menu.icon}
                    {menu.name}
                  </A>
                </Show>
              </Match>
              <Match when={!menu.path}>
                <Show
                  when={menu.menuGroup!.some((m) => permissionCodes.includes(m.permissionCode!))}
                >
                  <button
                    class="flex flex-row text-gray-700 justify-between items-center p-3 rounded-lg"
                    classList={{
                      'hover:bg-gray-50': !menu.menuGroup!.some(
                        (m) => m.path === location.pathname,
                      ),
                      'bg-gray-50': menu.menuGroup!.some((m) => m.path === location.pathname),
                    }}
                    onClick={[toggleCollapsed, menu.name]}
                  >
                    <div class="flex flex-row items-center gap-2">
                      {menu.icon}
                      {menu.name}
                    </div>
                    <Show when={menu.collapsed} fallback={<HiOutlineChevronUp class="h-5 w-5" />}>
                      <HiOutlineChevronDown class="h-5 w-5" />
                    </Show>
                  </button>
                  <div class={menu.collapsed ? 'hidden' : 'flex flex-col gap-1'}>
                    <For
                      each={menu.menuGroup!.filter((m) =>
                        permissionCodes.includes(m.permissionCode!),
                      )}
                    >
                      {(menuItem) => (
                        <A
                          class="text-gray-700 text-sm break-words flex flex-row items-center pl-8 p-2 rounded-lg gap-2"
                          classList={{
                            'hover:bg-gray-200': location.pathname !== menuItem.path,
                            'bg-gray-200': location.pathname === menuItem.path,
                          }}
                          href={`${menuItem.path}`}
                          onClick={() => props.setIsMenuShowButInSmallScreen(false)}
                        >
                          {menuItem.name}
                        </A>
                      )}
                    </For>
                  </div>
                </Show>
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </div>
  );
};
export default Menu;
