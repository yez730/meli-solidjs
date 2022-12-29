import { type Component, Suspense, createResource, For ,onMount, createSignal, createMemo, createEffect} from "solid-js";
import { useNavigate,useSearchParams} from "@solidjs/router";
import { getAppointments, getBarbers } from '../../utils/api';
import moment from "moment";
import { HiOutlineHeart } from 'solid-icons/hi';
import { Calendar, type CalendarOptions,type EventInput } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction'
import cnLocale from '@fullcalendar/core/locales/zh-cn';

const Index: Component = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [barbers]=createResource(async ()=>await getBarbers(''));
    const navigate=useNavigate();

    let elementRef: HTMLDivElement|undefined;
    let calendar:Calendar|undefined;
    onMount(() => {
        calendar=new Calendar(elementRef!, {
            height:'100%',
            plugins: [timeGridPlugin,interactionPlugin],
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            initialView: "timeGridWeek",
            allDaySlot:false,
            locale: cnLocale,
            dateClick:function (dateClickInfo){
                let path=`/appointment-add?currentDate=${encodeURIComponent(moment(dateClickInfo.dateStr).format('YYYY-MM-DDTHH:mm'))}`;
                if (searchParams.barberId){
                    path+=`&barberId=${searchParams.barberId}`
                }
                navigate(path);
            },
            initialDate:searchParams.currentDate ?? moment().format('YYYY-MM-DDTHH:mm'),
            eventClick:function (eventClickInfo) {
                let path=`/appointment-show?id=${eventClickInfo.event.id}`;
                if (searchParams.barberId){
                    path+=`&barberId=${searchParams.barberId}`
                }
                navigate(path);
            },
            eventMouseEnter:function (a){
                //TODO console.log(a)
            },
            eventMouseLeave:function (a){
                //TODO console.log(a)
            },
            eventSources:[{events:function(fetchInfo, successCallback, failureCallback) { 
                let start= moment(fetchInfo.startStr).format();
                let end= moment(fetchInfo.endStr).format();
                return getAppointments(start,end,searchParams.barberId ??"");
            }}],
            eventContent:function (info) {
                let eventHtml=
                `<div class="overflow-hidden h-full cursor-pointer flex flex-col">
                    <div class="flex flex-row items-center">
                        <span class="text-slate-600 font-thin text-xs flex-none">服务时间:</span>
                        <span class="text-slate-900">${info.timeText}</span>
                    </div>
                    <div class="flex flex-row items-center">
                        <span class="text-slate-600 font-thin text-xs flex-none">顾客信息:</span>
                        <span class="text-slate-900">${info.event.extendedProps.customer==="walk-in"?"进店顾客":info.event.extendedProps.customer}</span>
                    </div>
                    <div class="flex flex-row items-center">
                        <span class="text-slate-600 font-thin text-xs flex-none">理发师:</span>
                        <span class="text-slate-900">${info.event.extendedProps.barberName}</span>
                    </div>
                    <div class="flex flex-row items-center">
                        <span class="text-slate-600 font-thin text-xs flex-none">服务类型:</span>
                        <span class="text-slate-900">${info.event.extendedProps.serviceName}</span>
                    </div>
                </div>`;
              
                return  { html: eventHtml}
            },
            firstDay:1,
            scrollTime: '09:00:00',
            views: {
                timeGridWeek: { pointer: true },
            },
            dayMaxEvents: true,
            nowIndicator: true,
            eventStartEditable:true,
            eventDurationEditable:true,
        });
        calendar.render();
    });

    const refresh=()=>{
        calendar?.refetchEvents();
    }

    const addAppointment=()=>{
        let currentDate=moment().format('YYYY-MM-DDTHH:mm');
        if(Number(currentDate.slice(-1))<5){
            currentDate=currentDate.slice(0, -1) + '0';
        }else{
            currentDate=currentDate.slice(0, -1) + '5';
        }

        let path=`/appointment-add?currentDate=${encodeURIComponent(currentDate)}`;
        if (searchParams.barberId){
            path+=`&barberId=${searchParams.barberId}`
        }
        navigate(path);
    }
    return (
<div class="flex flex-col overflow-y-hidden p-2">
    <div class="flex flex-col xs:flex-row xs:items-center justify-between gap-2 px-4 bg-gray-50 py-3">
        <div class="flex flex-row items-center gap-1 h-10 text-sm bg-white rounded border border-gray-500 focus-within:border-2 focus-within:border-blue-600 focus-within:outline-none">
            <HiOutlineHeart class="ml-2 w-6 h-6 stroke-slate-400" stroke-width={1.5}/>
            <select onChange={e=>{
                setSearchParams({"barberId":e.currentTarget.value});
                queueMicrotask(()=>refresh());
            }} class="rounded text-sm h-full w-full border-transparent focus:border-transparent focus:ring-0 appearance-none block
                font-normal text-slate-500  
                transition ease-in-out">
                <option value=''>--全部--</option>
                <For each={barbers()}>{barber=>
                 <option value={barber.barberId} selected={searchParams.barberId===barber.barberId}>
                    {barber.realName}
                </option>
                }</For>
            </select>
        </div>
        <div>
            <button class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white" onClick={addAppointment}>添加</button>
        </div>
    </div>
 
    <div class="w-full overflow-y-hidden p-2 h-screen bg-white">
        <div ref={elementRef!}></div>
    </div>
    <div class="w-0 h-0 ec-event"></div>
</div>

    );
};
export default Index;
