import { type Component, Suspense } from "solid-js";

const Menu: Component<{
    currentMenu:string,
    setIsMenuShowButInSmallScreen:(show:boolean)=>void,
    setCurrentMenu:(currentMenu:string)=>void,
} > = (props) => {
    const changeMenu=(menu:string)=>{
        props.setCurrentMenu(menu);
        props.setIsMenuShowButInSmallScreen(false);
    }

    return (
<div class="flex flex-row h-full w-full pt-4">
    <div class="flex flex-col mx-auto gap-2">
        <span class="text-base py-2 px-6 rounded-md cursor-pointer" classList={{
            "hover:bg-gray-100":props.currentMenu !== 'MemberInfo',
            "bg-blue-100":props.currentMenu === 'MemberInfo',

        }} onClick={[changeMenu,"MemberInfo"]}>客户资料</span>

        <span class="text-base py-2 px-6 rounded-md cursor-pointer" classList={{
            "hover:bg-gray-100":props.currentMenu !== 'Order',
            "bg-blue-100":props.currentMenu === 'Order',

        }} onClick={[changeMenu,"Order"]}>消费记录</span>

        <span class="text-base py-2 px-6 rounded-md cursor-pointer" classList={{
            "hover:bg-gray-100":props.currentMenu !== 'RechargeRecord',
            "bg-blue-100":props.currentMenu === 'RechargeRecord',

        }} onClick={[changeMenu,"RechargeRecord"]}>充值记录</span>
    </div>
</div>

    );
};
export default Menu;
