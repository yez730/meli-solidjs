import { type Component, createResource, Show, For, Suspense } from 'solid-js';
import { useSearchParams, useNavigate, useLocation } from '@solidjs/router';
import {
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'solid-icons/hi';
import { getServiceTypes } from '../../../utils/api';

const ServiceTypes: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  let inputSearch: HTMLInputElement | undefined;

  const [serviceTypesResult] = createResource(
    () => [searchParams.currentPage, searchParams.search, searchParams.pageSize],
    async () => {
      if (decodeURIComponent(searchParams.search ?? '')) {
        inputSearch?.focus();
      }

      return getServiceTypes(
        (searchParams.currentPage as unknown as number) ?? 0,
        (searchParams.pageSize as unknown as number) ?? 20,
        decodeURIComponent(searchParams.search ?? ''),
      );
    },
  );

  const addService = () => {
    navigate('/service-type-info');
  };

  const closeSearch = () => {
    setSearchParams({ search: '', currentPage: 0 });
    inputSearch!.focus();
  };

  const goToServiceTypeInfo = (serviceTypeId: string) => {
    let path = '/service-type-info';
    if (location.search) {
      path += `${location.search}&serviceTypeId=${serviceTypeId}`;
    } else {
      path += `?serviceTypeId=${serviceTypeId}`;
    }

    navigate(path);
  };

  return (
    <div class="overflow-y-auto p-2">
      <div class="mx-auto max-w-screen-lg flex flex-col bg-white p-2">
        <Suspense
          fallback={
            <p class="pt-5 -m-2 bg-gray-100 text-gray-500 text-sm text-center">加载中...</p>
          }
        >
          <div class="flex xs:flex-row flex-col gap-2 py-2 lg:py-3 px-3 justify-between xs:items-center">
            <div>
              <span class="text-lg lg:text-xl px-2 font-semibold text-slate-600">服务列表</span>
              <span class="text-sm text-slate-500">共 {serviceTypesResult()?.totalCount} 项</span>
            </div>
            <button
              class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white"
              onClick={addService}
            >
              添加服务
            </button>
          </div>
          <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between  gap-2 px-4 bg-slate-100 py-3 rounded">
            <div class="flex flex-col xs:flex-row gap-1 xs:gap-4">
              <div class="relative max-w-sm">
                <input
                  ref={inputSearch!}
                  type="text"
                  class="px-8 border border-slate-300 w-full rounded focus:ring-0 focus:outline-none focus:border-slate-500 shadow-sm placeholder-slate-400"
                  placeholder="服务名称"
                  value={decodeURIComponent(searchParams.search ?? '')}
                  onInput={(e) =>
                    setSearchParams({
                      currentPage: 0,
                      search: encodeURIComponent(e.currentTarget.value),
                    })
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

          <div class="w-full overflow-x-auto ">
            <table class="w-full text-left min-w-max">
              <thead>
                <tr class="border-b">
                  <th class="p-3">名称</th>
                  <th class="p-3">预估时长</th>
                  <th class="p-3">普通价格（元）</th>
                  <th class="p-3">会员价格（元）</th>
                  <th class="p-3">添加时间</th>
                </tr>
              </thead>
              <tbody>
                <For each={serviceTypesResult()?.data}>
                  {(row) => (
                    <tr
                      class="border-b hover:bg-gray-100 cursor-pointer"
                      onClick={[goToServiceTypeInfo, row.serviceTypeId]}
                    >
                      <td class="p-3">{row.name}</td>
                      <td class="p-3">
                        {Math.trunc(row.estimatedDuration / 60) > 0
                          ? `${Math.trunc(row.estimatedDuration / 60)} 小时${
                              row.estimatedDuration % 60 === 0
                                ? ''
                                : ` ${row.estimatedDuration % 60}分钟`
                            }`
                          : `${row.estimatedDuration % 60} 分钟`}
                      </td>
                      <td class="p-3">{row.normalPrize}</td>
                      <td class="p-3">{row.memberPrize}</td>
                      <td class="p-3">{row.createTime}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <Show when={serviceTypesResult()?.totalCount! > 0}>
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
                  serviceTypesResult()?.totalCount!
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
export default ServiceTypes;
