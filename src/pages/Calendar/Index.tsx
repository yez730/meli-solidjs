import { type Component, Suspense, createResource, For } from "solid-js";
import {A,useNavigate,useSearchParams} from "@solidjs/router";
import { getBarbers } from '../../utils/api';
import moment from "moment";
import { HiOutlineHeart } from 'solid-icons/hi';

const Index: Component = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [barbers]=createResource(async ()=>await getBarbers(''));

    const navigate=useNavigate();
    const addAppointment=()=>{
        let currentDate=moment().format('YYYY-MM-DDTHH:mm');
        if(Number(currentDate.slice(-1))<5){
            currentDate=currentDate.slice(0, -1) + '0';
        }else{
            currentDate=currentDate.slice(0, -1) + '5';
        }

        let path=`/appointment-add?viewType=week&currentDate=${encodeURIComponent(currentDate)}`;
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
            <select onChange={e=>setSearchParams({"barberId":e.currentTarget.value})} class="rounded text-sm h-full w-full border-transparent focus:border-transparent focus:ring-0 appearance-none block
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
        {/* <Calendar bind:this={ec} {plugins} {options} /> */}
    </div>
    <div class="w-0 h-0 ec-event"></div>
</div>


    );
};
export default Index;
