import {
  type Component,
  createSignal,
  createResource,
  Show,
  For,
  createEffect,
  on,
} from 'solid-js';
import InfiniteScroll from '../../../common/InfiniteScroll';
import { getServiceTypes } from '../../../utils/api';
import type { ServiceType } from '../../../types';

const ServiceTypeDropdown: Component<{
  scrollElement: HTMLDivElement;
  search: string;
  handleSelected: (
    id: string,
    name: string,
    duration: number,
    normalPrize: number,
    memberPrize: number,
  ) => void;
}> = (props) => {
  const [page, setPage] = createSignal(0);
  const pageSize = 30;
  const [newBatch, { mutate, refetch }] = createResource(page, async (p: number) =>
    getServiceTypes(p, pageSize, props.search),
  );

  let data: ServiceType[] = [];

  createEffect(
    on(
      () => props.search,
      () => {
        data = [];
        mutate({ totalCount: 0, data: [] });

        if (page() === 0) {
          refetch();
        } else {
          setPage(0);
        }

        props.scrollElement?.scroll(0, 0);
      },
    ),
  );

  const allData = () => {
    data = [...data, ...(newBatch()?.data ?? [])];
    return data;
  };

  return (
    <>
      <ul class="py-1 text-gray-700">
        <For each={allData()}>
          {(serviceType) => (
            <li
              onClick={() => {
                props.handleSelected(
                  serviceType.serviceTypeId,
                  serviceType.name,
                  serviceType.estimatedDuration,
                  serviceType.normalPrize,
                  serviceType.memberPrize,
                );
              }}
            >
              <div class="cursor-pointer flex justify-between items-center py-2 px-4 hover:bg-gray-100">
                <div class="flex flex-col justify-center">
                  <span class="text-sm font-medium">{serviceType.name}</span>
                  <span class="text-xs text-slate-500">
                    {Math.trunc(serviceType.estimatedDuration / 60) > 0
                      ? `${Math.trunc(serviceType.estimatedDuration / 60)} 小时${
                          serviceType.estimatedDuration % 60 === 0
                            ? ''
                            : ` ${serviceType.estimatedDuration % 60}分钟`
                        }`
                      : `${serviceType.estimatedDuration % 60} 分钟`}
                  </span>
                </div>
                <span class="text-xs font-medium">
                  普通价:{serviceType.normalPrize}￥/会员价:{serviceType.memberPrize}￥
                </span>
              </div>
            </li>
          )}
        </For>
        <InfiniteScroll
          elementScroll={props.scrollElement}
          hasMore={pageSize * (page() + 1) < (newBatch()?.totalCount ?? 0)}
          threshold={100}
          loadMore={() => setPage((p) => p + 1)}
        />
      </ul>
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
    </>
  );
};
export default ServiceTypeDropdown;
