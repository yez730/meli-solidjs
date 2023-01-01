import { type Component, createSignal, Show, For, createResource } from 'solid-js';
import { useSearchParams, useNavigate } from '@solidjs/router';
import moment from 'moment';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';
import toast from 'solid-toast';
import {
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineDotsHorizontal,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineHeart,
} from 'solid-icons/hi';
import MemberFullDropdown from './MemberDropdown/MemberFullDropdown';
import ServiceTypeFullDropdown from './ServiceTypeDropdown/ServiceTypeFullDropdown';
import MemberLargeDropdownSide from './MemberDropdown/MemberLargeDropdownSide';
import clickOutside from '../../directives/clickOutside';
import { startTimeList, durationList } from '../../utils/common';
import ServiceTypeLargeDropdown from './ServiceTypeDropdown/ServiceTypeLargeDropdown';
import { addAppointment, getBarbers } from '../../utils/api';
import { type NewAppointment } from '../../types';

const AppointmentAdd: Component = () => {
  const [isMemberFullDropdownShow, setIsMemberFullDropdownShow] = createSignal(false);
  const [isServiceTypeFullDropdownShow, setIsServiceTypeFullDropdownShow] = createSignal(false);
  const [isDivMainShow, setIsDivMainShow] = createSignal(true);
  const [removeMemberViewVisable, setRemoveMemberViewVisable] = createSignal(false);
  const [searchParams, setSearchParams] = useSearchParams();

  let btnRemoveView: HTMLButtonElement | undefined;

  const [barbars] = createResource(async () => getBarbers(''));

  const navigate = useNavigate();
  const addMember = () => {
    const search = Object.entries(searchParams)
      .reduce((acc, cur) => {
        // TODO searchParams values 自动恢复编码？
        let str = acc;
        if (cur[0] === 'currentDate' || cur[0] === 'serviceTypeName' || cur[0] === 'remark') {
          str += `${cur[0]}=${encodeURIComponent(cur[1])}&`;
        } else {
          str += `${cur[0]}=${cur[1]}&`;
        }
        return str;
      }, '?')
      .slice(0, -1);
    navigate(`/member-info${search}&fromCalendarAdd=true`);
  };

  const back = () => {
    let path = `/calendar`;
    if (searchParams.barberId) {
      path += `?barberId=${searchParams.barberId}`;
    }
    navigate(path);
  };

  const checkout = async () => {
    const start = moment(
      `${moment(decodeURIComponent(searchParams.currentDate)).format('YYYY-MM-DD')} ${moment(
        decodeURIComponent(searchParams.currentDate),
      ).format('HH:mm')}`,
    );
    const startStr = start.format();

    const end = start.add(searchParams.duration as unknown as number, 'minutes');
    const endStr = end.format();

    if (!searchParams.serviceTypeId) {
      toast.error('请选择服务类型');
      return;
    }

    if (!searchParams.barberId) {
      toast.error('请选择理发师');
      return;
    }

    const appointment: NewAppointment = {
      startTime: startStr,
      endTime: endStr,
      serviceTypeId: searchParams.serviceTypeId,
      barberId: searchParams.barberId,
      memberId: searchParams.memberId === '' ? undefined : searchParams.memberId,
      paymentType: searchParams.memberId ? 'member' : 'cash',
      amount: searchParams.memberId
        ? (searchParams.memberPrize as unknown as number)
        : (searchParams.normalPrize as unknown as number),
      remark: decodeURIComponent(searchParams.remark),
    };
    const res = await addAppointment(appointment);
    if (res.ok) {
      toast.success('添加成功');
      back();
    } else {
      toast.error('添加失败');
    }
  };

  window
    .matchMedia(`(min-width: ${(resolveConfig(tailwindConfig) as any).theme!.screens?.lg})`)
    .addEventListener('change', (e) => {
      if (e.matches) {
        setIsMemberFullDropdownShow(false);
        setRemoveMemberViewVisable(false);
        setIsServiceTypeFullDropdownShow(false);
        setIsDivMainShow(true);
      }
    });

  return (
    <>
      <Show when={isMemberFullDropdownShow()}>
        <MemberFullDropdown
          setBinding={(memberId, memberName) =>
            setSearchParams({ memberId, memberName: encodeURIComponent(memberName) })
          }
          hide={() => {
            setIsDivMainShow(true);
            setIsMemberFullDropdownShow(false);
          }}
          addMember={addMember}
        />
      </Show>
      <Show when={isServiceTypeFullDropdownShow()}>
        <ServiceTypeFullDropdown
          setBinding={(serviceTypeId, serviceTypeName, duration, normalPrize, memberPrize) =>
            setSearchParams({
              serviceTypeId,
              serviceTypeName: encodeURIComponent(serviceTypeName),
              duration,
              normalPrize,
              memberPrize,
            })
          }
          hide={() => {
            setIsDivMainShow(true);
            setIsServiceTypeFullDropdownShow(false);
          }}
        />
      </Show>
      <Show when={isDivMainShow()}>
        <div class="flex flex-col bg-white max-h-screen">
          <div class="flex-none flex flex-row border-b-slate-300 border-b xs:p-4 p-2">
            <div class="grow flex flex-col justify-center items-center">
              <span class="text-2xl font-semibold">新建订单</span>
            </div>
            <button class="hover:bg-slate-300/40" onClick={back}>
              <HiOutlineX class="h-10 w-10 stroke-slate-800 stroke-1" />
            </button>
          </div>

          <div
            id="appointmentAddIsModalShow"
            class="grow flex lg:flex-row flex-col relative h-screen lg:overflow-y-hidden overflow-y-auto overflow-x-hidden"
          >
            <div class="flex-none hidden lg:flex flex-col order-1 h-full xl:max-w-sm max-w-xs w-full z-20 items-center border-l border-l-slate-300 overflow-hidden bg-white">
              <MemberLargeDropdownSide
                amount={
                  searchParams.memberId
                    ? (searchParams.memberPrize as unknown as number)
                    : (searchParams.normalPrize as unknown as number)
                }
                duration={searchParams.duration as unknown as number}
                memberId={searchParams.memberId}
                realName={decodeURIComponent(searchParams.memberName ?? '')}
                setBinding={(id, name) => {
                  setSearchParams({ memberId: id, memberName: encodeURIComponent(name) });
                }}
                addMember={addMember}
                checkout={checkout}
              />
            </div>

            <div class="grow relative lg:overflow-y-auto">
              <div class="lg:mx-auto lg:max-w-3xl w-full my-4 flex flex-col gap-6 px-2">
                <span class="text-lg lg:text-xl px-2 font-bold text-slate-700">
                  {moment(decodeURIComponent(searchParams.currentDate)).format('YYYY年MM月DD日')}
                </span>
                <Show
                  when={searchParams.memberId}
                  fallback={
                    <div
                      class="lg:hidden flex flex-col w-full px-2 gap-2"
                      onClick={() => {
                        setIsDivMainShow(false);
                        setIsMemberFullDropdownShow(true);
                      }}
                    >
                      <span class="text-gray-600">添加客人</span>
                      <div class="relative">
                        <input
                          type="text"
                          readonly
                          placeholder="搜索客户"
                          value={decodeURIComponent(searchParams.memberName ?? '')}
                          class="py-3 pr-8 block w-full cursor-pointer rounded"
                        />
                        <HiOutlineSearch class="absolute right-4 top-4 h-5 w-5 stroke-slate-400" />
                      </div>
                    </div>
                  }
                >
                  <div class="lg:hidden flex flex-row w-full px-2 py-0 justify-between items-center relative">
                    <div class="flex flex-row items-center">
                      <span class="text-gray-600">客人姓名：</span>
                      <span>
                        {decodeURIComponent(searchParams.memberName).length > 10
                          ? `${decodeURIComponent(searchParams.memberName).substring(0, 10)}..`
                          : decodeURIComponent(searchParams.memberName)}
                      </span>
                    </div>
                    <button
                      ref={btnRemoveView!}
                      class="self-start p-1 hover:bg-slate-200"
                      onClick={() => setRemoveMemberViewVisable((v) => !v)}
                    >
                      <HiOutlineDotsHorizontal class="w-6 h-6 stroke-slate-500" />
                    </button>
                    <Show when={removeMemberViewVisable()}>
                      <div
                        use:clickOutside={[() => setRemoveMemberViewVisable(false), btnRemoveView!]}
                        class="absolute flex flex-row justify-between items-center px-2 lg:right-8 lg:top-11 right-6 top-8 bg-white border-b-slate-300 border  rounded-sm hover:bg-gray-100"
                      >
                        <HiOutlineTrash class="w-4 h-4 stroke-red-600" />
                        <button
                          class="w-24 h-10 px-1 text-sm text-red-600"
                          onClick={() => {
                            setRemoveMemberViewVisable(false);
                            setSearchParams({ memberId: undefined, memberName: undefined });
                          }}
                        >
                          从收银中移除
                        </button>
                      </div>
                    </Show>
                  </div>
                </Show>

                <div class="flex lg:flex-row flex-col gap-2 w-full px-2">
                  <div class="hidden lg:flex flex-col gap-2">
                    <span class="text-gray-600">开始时间</span>
                    <select
                      onChange={(e) =>
                        setSearchParams({
                          currentDate: encodeURIComponent(
                            `${moment(searchParams.currentDate).format('YYYY-MM-DD')}T${
                              e.currentTarget.value
                            }`,
                          ),
                        })
                      }
                      class="lg:w-40 h-12 rounded appearance-none block"
                    >
                      <For each={startTimeList}>
                        {(startTime) => (
                          <option
                            value={startTime.value}
                            selected={
                              moment(decodeURIComponent(searchParams.currentDate)).format(
                                'HH:mm',
                              ) === startTime.value
                            }
                          >
                            {startTime.text}
                          </option>
                        )}
                      </For>
                    </select>
                  </div>
                  <div class="flex flex-col w-full gap-2">
                    <span class="text-gray-600">服务类型</span>
                    <div class="hidden lg:block w-full">
                      <ServiceTypeLargeDropdown
                        id={searchParams.serviceTypeId}
                        name={searchParams.serviceTypeName}
                        duration={searchParams.duration as unknown as number}
                        normalPrize={searchParams.normalPrize as unknown as number}
                        memberPrize={searchParams.memberPrize as unknown as number}
                        setBinding={(
                          serviceTypeId,
                          serviceTypeName,
                          duration,
                          normalPrize,
                          memberPrize,
                        ) =>
                          setSearchParams({
                            serviceTypeId,
                            serviceTypeName: encodeURIComponent(serviceTypeName),
                            duration,
                            normalPrize,
                            memberPrize,
                          })
                        }
                      />
                    </div>

                    <div
                      class="block lg:hidden relative"
                      onClick={() => {
                        setIsDivMainShow(false);
                        setIsServiceTypeFullDropdownShow(true);
                      }}
                    >
                      <input
                        type="text"
                        readonly
                        value={decodeURIComponent(searchParams.serviceTypeName ?? '')}
                        class="py-3 pr-8 block w-full cursor-pointer rounded border border-gray-500 "
                      />
                      <HiOutlineChevronDown class="absolute right-3 top-3 h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div class="flex lg:flex-row flex-col gap-2 w-full px-2">
                  <div class="flex flex-row gap-2">
                    <div class="flex lg:hidden flex-col w-full gap-2">
                      <span class="text-gray-600">开始时间</span>
                      <select
                        onChange={(e) =>
                          setSearchParams({
                            currentDate: encodeURIComponent(
                              `${moment(searchParams.currentDate).format('YYYY-MM-DD')}T${
                                e.currentTarget.value
                              }`,
                            ),
                          })
                        }
                        class="lg:w-40 h-12 appearance-none block rounded transition ease-in-out "
                      >
                        <For each={startTimeList}>
                          {(startTime) => (
                            <option
                              value={startTime.value}
                              selected={
                                moment(decodeURIComponent(searchParams.currentDate)).format(
                                  'HH:mm',
                                ) === startTime.value
                              }
                            >
                              {startTime.text}
                            </option>
                          )}
                        </For>
                      </select>
                    </div>
                    <div class="flex flex-col w-full gap-2">
                      <span class="text-gray-600">预估时长</span>
                      <select
                        disabled={!searchParams.serviceTypeId}
                        onChange={(e) => setSearchParams({ duration: e.currentTarget.value })}
                        class=" disabled:bg-gray-100 lg:w-40 h-12 appearance-none blockbg-clip-padding bg-no-repeat border border-solid border-gray-500 rounded transition ease-in-out"
                      >
                        <Show when={searchParams.serviceTypeId}>
                          <For each={durationList}>
                            {(duration) => (
                              <option
                                value={duration.value}
                                selected={searchParams.duration === duration.value.toString()}
                              >
                                {duration.text}
                              </option>
                            )}
                          </For>
                        </Show>
                      </select>
                    </div>
                  </div>

                  <div class="flex flex-col w-full gap-2">
                    <span class="text-gray-600">理发师</span>
                    <div class="flex flex-row items-center gap-1 h-12 rounded border border-gray-500 focus-within:border-2 focus-within:border-blue-600 focus-within:outline-none">
                      <HiOutlineHeart class="ml-1 w-6 h-6 stroke-slate-400" />
                      <select
                        onChange={(e) => setSearchParams({ barberId: e.currentTarget.value })}
                        class="rounded grow h-full w-full border-transparent focus:border-transparent focus:ring-0 appearance-none block transition ease-in-out"
                      >
                        <option value="" />
                        <For each={barbars()}>
                          {(barber) => (
                            <option
                              value={barber.barberId}
                              selected={searchParams.barberId === barber.barberId}
                            >
                              {barber.realName}
                            </option>
                          )}
                        </For>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="flex lg:flex-row flex-col gap-2 w-full px-2">
                  <div class="flex flex-col w-full gap-2">
                    <span class="text-gray-600">备注信息</span>
                    {/* //TODO length limit */}
                    <textarea
                      value={decodeURIComponent(searchParams.remark ?? '')}
                      onInput={(e) =>
                        setSearchParams({ remark: encodeURIComponent(e.currentTarget.value) })
                      }
                      class="w-full rounded border"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex lg:hidden flex-col gap-4 p-4 items-start border-t">
            <span class="text-lg">
              总金额：
              {searchParams.memberId
                ? (searchParams.memberPrize as unknown as number)
                : (searchParams.normalPrize as unknown as number)}
              ￥（
              {Math.trunc((searchParams.duration as unknown as number) / 60) > 0
                ? `${Math.trunc((searchParams.duration as unknown as number) / 60)} 小时${
                    (searchParams.duration as unknown as number) % 60 === 0
                      ? ''
                      : `${(` ${searchParams.duration}` as unknown as number) % 60}分钟`
                  }`
                : `${(searchParams.duration as unknown as number) % 60} 分钟`}
              ）
            </span>
            <button
              class="w-24 py-2 bg-black hover:bg-gray-800 rounded text-white"
              onClick={checkout}
            >
              结算
            </button>
          </div>
        </div>
      </Show>
    </>
  );
};
export default AppointmentAdd;
