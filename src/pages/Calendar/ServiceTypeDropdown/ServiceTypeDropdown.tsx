import {
  type Component,
  Suspense,
  createSignal,
  createResource,
  Show,
  For,
  createEffect,
  on,
  useTransition,
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
  const [newBatch, { refetch }] = createResource(page, async (p: number) => {
    return (await getServiceTypes(p, pageSize, props.search)).data;
  });

  let data: ServiceType[] = [];

  const [pending, start] = useTransition();

  createEffect(
    on(
      () => props.search,
      () => {
        data = [];

        if (page() === 0) {
          start(() => refetch());
        } else {
          start(() => setPage(0));
        }

        props.scrollElement?.scroll(0, 0);
      },
    ),
  );

  const allData = () => {
    data = [...data, ...(newBatch() ?? [])];
    return data;
  };

  return (
    <Suspense
      fallback={
        // pending for eslint
        <p class="p-3 text-sm text-slate-400 text-center" classList={{ pending: pending() }}>
          加载中...
        </p>
      }
    >
      <Show
        when={allData()!.length > 0}
        fallback={<p class="p-3 text-sm text-slate-400 text-center">暂无数据</p>}
      >
        <ul class="py-1 text-gray-700">
          <For each={allData()!}>
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
            hasMore={newBatch()!.length > 0}
            threshold={100}
            loadMore={() => start(() => setPage((p) => p + 1))}
          />
        </ul>
      </Show>
    </Suspense>
  );
};
export default ServiceTypeDropdown;
