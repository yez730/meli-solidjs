import { type Component, createResource, Show, For } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import {
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'solid-icons/hi';
import { getRechargeRecords } from '../../utils/api';

const RechargeRecords: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  let inputSearch: HTMLInputElement | undefined;

  const [rechargeRecordsResult] = createResource(
    () => [searchParams.currentPage, searchParams.search, searchParams.pageSize],
    async () => {
      if (searchParams.search) {
        inputSearch?.focus();
      }

      return getRechargeRecords(
        (searchParams.currentPage as unknown as number) ?? 0,
        (searchParams.pageSize as unknown as number) ?? 20,
        searchParams.search,
      );
    },
  );

  const closeSearch = () => {
    setSearchParams({ search: '', currentPage: 0 });
    inputSearch!.focus();
  };

  return (
    <div class="overflow-y-auto p-2">
      <div class="px-2 flex flex-col bg-white">
        <div class="flex xs:flex-row flex-col gap-2 py-2 lg:py-3 px-3 justify-between lg:items-center">
          <div>
            <span class="text-lg lg:text-xl px-2 font-semibold text-slate-600">充值记录</span>
            <span class="text-sm text-slate-500">共 {rechargeRecordsResult()?.totalCount} 项</span>
          </div>
        </div>
        <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between  gap-2 px-4 bg-slate-100 py-3 rounded">
          <div class="flex flex-col xs:flex-row gap-1 xs:gap-4">
            <div class="relative max-w-sm">
              <input
                ref={inputSearch!}
                type="text"
                class="px-10 border border-slate-300 w-full rounded-3xl focus:ring-0 pr-8 focus:outline-none focus:border-slate-500 shadow-sm placeholder-slate-400"
                placeholder="客户姓名/手机号"
                value={searchParams.search ?? ''}
                onInput={(e) => setSearchParams({ currentPage: 0, search: e.currentTarget.value })}
              />
              <HiOutlineSearch class="absolute left-2 top-3 h-4 w-4 stroke-slate-200" />
              <Show when={searchParams.search}>
                <HiOutlineX
                  class="absolute right-3 top-3 h-4 w-4 cursor-pointer"
                  onClick={closeSearch}
                />
              </Show>
            </div>
          </div>
        </div>

        <div class="w-full overflow-x-auto ">
          <table class="w-full text-left min-w-max">
            <thead>
              <tr class="border-b">
                <th class="py-3 px-1">会员姓名</th>
                <th class="py-3 px-1">会员手机</th>
                <th class="py-3 px-1">充值金额（元）</th>
                <th class="py-3 px-1">操作人</th>
                <th class="py-3 px-1">充值时间</th>
              </tr>
            </thead>
            <tbody>
              <For each={rechargeRecordsResult()?.data}>
                {(row) => (
                  <tr class="border-b hover:bg-gray-100">
                    <td class="py-3 px-1">{row.memberName}</td>
                    <td class="py-3 px-1">{row.memberCellphone}</td>
                    <td class="py-3 px-1">{row.amount}</td>
                    <td class="py-3 px-1">{row.barberName}</td>
                    <td class="py-3 px-1">{row.crateTime}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <Show when={(rechargeRecordsResult()?.totalCount ?? 0) > 0}>
          <div class="flex flex-row gap-2 justify-center py-2">
            <Show
              when={Number(((searchParams.currentPage as unknown as number) ?? 0).toString()) > 0}
            >
              <button
                class="rounded cursor-pointer disabled:cursor-default border border-slate-300 stroke-slate-300 hover:stroke-slate-500 hover:border-slate-500"
                onClick={() => {
                  setSearchParams({
                    currentPage:
                      Number(((searchParams.currentPage as unknown as number) ?? 0).toString()) - 1,
                  });
                }}
              >
                <HiOutlineChevronLeft class="w-10 h-6 stroke-slate-400" />
              </button>
            </Show>
            <Show
              when={
                (Number(((searchParams.currentPage as unknown as number) ?? 0).toString()) + 1) *
                  Number(((searchParams.pageSize as unknown as number) ?? 20).toString()) <
                Number(rechargeRecordsResult()?.totalCount.toString())
              }
            >
              <button
                class="rounded cursor-pointer disabled:cursor-default border border-slate-300 stroke-slate-300 hover:stroke-slate-500 hover:border-slate-500"
                onClick={() => {
                  setSearchParams({
                    currentPage:
                      Number(((searchParams.currentPage as unknown as number) ?? 0).toString()) + 1,
                  });
                }}
              >
                <HiOutlineChevronRight class="w-10 h-6 stroke-slate-400" />
              </button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};
export default RechargeRecords;
