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
import { getMembers } from '../../../utils/api';
import type { Member } from '../../../types';

const MemberDropdown: Component<{
  scrollElement: HTMLDivElement;
  search: string;
  handleSelected: (id: string, name: string) => void;
}> = (props) => {
  const [page, setPage] = createSignal(0);
  const pageSize = 30;

  const [newBatch, { refetch }] = createResource(page, async (p: number) =>
    getMembers(p, pageSize, props.search, ''),
  );

  let data: Member[] = [];

  createEffect(
    on(
      () => props.search,
      () => {
        data = [];

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
          {(member) => (
            <li
              onClick={() => {
                props.handleSelected(member.memberId, member.realName ?? '');
              }}
            >
              <div class="cursor-pointer flex flex-row justify-between items-center p-3 hover:bg-gray-100 ">
                <span>{member.realName}</span>
                <span class="text-sm text-slate-400 ">{member.cellphone}</span>
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

export default MemberDropdown;
