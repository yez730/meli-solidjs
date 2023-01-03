import { type Component, createResource, Show, For, Suspense } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import {
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'solid-icons/hi';
import { getOrders } from '../../utils/api';

const Orders: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  let inputSearch: HTMLInputElement | undefined;

  const [ordersResult] = createResource(
    () => [searchParams.currentPage, searchParams.search, searchParams.pageSize],
    async () => {
      if (searchParams.search) {
        inputSearch?.focus();
      }

      return getOrders(
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
        <Suspense
          fallback={
            <p class="pt-5 -m-2 bg-gray-100 text-gray-500 text-sm text-center">加载中...</p>
          }
        >
          <div class="flex xs:flex-row flex-col gap-2 py-2 lg:py-3 px-3 justify-between lg:items-center">
            <div>
              <span class="text-lg lg:text-xl px-2 font-semibold text-slate-600">订单列表</span>
              <span class="text-sm text-slate-500">共 {ordersResult()?.totalCount} 项</span>
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
                  onInput={(e) =>
                    setSearchParams({ currentPage: 0, search: e.currentTarget.value })
                  }
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

          <div class="w-full overflow-x-auto">
            <table class="w-full text-left min-w-max">
              <thead>
                <tr class="border-b">
                  <th class="py-3 px-1">服务类型</th>
                  <th class="py-3 px-1">客户类型</th>
                  <th class="py-3 px-1">会员姓名</th>
                  <th class="py-3 px-1">会员手机</th>
                  <th class="py-3 px-1">服务时长</th>
                  <th class="py-3 px-1">消费金额</th>
                  <th class="py-3 px-1">支付方式</th>
                  <th class="py-3 px-1">理发师</th>
                  <th class="py-3 px-1">订单时间</th>
                </tr>
              </thead>
              <tbody>
                <For each={ordersResult()?.data}>
                  {(row) => (
                    <tr class="border-b hover:bg-gray-100">
                      <td class="py-3 px-1">{row.serviceName}</td>
                      <td class="py-3 px-1">{row.consumerType}</td>
                      <td class="py-3 px-1">{row.memberName}</td>
                      <td class="py-3 px-1">{row.memberCellphone}</td>
                      <td class="py-3 px-1">
                        {Math.trunc(row.totalMinutes / 60) > 0
                          ? `${Math.trunc(row.totalMinutes / 60)} 小时${
                              row.totalMinutes % 60 === 0 ? '' : ` ${row.totalMinutes % 60}分钟`
                            }`
                          : `${row.totalMinutes % 60} 分钟`}
                      </td>
                      <td class="py-3 px-1">{row.amount}</td>
                      <td class="py-3 px-1">{row.paymentType}</td>
                      <td class="py-3 px-1">{row.barberName}</td>
                      <td class="py-3 px-1">{row.createTime}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <Show when={ordersResult()?.totalCount! > 0}>
            <div class="flex flex-row gap-2 justify-center py-2">
              <Show when={Number((searchParams.currentPage as unknown as number) ?? 0) > 0}>
                <button
                  class="rounded cursor-pointer disabled:cursor-default border border-slate-300 stroke-slate-300 hover:stroke-slate-500 hover:border-slate-500"
                  onClick={() => {
                    setSearchParams({
                      currentPage: Number((searchParams.currentPage as unknown as number) ?? 0) - 1,
                    });
                  }}
                >
                  <HiOutlineChevronLeft class="w-10 h-6 stroke-slate-400" />
                </button>
              </Show>
              <Show
                when={
                  (Number((searchParams.currentPage as unknown as number) ?? 0) + 1) *
                    Number((searchParams.pageSize as unknown as number) ?? 20) <
                  ordersResult()?.totalCount!
                }
              >
                <button
                  class="rounded cursor-pointer disabled:cursor-default border border-slate-300 stroke-slate-300 hover:stroke-slate-500 hover:border-slate-500"
                  onClick={() => {
                    setSearchParams({
                      currentPage: Number((searchParams.currentPage as unknown as number) ?? 0) + 1,
                    });
                  }}
                >
                  <HiOutlineChevronRight class="w-10 h-6 stroke-slate-400" />
                </button>
              </Show>
            </div>
          </Show>
        </Suspense>
      </div>
    </div>
  );
};
export default Orders;
