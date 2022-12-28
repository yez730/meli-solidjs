import { type Component, Suspense, createSignal, Show, For, createResource } from "solid-js";
import MemberFullDropdown from "./MemberDropdown/MemberFullDropdown";
import ServiceTypeFullDropdown from "./ServiceTypeDropdown/ServiceTypeFullDropdown";
import { type Params, useSearchParams,useNavigate,useLocation} from "@solidjs/router";
import moment from "moment";
import MemberLargeDropdownSide from "./MemberDropdown/MemberLargeDropdownSide";
import clickOutside from "../../directives/clickOutside";
import { startTimeList,durationList } from '../../utils/common';
import ServiceTypeLargeDropdown from "./ServiceTypeDropdown/ServiceTypeLargeDropdown";
import { addAppointment, getBarbers } from "../../utils/api";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';
import toast from 'solid-toast';
import { type NewAppointment } from "../../types";

const AppointmentAdd: Component = () => {
    const [isMemberFullDropdownShow,setIsMemberFullDropdownShow]=createSignal(false);
    const [isServiceTypeFullDropdownShow,setIsServiceTypeFullDropdownShow]=createSignal(false);
    const [isDivMainShow,setIsDivMainShow]=createSignal(true);
    const [removeMemberViewVisable,setRemoveMemberViewVisable]=createSignal(false);
    const [searchParams, setSearchParams] = useSearchParams();
    
    let btnRemoveView:HTMLButtonElement|undefined;

    const [barbars]=createResource(async ()=>await getBarbers(''));

    const navigate=useNavigate();
    const addMember=()=>{
        let search=Object.entries(searchParams).reduce((acc , cur) => {
            //TODO searchParams values 自动恢复编码？
            if (cur[0]==="currentDate" || cur[0]==="serviceTypeName"||cur[0]==="remark"){
                acc += `${cur[0]}=${encodeURIComponent(cur[1])}&`;
            }else{
                acc += `${cur[0]}=${cur[1]}&`;
            }
            return acc;
        }, "?").slice(0, -1);
        navigate("/member-info"+search+"&fromCalendarAdd=true");
    }

    const back=()=>{
        let path=`/calendar?viewType=${searchParams.viewType}&currentDate=${encodeURIComponent(searchParams.currentDate)}`;
        if (searchParams.barberId){
            path+=`&barberId=${searchParams.barberId}`
        } 
        navigate(path);
    }

    const checkout= async ()=>{
        let start=moment(moment(decodeURIComponent(searchParams.currentDate)).format('YYYY-MM-DD')+' '+moment(decodeURIComponent(searchParams.currentDate)).format('HH:mm'));
        let startStr=start.format();
        
        let end=start.add(searchParams.duration as unknown as number,'minutes');
        let endStr=end.format();
        
        if(!searchParams.serviceTypeId){
            toast.error("请选择服务类型");
          return;
        }
       
        if (!searchParams.barberId){
            toast.error("请选择理发师");
          return;
        }
        
        let appointment:NewAppointment={
          startTime:startStr,
          endTime:endStr,
          serviceTypeId:searchParams.serviceTypeId,
          barberId:searchParams.barberId,
          memberId: searchParams.memberId==='' ? undefined : searchParams.memberId,
          paymentType:searchParams.memberId? 'member':'cash',
          amount:searchParams.memberId?searchParams.memberPrize as unknown as number:searchParams.normalPrize as unknown as number,
          remark:decodeURIComponent(searchParams.remark),
        };
        let res=await addAppointment(appointment);
        if (res.ok){
        toast.success("添加成功");
          back();
        } else {
            toast.error("添加失败");
        }
    }

    window.matchMedia(`(min-width: ${(resolveConfig(tailwindConfig) as any).theme!.screens?.['lg']})`).addEventListener("change",(e)=>{
        if (e.matches){
            setIsMemberFullDropdownShow(false);
            setRemoveMemberViewVisable(false);
            setIsServiceTypeFullDropdownShow(false);
            setIsDivMainShow(true);
        }
    });

    return (
<>
<Show when={isMemberFullDropdownShow()}>
    <MemberFullDropdown setBinding={(memberId,memberName)=>setSearchParams({"memberId":memberId,"memberName":encodeURIComponent(memberName)})} hide={()=>{
        setIsDivMainShow(true);
        setIsMemberFullDropdownShow(false);
    }} addMember={addMember}></MemberFullDropdown>
</Show>
<Show when={isServiceTypeFullDropdownShow()}>
    <ServiceTypeFullDropdown setBinding={(serviceTypeId,serviceTypeName,duration,normalPrize,memberPrize)=>setSearchParams({
        "serviceTypeId":serviceTypeId,
        "serviceTypeName":encodeURIComponent(serviceTypeName),
        "duration":duration,
        "normalPrize":normalPrize,
        "memberPrize":memberPrize
        })} hide={()=>{
            setIsDivMainShow(true);
            setIsServiceTypeFullDropdownShow(false);
        }}></ServiceTypeFullDropdown>
</Show>
<Show when={isDivMainShow()}>
<div class="flex flex-col bg-white max-h-screen">
    <div class="flex-none flex flex-row border-b-slate-300 border-b xs:p-4 p-2">
      <div class="grow flex flex-col justify-center items-center">
        <span class="text-2xl font-semibold">新建订单</span>
      </div>
      <button class="hover:bg-slate-300/40" onClick={back}  >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 stroke-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div id="appointmentAddIsModalShow" class="grow flex lg:flex-row flex-col relative h-screen lg:overflow-y-hidden overflow-y-auto overflow-x-hidden">
      <div class="flex-none hidden lg:flex flex-col order-1 h-full xl:max-w-sm max-w-xs w-full z-20 items-center border-l border-l-slate-300 overflow-hidden bg-white">
        <MemberLargeDropdownSide amount={searchParams.memberId?searchParams.memberPrize as unknown as number:searchParams.normalPrize as unknown as number} 
            duration={searchParams.duration as unknown as number} 
            memberId={searchParams.memberId} 
            realName={decodeURIComponent(searchParams.memberName??"")} 
            setBinding={(id,name) =>{setSearchParams({"memberId":id,"memberName":encodeURIComponent(name)});}} 
            addMember={addMember}
            checkout={checkout}></MemberLargeDropdownSide>
      </div>
      
      <div class="grow relative lg:overflow-y-auto">
          <div class="lg:mx-auto lg:max-w-3xl w-full my-4 flex flex-col gap-6 px-2">
            <span class="text-lg lg:text-xl px-2 font-bold text-slate-700">{ moment(decodeURIComponent(searchParams.currentDate)).format('YYYY年MM月DD日')}</span>
              <Show when={searchParams.memberId} fallback={
                <div class="lg:hidden flex flex-col w-full px-2 gap-2" onClick={()=>{
                    setIsDivMainShow(false);
                    setIsMemberFullDropdownShow(true);
                }}  >
              <span class="text-gray-600">添加客人</span>
                <div class="relative">
                  <input type="text" readonly placeholder="搜索客户" value={decodeURIComponent(searchParams.memberName??"")} class="py-3 pr-8 block w-full cursor-pointer rounded" />
                  <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-4 top-4 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                </div>
              </div>
              }>
              <div class="lg:hidden flex flex-row w-full px-2 py-0 justify-between items-center relative">
                <div class="flex flex-row items-center">
                  <span class="text-gray-600">客人姓名：</span>
                  <span>{ decodeURIComponent(searchParams.memberName).length>10 ? decodeURIComponent(searchParams.memberName).substring(0,10)+'..':decodeURIComponent(searchParams.memberName)}</span>
                </div>
                <button ref={btnRemoveView!} class="self-start p-1 hover:bg-slate-200" onClick={e=>setRemoveMemberViewVisable(v=>!v)}> 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 stroke-slate-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </button>
                <Show when={removeMemberViewVisable()}>
                <div use:clickOutside={[()=>setRemoveMemberViewVisable(false),btnRemoveView!]} class="absolute flex flex-row justify-between items-center px-2 lg:right-8 lg:top-11 right-6 top-8 bg-white border-b-slate-300 border  rounded-sm hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"  class="w-4 h-4 stroke-red-600">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>   
                    <button class="w-24 h-10 px-1 text-sm text-red-600" onClick={e=>{
                         setRemoveMemberViewVisable(false);
                         setSearchParams({"memberId":undefined,"memberName":undefined})
                    }}>从收银中移除</button>
                  </div>
                </Show>
              </div>
              </Show>

            <div class="flex lg:flex-row flex-col gap-2 w-full px-2">
              <div class="hidden lg:flex flex-col gap-2">
                <span class="text-gray-600">开始时间</span>
                <select onChange={e=>setSearchParams({"currentDate":encodeURIComponent(moment(searchParams.currentDate).format('YYYY-MM-DD')+'T'+e.currentTarget.value)})} class="lg:w-40 h-12 rounded appearance-none block">
                    <For each={startTimeList}>{startTime=>
                     <option value={startTime.value} selected={moment(decodeURIComponent(searchParams.currentDate)).format('HH:mm')===startTime.value}>
                     {startTime.text}
                   </option>
                    }</For>                
                </select>
              </div>
              <div class="flex flex-col w-full gap-2">
                <span class="text-gray-600">服务类型</span>
                <div class="hidden lg:block w-full">
                  <ServiceTypeLargeDropdown id={searchParams.serviceTypeId} 
                    name={searchParams.serviceTypeName}
                    duration={searchParams.duration as unknown as number}
                    normalPrize={searchParams.normalPrize as unknown as number}
                    memberPrize={searchParams.memberPrize as unknown as number}
                    setBinding={(serviceTypeId,serviceTypeName,duration,normalPrize,memberPrize)=>setSearchParams({
                        "serviceTypeId":serviceTypeId,
                        "serviceTypeName":encodeURIComponent(serviceTypeName),
                        "duration":duration,
                        "normalPrize":normalPrize,
                        "memberPrize":memberPrize
                        })} 
                    ></ServiceTypeLargeDropdown>
                </div>

                <div class="block lg:hidden relative" onClick={()=>{
                     setIsDivMainShow(false);
                     setIsServiceTypeFullDropdownShow(true);
                }} >
                  <input type="text" readonly value={decodeURIComponent(searchParams.serviceTypeName??"")}  class="py-3 pr-8 block w-full cursor-pointer rounded border border-gray-500 " />
                  <svg class="absolute right-3 top-3 h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div class="flex lg:flex-row flex-col gap-2 w-full px-2">
              <div class="flex flex-row gap-2">
                <div class="flex lg:hidden flex-col w-full gap-2">
                  <span class="text-gray-600">开始时间</span>
                  <select onChange={e=>setSearchParams({"currentDate":encodeURIComponent(moment(searchParams.currentDate).format('YYYY-MM-DD')+'T'+e.currentTarget.value)})}  class="lg:w-40 h-12 appearance-none block rounded transition ease-in-out ">
                    <For each={startTimeList}>{startTime=>
                    <option value={startTime.value} selected={moment(decodeURIComponent(searchParams.currentDate)).format('HH:mm')===startTime.value}>
                        {startTime.text}
                    </option>
                    }</For>
                  </select>
                </div>
                <div class="flex flex-col w-full gap-2">
                  <span class="text-gray-600">预估时长</span>
                  <select disabled={!searchParams.serviceTypeId} onChange={e=>setSearchParams({"duration":e.currentTarget.value})} class=" disabled:bg-gray-100 lg:w-40 h-12 appearance-none blockbg-clip-padding bg-no-repeat border border-solid border-gray-500 rounded transition ease-in-out">
                    <Show when={searchParams.serviceTypeId}>
                        <For each={durationList}>{duration=>
                         <option value={duration.value} selected={searchParams.duration as unknown as number===duration.value}>
                         {duration.text}
                       </option>
                        }</For>
                    </Show>
                  </select>
                </div>
              </div>

              <div class="flex flex-col w-full gap-2">
                <span class="text-gray-600">理发师</span>
                <div class="flex flex-row items-center gap-1 h-12 rounded border border-gray-500 focus-within:border-2 focus-within:border-blue-600 focus-within:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-1 w-6 h-6 stroke-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <select onChange={e=>setSearchParams({"barberId":e.currentTarget.value})} class="rounded grow h-full w-full border-transparent focus:border-transparent focus:ring-0 appearance-none block transition ease-in-out">
                    <For each={barbars()}>{barber=>
                     <option value={barber.barberId} selected={searchParams.barberId===barber.barberId}>
                        {barber.realName}
                    </option>
                    }</For>
                  </select>
                </div>
              </div>
            </div> 

            <div class="flex lg:flex-row flex-col gap-2 w-full px-2">
              <div class="flex flex-col w-full gap-2">
                <span class="text-gray-600">备注信息</span>
                {/* //TODO length limit */}
                <textarea value={decodeURIComponent(searchParams.remark??"")} onInput={e=>setSearchParams({"remark":encodeURIComponent(e.currentTarget.value)})} class="w-full rounded border"></textarea>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="flex lg:hidden flex-col gap-4 p-4 items-start border-t">
        <span class="text-lg">总金额：{searchParams.memberId?searchParams.memberPrize as unknown as number:searchParams.normalPrize as unknown as number}￥（{Math.trunc(searchParams.duration as unknown as number / 60) >0 ?`${ Math.trunc(searchParams.duration as unknown as number/ 60)} 小时${searchParams.duration as unknown as number% 60===0?"": " "+searchParams.duration as unknown as number % 60+ "分钟"  }`:`${searchParams.duration as unknown as number% 60} 分钟` }）</span>
        <button class="w-24 py-2 bg-black hover:bg-gray-800 rounded text-white" onClick={checkout}>结算</button>
      </div>
  </div>
</Show>
</>
    );
};
export default AppointmentAdd;
