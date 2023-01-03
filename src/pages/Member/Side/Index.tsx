import {
  type Component,
  onCleanup,
  createSignal,
  Show,
  Switch,
  Match,
  createResource,
  onMount,
} from 'solid-js';
import { useNavigate, useSearchParams } from '@solidjs/router';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';
import { HiOutlineMenu, HiOutlineX } from 'solid-icons/hi';
import { FaSolidArrowLeftLong } from 'solid-icons/fa';
import { getMember } from '../../../utils/api';

import Menu from './Menu';
import SideMember from './SideMember';
import SideOrder from './SideOrder';
import SideRechargeRecord from './SideRechargeRecord';
import Recharge from './Recharge';

const Index: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMenuShowButInSmallScreen, setIsMenuShowButInSmallScreen] = createSignal(false);
  const [currentMenu, setCurrentMenu] = createSignal('MemberInfo');
  const [showRecharge, setShowRecharge] = createSignal(false);
  const [lastRechargeTime, setLastRechargeTime] = createSignal<number | undefined>(); // 充值记录时刷新

  const [member, { refetch }] = createResource(async () => {
    return getMember(searchParams.memberId);
  });

  window
    .matchMedia(`(min-width: ${(resolveConfig(tailwindConfig) as any).theme!.screens?.lg})`)
    .addEventListener('change', (e) => {
      if (e.matches) {
        setIsMenuShowButInSmallScreen(false);
      }
    });

  const navigate = useNavigate();
  const back = () => {
    if (searchParams.fromCalendarShow) {
      let path = `/appointment-show?id=${searchParams.id}`;
      if (searchParams.barberId) {
        path += `&barberId=${searchParams.barberId}`;
      }
      navigate(path);
    } else {
      setSearchParams({
        memberId: undefined,
      });
    }
  };

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (key === 'Escape' && !showRecharge()) {
      back();
    }
  };

  onMount(() => {
    window.addEventListener('keyup', handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener('keyup', handleKeyDown);
  });

  return (
    <>
      <div class="fixed inset-0 z-20">
        <div class="fixed right-0 top-0 bottom-0 shadow-lg bg-white w-full lg:max-w-2xl flex flex-col">
          <div class="p-4 flex flex-row justify-between border-b">
            <button class="hover:bg-slate-300/40" onClick={back}>
              <FaSolidArrowLeftLong class="w-8 h-8 stroke-slate-800 " />
            </button>

            <Show
              when={isMenuShowButInSmallScreen()}
              fallback={
                <button
                  class="lg:hidden block right-2 top-2  hover:bg-slate-200 z-20"
                  onClick={() => setIsMenuShowButInSmallScreen(true)}
                >
                  <HiOutlineMenu class="h-10 w-10 stroke-slate-800" />
                </button>
              }
            >
              <button
                class="lg:hidden block right-2 top-2  hover:bg-slate-200 z-20"
                onClick={() => setIsMenuShowButInSmallScreen(false)}
              >
                <HiOutlineX class="h-10 w-10 stroke-slate-500" />
              </button>
            </Show>
          </div>

          <Show
            when={!isMenuShowButInSmallScreen()}
            fallback={
              <div class="grow overflow-y-auto ">
                <Menu
                  currentMenu={currentMenu()}
                  setCurrentMenu={setCurrentMenu}
                  setIsMenuShowButInSmallScreen={setIsMenuShowButInSmallScreen}
                />
              </div>
            }
          >
            <div class="grow h-full w-full flex flex-col lg:flex-row overflow-y-hidden">
              <div class="flex flex-col border-r lg:w-48">
                <div class="flex flex-col border-b py-2">
                  <div class="flex flex-row justify-center">
                    <span class="text-lg font-semibold">{member()?.realName ?? '...'}</span>
                  </div>
                  <div class="flex flex-row justify-center">
                    <span class="text-sm">{member()?.cellphone ?? '...'}</span>
                  </div>
                  <div class="flex flex-row justify-center gap-2 p-2">
                    <button
                      class="w-20 py-1 border border-slate-300 bg-white hover:border-slate-500 rounded text-black"
                      onClick={() => navigate(`/member-info?memberId=${member()?.memberId}`)}
                    >
                      编辑
                    </button>
                    <button
                      class="w-20 py-1 border border-slate-300 bg-white hover:border-slate-500 rounded text-black"
                      onClick={() => setShowRecharge(true)}
                    >
                      充值
                    </button>
                  </div>
                </div>
                <div class="grow hidden lg:block overflow-y-auto">
                  <Menu
                    currentMenu={currentMenu()}
                    setCurrentMenu={setCurrentMenu}
                    setIsMenuShowButInSmallScreen={setIsMenuShowButInSmallScreen}
                  />
                </div>
              </div>

              <div class="grow h-full overflow-y-hidden bg-gray-50">
                <Switch>
                  <Match when={currentMenu() === 'MemberInfo'}>
                    <SideMember member={member()!} />
                  </Match>
                  <Match when={currentMenu() === 'Order'}>
                    <SideOrder memberId={searchParams.memberId} />
                  </Match>
                  <Match when={currentMenu() === 'RechargeRecord'}>
                    <SideRechargeRecord
                      lastRechargeTime={lastRechargeTime()}
                      memberId={searchParams.memberId}
                    />
                  </Match>
                </Switch>
              </div>
            </div>
          </Show>
        </div>
      </div>
      <Show when={showRecharge()}>
        <Recharge
          handleRechargeSuccess={() => {
            refetch();
            setLastRechargeTime(Date.now());
          }}
          hideShowRecharge={() => {
            setShowRecharge(false);
          }}
        />
      </Show>
    </>
  );
};
export default Index;
