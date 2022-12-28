import { type Component, Suspense, createSignal, Show, createEffect, on, batch } from "solid-js";
import { Portal } from "solid-js/web";
import MemberDropdown from "./MemberDropdown";
import clickOutside from "../../../directives/clickOutside";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';
import {useNavigate} from "@solidjs/router";

const MemberLargeDropdownSide: Component<{
    amount:number,
    duration:number,
    memberId:string,
    realName:string,
    setBinding:(id:string,name:string)=>void,
    addMember:()=>void,
    checkout:()=>void,
}> = (props) => {
    const [isDropdownShow,setIsDropdownShow]=createSignal(false);
    const [search,setSearch]=createSignal("");
    const [isModalShow,setIsModalShow]=createSignal(false);
    const [removeViewVisable,setRemoveViewVisable]=createSignal(false);

    let div:HTMLDivElement|undefined;
    let divDropdown:HTMLDivElement|undefined;
    let input:HTMLInputElement|undefined;
    let divAdd:HTMLDivElement|undefined;
    let btnRemoveView:HTMLButtonElement|undefined;
    
    const handleDivClick=()=>{
        setSearch("");
        setIsDropdownShow(true);
        setIsModalShow(true);

        document.addEventListener('click', handleClickOutside, true);
    }
    const handleClickOutside=(event:MouseEvent) => {
        if (!div!.contains(event.target as Node) && !event.defaultPrevented) {
            if (divDropdown!.contains(event.target as Node) || divAdd!.contains(event.target as Node)) {
                return;
            }

            setIsDropdownShow(false);
            setIsModalShow(false);
            if(props.memberId){
                setSearch(decodeURIComponent(props.realName));
            }else {
                setSearch("");
            }
    
            document.removeEventListener('click', handleClickOutside, true);
        };
    }
      
    window.matchMedia(`(max-width: ${(resolveConfig(tailwindConfig) as any).theme!.screens?.['lg']})`).addEventListener("change",(e)=>{
        if (e.matches){
            document.removeEventListener('click', handleClickOutside, true);
            setIsDropdownShow(false);
            setIsModalShow(false);
            setRemoveViewVisable(false);
        }
    });

    const removeAppointmentMember=()=>{
        setRemoveViewVisable(false);
        setSearch("");
        props.setBinding("","");
    }

    const handleSelected=(id:string,name:string)=>{
        props.setBinding(id,name);
        
        setIsDropdownShow(false);
        setIsModalShow(false);
        setSearch(name);
        
        document.removeEventListener('click', handleClickOutside, true);
  
        input!.blur();
    }

    return (
<>
<Show when={isModalShow()}>
    <Portal mount={document.getElementById("appointmentAddIsModalShow") as Node}>
        <div class="hidden lg:block absolute inset-0 bg-black/10 z-10" />
    </Portal>
</Show>
<Show when={props.memberId} fallback={
    <>
    <div class="flex-none flex flex-row w-full">
        <span class="mx-auto text-lg pt-4 font-bold text-slate-700">添加客户</span>
    </div>
    <div ref={div!} onClick={handleDivClick} class="flex-none relative w-full px-2 py-4" >
        <input type="text" ref={input!} onInput={e=>setSearch(e.currentTarget.value)} value={search()}  placeholder="输入手机号或姓名搜索客户"  class="text-base py-3 pr-8 block w-full cursor-pointer text-gray-900 rounded border border-gray-500 sm:text-md " />
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-4 top-8 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
    </div>
    </>
}>
<div class="flex-none flex flex-row w-full">
    <span class="mx-auto text-lg pt-4 font-bold text-slate-700">客户信息</span>
  </div>
  <div class="flex-none flex flex-row w-full px-2 py-4 justify-between items-center border-b border-b-none relative">
    <div class="flex flex-row items-center gap-2">
      <span class="ml-2">{ props.realName.length>10 ? props.realName.substring(0,10)+'..':props.realName}</span>
      {/* <span class="text-sm text-slate-400 ">13764197590</span> */}
    </div>
    <button ref={btnRemoveView!} class="self-start p-1 hover:bg-slate-200" onClick={()=>setRemoveViewVisable(v=>!v)}> 
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-slate-500">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    </button>

    <Show when={removeViewVisable()}>
    <div use:clickOutside={[()=>setRemoveViewVisable(false),btnRemoveView!]} class="absolute flex flex-row justify-between items-center px-2 right-8 top-12 bg-white border-b-slate-300 border  rounded-sm hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"  class="w-4 h-4 stroke-red-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>   
        <button class="w-24 h-10 px-1 text-sm text-red-600" onClick={removeAppointmentMember}>从收银中移除</button>
      </div>
    </Show>
  </div>
</Show>

<Show when={isDropdownShow()} fallback={
    <>
    <Show when={props.memberId} fallback={
        <div class="pl-4 text-sm text-slate-500 w-full">未选择客户则保存为匿名进店顾客</div>
    }>
        <div class="TODO_SELECTED_MEMBER_INFO"></div>
    </Show>

    <div class="grow">
    </div>
    <div class="flex flex-col w-full gap-4 items-center border-t p-4">
    <span class="text-lg">总金额：{props.amount}￥（{Math.trunc(props.duration / 60) >0 ?`${ Math.trunc(props.duration / 60)} 小时${props.duration % 60===0?"": " "+props.duration % 60+ "分钟"  }`:`${props.duration % 60} 分钟` }）</span>
    <button class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white" onClick={props.checkout}>结算</button>
    </div>
    </>
}>
    <>
    <div ref={divAdd!} class="flex flex-row justify-center items-center gap-2 w-full border-b pb-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 stroke-blue-500">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    <button onClick={props.addMember} class="text-blue-500 text-sm hover:underline hover:underline-offset-4 ">添加客户</button>
    </div>
        <div class="grow overflow-y-hidden w-full">
        <div ref={divDropdown!} onMouseDown={(e)=>e.preventDefault()} class="h-full overflow-y-auto w-full bg-white rounded divide-y divide-gray-100 shadow-xl">
            <MemberDropdown handleSelected={handleSelected} scrollElement={divDropdown!} search={search}></MemberDropdown>
        </div>
        </div>
    </>
</Show>

</>
    );
};

export default MemberLargeDropdownSide;
