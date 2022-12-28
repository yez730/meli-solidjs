import { type Component, Suspense, createSignal, onMount } from "solid-js";
import ServiceTypeDropdown from "./ServiceTypeDropdown";

const ServiceTypeFullDropdown: Component<{
    setBinding:(id:string,name:string,duration:number,normalPrize:number,memberPrize:number)=>void,
    hide:()=>void,
}>  = (props) => {
    const [search,setSearch]=createSignal("");
    
    onMount(()=>{
        fullInput!.focus();
    });
    
    let fullInput:HTMLInputElement|undefined;
    let divDropdown:HTMLDivElement|undefined;

    const handleSelected=(id:string,name:string,duration:number,normalPrize:number,memberPrize:number)=>{
        props.setBinding(
            id,
            `${name}（${Math.trunc(duration / 60) >0 ?`${ Math.trunc(duration / 60)} 小时${duration % 60===0?"": " "+duration % 60+ "分钟"  }`:`${duration % 60} 分钟`}，普通价:${normalPrize}￥/会员价:${memberPrize}￥）`,
            duration,
            normalPrize,
            memberPrize,);
        
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
          <div class="relative w-full p-2" onClick={(e)=>{
                setSearch("");
            }}  >
            <input type="text" ref={fullInput!} value={search()} onInput={(e)=>{
                setSearch(e.currentTarget.value);
            }}  placeholder="搜索服务类型"  class="py-3 pr-8 block w-full cursor-pointer text-gray-900 rounded border border-gray-500 sm:text-md " />
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-4 top-6 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
          </div>
          
          <div ref={divDropdown!} onMouseDown={e=>e.preventDefault()}  class="grow overflow-y-auto w-full bg-white rounded divide-y divide-gray-100 shadow-xl">
            <ServiceTypeDropdown handleSelected={handleSelected} scrollElement={divDropdown!} search={search}></ServiceTypeDropdown>
          </div>
        </div>
    </div>
    );
};
export default ServiceTypeFullDropdown;
