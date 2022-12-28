import { type Component, Suspense, onMount, createSignal } from "solid-js";
import MemberDropdown from "./MemberDropdown";
import {useNavigate} from "@solidjs/router";

const MemberFullDropdown: Component<{
        setBinding:(id:string,name:string)=>void,
        hide:()=>void,
        addMember:()=>void,
    }> = (props) => {
        const [search,setSearch]=createSignal("");

        onMount(()=>{
            fullInput!.focus();
        });

        let fullInput:HTMLInputElement|undefined;
        let divDropdown:HTMLDivElement|undefined;

        const handleSelected=(id:string,name:string)=>{
          props.setBinding(id,name);
          
          props.hide();
      }
    return (
    <div class="flex lg:hidden flex-col bg-white max-h-screen overflow-y-hidden">
        <div class="flex-none flex flex-row items-center justify-start h-12 p-2">
          <button class="relative w-10 h-10 hover:bg-slate-300/40" onClick={props.hide}  >
            <svg xmlns="http://www.w3.org/2000/svg" class="lg:hidden absolute z-20 right-2 top-2 h-6 w-6 stroke-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="grow flex flex-col items-center overflow-y-hidden">
          <div class="flex-none relative w-full p-2" onClick={(e)=>{
            setSearch("");
        }}   >
            <input type="text" ref={fullInput!} value={search()} onInput={(e)=>{
            setSearch(e.currentTarget.value);
        }} placeholder="输入手机号或姓名搜索客户"  class="text-sm py-3 pr-8 block w-full cursor-pointer text-gray-900 rounded border border-gray-500 sm:text-md " />
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-4 top-5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
          </div>
    
          <div class="flex-none flex flex-row justify-center items-center gap-2 w-full border-b pb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 stroke-blue-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <button onClick={props.addMember} class=" text-blue-500 text-sm hover:underline hover:underline-offset-4 ">添加客户</button>
           </div>
    
          <div ref={divDropdown!} onMouseDown={(e)=>e.preventDefault()} class="grow overflow-y-auto w-full bg-white rounded divide-y divide-gray-100 shadow-xl">
            <MemberDropdown handleSelected={handleSelected} scrollElement={divDropdown!} search={search}></MemberDropdown>
          </div>
        </div>
      </div>
    
    );
};
export default MemberFullDropdown;
