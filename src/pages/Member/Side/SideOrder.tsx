import { type Component, createSignal, createResource, Show, For } from 'solid-js';
import InfiniteScroll from '../../../common/InfiniteScroll';
import { getOrdersByMemberId } from '../../../utils/api';
import type { StatisticOrderType } from '../../../types';

const SideOrder: Component<{ memberId: string }> = (props) => {
  const [page, setPage] = createSignal(0);
  const pageSize = 30;
  const [newBatch] = createResource(page, async (p: number) =>
    getOrdersByMemberId(props.memberId, p, pageSize),
  );

  let data: StatisticOrderType[] = [];

  const allData = () => {
    data = [...data, ...(newBatch()?.data ?? [])];
    return data;
  };

  return (
    <div class="h-full flex flex-col">
      <div class="flex flex-row pt-8 pl-8">
        <span class="text-xl font-semibold">消费记录</span>
      </div>
      <div class="grow h-full overflow-y-auto flex flex-col gap-4 mt-4">
        <For each={allData()}>
          {(row) => (
            <div class="flex flex-col gap-2 mx-2 sm:mx-8">
              <div class="rounded-md border bg-white flex flex-col p-4 gap-2">
                <div class="flex flex-row items-center justify-between">
                  <span class="text-xl font-semibold">{row.serviceName}</span>
                  <span class="text-base font-semibold">{row.amount}￥</span>
                </div>
                <div class="text-xs">
                  由
                  <span
                    class="text-slate-500 text-sm"
                    style={{ 'margin-left': '1px', 'margin-right': '1px' }}
                  >
                    {row.barberName}
                  </span>
                  理发
                </div>
                <div class="flex flex-row justify-between items-center">
                  <span class="text-slate-500 text-sm">{row.createTime}</span>
                  <span class="inline text-slate-500 text-sm">
                    共{' '}
                    {Math.trunc(row.totalMinutes / 60) > 0
                      ? `${Math.trunc(row.totalMinutes / 60)} 小时${
                          row.totalMinutes % 60 === 0 ? '' : ` ${row.totalMinutes % 60}分钟`
                        }`
                      : `${row.totalMinutes % 60} 分钟`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </For>
        <InfiniteScroll
          hasMore={pageSize * (page() + 1) < (newBatch()?.totalCount ?? 0)}
          threshold={100}
          loadMore={() => setPage((p) => p + 1)}
        />
        <Show
          when={newBatch.loading}
          fallback={
            <Show when={(newBatch()?.totalCount ?? 0) === 0}>
              <p class="py-3 border-none text-sm text-slate-400 text-center">暂无数据</p>
            </Show>
          }
        >
          <p class="py-3 border-none text-sm text-slate-400 text-center">加载中...</p>
        </Show>
      </div>
    </div>
  );
};
export default SideOrder;
