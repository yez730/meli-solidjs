import { type Component, createResource, Show, createSignal, For ,mergeProps,Suspense, createEffect,onMount} from "solid-js";
import {A,useNavigate,useSearchParams,useLocation} from "@solidjs/router";
import { getMembers } from "../../utils/api";
import Filter from "./Filter";
import Side from './Side/Index';
import { HiOutlineSearch,HiOutlineX,HiOutlineChevronLeft,HiOutlineChevronRight } from 'solid-icons/hi';

const Member: Component = () => {
    const [showFilter,setShowFilter]=createSignal(false);
    const [searchParams, setSearchParams] = useSearchParams();
    let inputSearch:HTMLInputElement | undefined;

    const [membersResult]=createResource(
        ()=>[searchParams.currentPage,searchParams.search,searchParams.pageSize,searchParams.filterGender], 
        async ()=>{
            if (decodeURIComponent(searchParams.search??"")){
                inputSearch?.focus()
            }
            return await getMembers(searchParams.currentPage as unknown as number?? 0,searchParams.pageSize as unknown as number ?? 20,decodeURIComponent(searchParams.search??""),decodeURIComponent(searchParams.filterGender??""));
        }
    );

    const navigate=useNavigate();
    const closeSearch=()=>{
        setSearchParams({search:encodeURIComponent(""),currentPage:0})
        inputSearch!.focus();
    }

    const addMember=()=>{
        navigate("/member-info");
    }

    return (
<>
<div class="overflow-y-auto p-2">
    <div class="mx-auto max-w-screen-lg flex flex-col bg-white p-2">
        <div class="flex xs:flex-row flex-col gap-2 py-2 lg:py-3 px-3 justify-between xs:items-center">
            <div>
                <span class="text-lg lg:text-xl px-2 font-semibold text-slate-600">会员列表</span>
                <span class="text-sm text-slate-500">共 {membersResult()?.totalCount} 项</span>
            </div> 
            <button class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white" onClick={addMember}>添加会员</button>
        </div>
        <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between  gap-2 px-4 bg-slate-100 py-3 rounded">
            <div class="flex flex-col xs:flex-row gap-1 xs:gap-4">
                <div class="relative max-w-sm">
                    <input ref={inputSearch!} type="text" class="px-10 border border-slate-300 w-full rounded-3xl focus:ring-0 pr-8 focus:outline-none focus:border-slate-500 shadow-sm placeholder-slate-400" placeholder="手机/姓名" value={decodeURIComponent(searchParams.search??"")} onInput={e=>setSearchParams({currentPage:0,search:encodeURIComponent(e.currentTarget.value)})} />
                    <HiOutlineSearch class="absolute left-2 top-3 h-4 w-4 stroke-slate-400"/>
                    <Show when={decodeURIComponent(searchParams.search)}>
                        <HiOutlineX class="absolute right-3 top-3 h-4 w-4 cursor-pointer"  onClick={closeSearch}  />
                    </Show>
                </div>
                <button class="xs:w-24 w-16 py-1 text-sm xs:text-base xs:py-2 border border-slate-300 bg-white text-black  hover:border-slate-500 rounded-3xl" onClick={()=>setShowFilter(true)}>过滤器</button>
            </div>
            <div class="hidden">
                <button>//TODO 按字段排序</button>
            </div>
        </div>
        
        <div class="w-full overflow-x-auto ">
            <table class="w-full text-left min-w-max">
                <thead>
                <tr class="border-b">
                    <th class="p-3">姓名</th>
                    <th class="p-3">手机号</th>
                    <th class="p-3">性别</th>
                    <th class="p-3">可用余额（元）</th>
                </tr>
                </thead>
                <tbody>
                    <For each={membersResult()?.data}>{ member =>
                        <tr class="border-b hover:bg-gray-100 cursor-pointer" onClick={()=>setSearchParams({memberId:member.memberId})}>
                            <td class="p-3">{member.realName}</td>
                            <td class="p-3">{member.cellphone}</td>
                            <td class="p-3">{member.gender}</td>
                            <td class="p-3">{member.balance}</td>
                        </tr>                    
                    }</For>
                </tbody>
            </table>      
        </div>
        
        <Show when={membersResult()?.totalCount ?? 0>0}>
            <div class="flex flex-row gap-2 justify-center py-2">
                <Show when={Number((searchParams.currentPage as unknown as number ?? 0).toString())>0}>
                    <button class="rounded cursor-pointer disabled:cursor-default border border-slate-300 stroke-slate-300 hover:stroke-slate-500 hover:border-slate-500" onClick={()=>{
                        setSearchParams({currentPage:Number((searchParams.currentPage as unknown as number ?? 0).toString()) - 1})
                    }}>
                        <HiOutlineChevronLeft class="w-10 h-6 stroke-slate-400"/>
                    </button>
                </Show>
                <Show when={ (Number((searchParams.currentPage as unknown as number ?? 0).toString())+1) * Number((searchParams.pageSize as unknown as number ?? 20).toString()) < Number(membersResult()?.totalCount.toString())}>
                    <button class="rounded cursor-pointer disabled:cursor-default border border-slate-300 stroke-slate-300 hover:stroke-slate-500 hover:border-slate-500"  onClick={()=>{
                        setSearchParams({currentPage:Number((searchParams.currentPage as unknown as number ?? 0).toString()) + 1})
                    }}>
                       <HiOutlineChevronRight class="w-10 h-6 stroke-slate-400"/>
                    </button>
                </Show>
            </div>
        </Show>
    </div>
</div>
<Show when={showFilter()}>
    <Filter setShowFilter={setShowFilter}></Filter>
</Show>
<Show when={searchParams.memberId}>
    <Side></Side>
</Show>
</>

    );
};
export default Member;
