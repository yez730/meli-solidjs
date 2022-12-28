import { useSearchParams } from "@solidjs/router";
import { type Component, Suspense, onMount, onCleanup } from "solid-js";
import { HiOutlineX } from 'solid-icons/hi';

const Filter: Component<{
  setShowFilter:(show:boolean) => void
}> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    let filterGender:string="";

    const handleKeyDown=({key}:KeyboardEvent)=>{
        if (key === 'Escape') {
          props.setShowFilter(false);
        }
    }

    onMount(()=>{
        window.addEventListener("keyup", handleKeyDown);
    });

    onCleanup(()=>{
        window.removeEventListener("keyup", handleKeyDown);
    });
  
    return (
        <div class="fixed inset-0 bg-black/20 z-20 flex flex-col">
    <div class="mx-auto sm:my-auto sm:max-w-md w-full h-full overflow-y-auto sm:h-auto flex flex-col bg-white rounded">
        <div class="flex-none w-full flex flex-row justify-between items-center border-b py-4 px-4">
            <span class="text-lg font-semibold">过滤器</span>
            <button class="border-none hover:bg-slate-100"  onClick={()=>props.setShowFilter(false)}>
              <HiOutlineX class="h-8 w-8 stroke-1" />
          </button>
        </div>
        
        <div class="w-full sm:grow-0 grow flex flex-col pt-4 pb-6 px-4">
          <div class="flex flex-col gap-2">
            <span class="">性别</span>
            <select class="rounded" onChange={e=>filterGender= e.currentTarget.value}>
              <option value="">全部</option>
              <option value="男" selected={decodeURIComponent(searchParams.filterGender)==="男"}>男</option>
              <option value="女" selected={decodeURIComponent(searchParams.filterGender)==="女"}>女</option>
            </select>
          </div>
        </div>

        <div class="flex-none w-full flex flex-col xxs:flex-row justify-between border-t px-4 py-2 items-center">
          <button class="text-blue-500 text-sm hover:underline hover:underline-offset-4" onClick={()=>{
                setSearchParams({filterGender:undefined});
                props.setShowFilter(false);
            }}>重置</button>
          <div class="flex flex-col xxs:flex-row  gap-2">
            <button class="w-24 py-2 border border-slate-300  bg-white hover:border-slate-500 rounded text-black" onClick={()=>props.setShowFilter(false)}>取消</button>
            <button class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white" onClick={()=>{
                setSearchParams({filterGender:encodeURIComponent(filterGender)});
                props.setShowFilter(false);
            }}>应用</button>
          </div>
      </div>
    </div>
</div>
    );
};

export default Filter;
