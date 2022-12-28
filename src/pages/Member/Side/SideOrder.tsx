import { type Component, Suspense, createSignal, createResource, Show, For, createMemo } from "solid-js";
import InfiniteScroll from "../../../common/InfiniteScroll"
import { getOrdersByMemberId} from "../../../utils/api";
import type { StatisticOrderType } from "../../../types";

const SideOrder: Component<{memberId:string}> = (props) => {
    const [page,setPage]=createSignal(0);
    const pageSize=30;
    const [newBatch]=createResource(
        page,
        async ()=>await (await getOrdersByMemberId(props.memberId,page(),pageSize)).data
    );
    
    let data:StatisticOrderType[] = [];
    
    const allData=createMemo(()=>{
        data=[
          ...data,
          ...newBatch() ?? []
        ]
        return data;
      });

    return (
    <div class="h-full flex flex-col">
        <div class="flex flex-row pt-8 pl-8">
            <span class="text-xl font-semibold">消费记录</span>
        </div>
        <div class="grow h-full overflow-y-auto flex flex-col gap-4 mt-4" >
            <Suspense fallback={<p class="p-3 text-sm text-slate-400 text-center">加载中</p>}>
                <Show when={allData().length>0} fallback={
                    <p class="p-3 text-sm text-slate-400 text-center">暂无数据</p>
                }>
                    <For each={allData()}>{row=>
                    <div class="flex flex-col gap-2 mx-2 sm:mx-8">
                    <div class="rounded-md border bg-white flex flex-col p-4 gap-2">
                        <div class="flex flex-row items-center justify-between"><span class="text-xl font-semibold">{row.serviceName}</span><span class="text-base font-semibold">{row.amount}￥</span></div>
                        <div class="text-xs">
                          由<span class="text-slate-500 text-sm" style="margin-left: 1px; margin-right: 1px;">{row.barberName}</span>理发
                        </div>
                        <div class="flex flex-row justify-between items-center">
                          <span class="text-slate-500 text-sm">{row.createTime}</span>
                          <span class="inline text-slate-500 text-sm">共 {Math.trunc(row.totalMinutes / 60) >0 ?`${ Math.trunc(row.totalMinutes / 60)} 小时${row.totalMinutes % 60===0?"": " "+row.totalMinutes % 60+ "分钟"  }`:`${row.totalMinutes % 60} 分钟`}</span>
                        </div>
                    </div>
                </div>
                    }</For>
                    <InfiniteScroll
                  hasMore={newBatch()!.length>0}
                  threshold={100}
                  loadMore={() =>setPage(p=>p+1)} />
                
                </Show>
            </Suspense>
        </div>
    </div>
    
    );
};
export default SideOrder;
