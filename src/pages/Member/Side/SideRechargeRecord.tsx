import {
  type Component,
  Suspense,
  createSignal,
  createResource,
  Show,
  For,
  createEffect,
  on,
  createMemo,
} from 'solid-js';
import InfiniteScroll from '../../../common/InfiniteScroll';
import { getRechargeRecordsByMemberId } from '../../../utils/api';
import type { StatisticRechargeRecordType } from '../../../types';

const SideRechargeRecord: Component<{
  lastRechargeTime: number | undefined;
  memberId: string;
}> = (props) => {
  const [page, setPage] = createSignal(0);
  const pageSize = 30;
  const [newBatch, { refetch }] = createResource(
    page,
    async (p: number) => (await getRechargeRecordsByMemberId(props.memberId, p, pageSize)).data,
  );

  let elementScroll: HTMLDivElement | undefined;

  let data: StatisticRechargeRecordType[] = [];

  createEffect(
    on(
      () => props.lastRechargeTime,
      () => {
        data = [];

        if (page() === 0) {
          refetch();
        } else {
          setPage(0);
        }

        elementScroll?.scroll(0, 0);
      },
    ),
  );

  const allData = createMemo(() => {
    data = [...data, ...(newBatch() ?? [])];
    return data;
  });

  return (
    <div class="h-full flex flex-col">
      <div class="flex flex-row pt-8 pl-8">
        <span class="text-xl font-semibold">充值记录</span>
      </div>
      <div ref={elementScroll!} class="grow h-full overflow-y-auto flex flex-col gap-4 mt-4">
        <Suspense fallback={<p class="p-3 text-sm text-slate-400 text-center">加载中...</p>}>
          <Show
            when={allData().length > 0}
            fallback={<p class="p-3 text-sm text-slate-400 text-center">暂无数据</p>}
          >
            <For each={allData()}>
              {(row) => (
                <div class="flex flex-col gap-2 mx-2 sm:mx-8">
                  <div class="rounded-md border bg-white flex flex-col p-4 gap-2">
                    <span class="text-xl font-semibold">{row.amount}￥</span>
                    <div class="text-xs">
                      由
                      <span
                        class="text-slate-500 text-sm"
                        style={{ 'margin-left': '1px', 'margin-right': '1px' }}
                      >
                        {row.barberName}
                      </span>
                      充值
                    </div>
                    <span class="text-slate-500 text-sm">{row.crateTime}</span>
                  </div>
                </div>
              )}
            </For>
            <InfiniteScroll
              elementScroll={elementScroll}
              hasMore={newBatch()!.length > 0}
              threshold={100}
              loadMore={() => setPage((p) => p + 1)}
            />
          </Show>
        </Suspense>
      </div>
    </div>
  );
};
export default SideRechargeRecord;
