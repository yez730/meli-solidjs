import { type Component, onMount,createSignal, Show, For } from "solid-js";
import type { NewServiceType} from '../../../types'
import { getServiceType, updateServiceType,addServiceType,deleteServiceType } from '../../../utils/api';
import {useSearchParams,useNavigate} from "@solidjs/router";
import { durationList } from '../../../utils/common';
import Alert from "../../../common/Alert";
import { HiOutlineX } from 'solid-icons/hi';
import toast from 'solid-toast';

const ServiceTypeInfo: Component = () => {
    const [searchParams] = useSearchParams();
    const [showAlert,setShowAlert]=createSignal(false);

    const [name,setName]=createSignal("");
    const [estimatedDuration,setEstimatedDuration]=createSignal<number|undefined>();
    const [normalPrize,setNormalPrize]=createSignal<number|undefined>();
    const [memberPrize,setMemberPrize]=createSignal<number|undefined>();

    onMount(async ()=>{
        if(searchParams.serviceTypeId){
            const serviceType=await getServiceType(searchParams.serviceTypeId);
    
            setName(serviceType.name);
            setEstimatedDuration(serviceType.estimatedDuration)
            setNormalPrize(serviceType.normalPrize)
            setMemberPrize(serviceType.memberPrize);
          }
    });

    const navigate=useNavigate();

    const back=()=>{
        navigate("/service-types"); //TODO keep currentPage/pageSize/search
    }

    const save=async()=>{
        if (!name()){
          toast.error("请输入服务名");
            return;
        }
    
        if(!estimatedDuration()){
          toast.error("请输入预估时长");
          return;
        }
    
        if (Number.isNaN(Number(estimatedDuration()))){
          toast.error("预估时长需为数字");
          return;
        }
    
        if (!normalPrize()){
          toast.error("请输入正常价格");
            return;
        }
    
        if(!memberPrize()){
          toast.error("请输入会员价格");
          return;
        }
    
        if (Number.isNaN(Number(normalPrize())) || Number.isNaN(Number(memberPrize()))){
          toast.error("价格需为数字");
          return;
        }
    
        let serviceType:NewServiceType={
            name:name(),
            estimatedDuration:Number(estimatedDuration()), //TODO 类型丢失bug
            normalPrize:Number(normalPrize()),
            memberPrize:Number(memberPrize()),
          };
        
        if(searchParams.serviceTypeId){
          let res=await updateServiceType(searchParams.serviceTypeId , serviceType);
          if (res.ok){
            toast.success("修改成功");
    
            navigate("/service-type-info?serviceTypeId="+searchParams.serviceTypeId);
            
          } else {
            toast.error("修改失败 "+res.msg);
          }
    
        } else{
          let res=await addServiceType(serviceType);
    
          if (res.ok){
            toast.success("添加成功");
    
            navigate("/service-types");//?currentPage="+searchParams.currentPage //TODO keep currentPage/.../
          } else {
            toast.error("添加失败 "+res.msg);
          }
        }
    }

    const onDeleteConfirm=async ()=>{
        let res=await deleteServiceType(searchParams.serviceTypeId);
        if(res.ok){
            navigate("/service-types");
          
            toast.error('删除成功')
        } else{
          toast.error('删除失败'+res.msg)
        }
    }

    return (
<>
<div class="flex flex-col max-h-screen bg-white m-2 p-2 pb-4">
  <div class="flex flex-col xs:flex-row justify-between p-4 xs:items-center border-b">
    <button class="hover:bg-slate-300/40" onClick={back}  >
      <HiOutlineX class="h-10 w-10 stroke-slate-800"/>
    </button>
    <div class="flex flex-col xs:flex-row gap-1 xs:gap-2">
        <Show when={searchParams.serviceTypeId}>
             <button class="w-24 py-2 border border-red-200 bg-white hover:border-red-500 rounded text-red-500" onClick={()=>setShowAlert(true)}>删除服务</button>
        </Show>
      <button class="w-24 py-2 bg-black hover:bg-gray-800 rounded text-white" onClick={save}>保存</button>
    </div>
  </div>
  <div class="grow flex flex-col overflow-y-auto gap-4">
    <div class="flex flex-col mx-auto my-4"><span class="text-2xl  font-semibold">{searchParams.serviceTypeId ? '编辑服务':'新增服务'}</span></div>
    <div class="flex flex-col gap-6 justify-center max-w-3xl mx-auto w-full px-2">
    
      <div class="flex flex-col sm:flex-row justify-between gap-6 sm:gap-2">
        <div class="flex flex-col w-full gap-2">
          <span class="text-gray-600 ">名称</span>
          <input type="text" value={name()} onInput={e=>setName(e.currentTarget.value)} class="w-full rounded border" placeholder=""/>
        </div>
        <div class="flex flex-col w-full gap-2">
          <span class="text-gray-700 ">预估时长（分钟）</span>
          <select onChange={e=>setEstimatedDuration(e.currentTarget.value as unknown as number)} class="w-full appearance-none blockbg-clip-padding bg-no-repeat border border-solid border-gray-500 rounded transition ease-in-out">
            <option value=""></option>
            <For each={durationList}>{duration=>
            <option value={duration.value} selected={estimatedDuration()===duration.value}>
                {duration.text}
            </option>
            }</For>
          </select>
        </div>
      </div>
      <div class="flex flex-col w-full gap-2">
        <span class="text-gray-600 ">正常价格（元）</span>
        <input type="number" value={normalPrize()} onInput={e=>setNormalPrize(e.currentTarget.value as unknown as number)} class="w-full rounded border" placeholder="" />
      </div>
      <div class="flex flex-col w-full gap-2">
        <span class="text-gray-700 ">会员价格（元）</span>
        <input type="number" value={memberPrize()} onInput={e=>setMemberPrize(e.currentTarget.value as unknown as number)} class="w-full rounded border" placeholder="" />
      </div>

    </div>
  </div>
</div>

<Show when={showAlert()}>
    <Alert setShowAlert={setShowAlert} message='删除服务' confirm={onDeleteConfirm}></Alert>
</Show>
</>
    );
};
export default ServiceTypeInfo;
