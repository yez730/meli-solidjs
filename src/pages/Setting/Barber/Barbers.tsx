import { type Component, Suspense,createResource, Show, For } from "solid-js";
import type { Barber} from '../../../types'
import { getBarbers } from '../../../utils/api';
import {useSearchParams,useNavigate} from "@solidjs/router";
import { HiOutlineX,HiOutlineSearch } from 'solid-icons/hi';

const Barbers: Component = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let inputSearch:HTMLInputElement | undefined;
    
    const [barbersResult]=createResource(
        ()=>[searchParams.search], 
        async ()=>{
            if (decodeURIComponent(searchParams.search??"")){
                inputSearch?.focus()
            }   
            return await getBarbers(decodeURIComponent(searchParams.search??""));
        }
    );

    const navigate=useNavigate();
    
    const addBarber=()=>{
        navigate("/barber-info");
    }

    const closeSearch=()=>{
        setSearchParams({search:encodeURIComponent("")})
        inputSearch!.focus();
    }

    const goToBarber=(barberId:string)=>{
        navigate("/barber-info?barberId="+barberId); 
    }

    return (
<div class=" overflow-y-auto p-2">
    <div class="mx-auto max-w-screen-lg flex flex-col  bg-white p-2">
        <div class="flex xs:flex-row flex-col gap-2 py-2 lg:py-3 px-3 justify-between xs:items-center">
            <div>
                <span class="text-lg lg:text-xl px-2 font-semibold text-slate-600">理发师列表</span>
                <span class="text-sm text-slate-500">共 {barbersResult()?.length} 项</span>
            </div> 
            <button class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white" onClick={addBarber}>添加理发师</button>
        </div>
        <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between  gap-2 px-4 bg-slate-100 py-3 rounded">
            <div class="flex flex-col xs:flex-row gap-1 xs:gap-4">
                <div class="relative max-w-sm">
                    <input ref={inputSearch!} type="text" class="px-10 border border-slate-300 w-full rounded-3xl focus:ring-0 pr-8 focus:outline-none focus:border-slate-500 shadow-sm placeholder-slate-400" placeholder="理发师姓名/手机号" value={decodeURIComponent(searchParams.search??"")} onInput={e=>setSearchParams({search:encodeURIComponent(e.currentTarget.value)})}/>
                    <HiOutlineSearch class="absolute left-2 top-3 h-4 w-4 stroke-slate-200"/>
                    <Show when={decodeURIComponent(searchParams.search??"")}>
                        <HiOutlineX class="absolute right-3 top-3 h-4 w-4 cursor-pointer" onClick={closeSearch} />
                    </Show>
                </div>
            </div>
        </div>
        
        <div class="w-full overflow-x-auto ">
            <table class="w-full text-left min-w-max mb-8">
                <thead>
                <tr class="border-b">
                    <th class="p-3">姓名</th>
                    <th class="p-3">手机号</th>
                    <th class="p-3">邮箱</th>
                    <th class="p-3">添加时间</th>
                </tr>
                </thead>
                <tbody>
                <For each={barbersResult()}>{row=>
                    <tr class="border-b hover:bg-gray-100 cursor-pointer" onClick={[goToBarber,row.barberId]}>
                        <td class="p-3">{row.realName}</td>
                            <td class="p-3">{row.cellphone}</td>
                            <td class="p-3">{row?.email? row.email:'' }</td>
                            <td class="p-3">{row.createTime}</td>
                    </tr>
                    }</For>
                </tbody>
            </table>      
        </div>
    </div>
    
</div>
    );
};
export default Barbers;