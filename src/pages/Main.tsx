import { type Component, createSignal ,Show, createResource} from "solid-js";
import {A,Outlet,useNavigate} from "@solidjs/router";
import {  getCurrentBarber,logout} from '../utils/api';
import clickOutside from "../directives/clickOutside";
import Menu from './Menu';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';
import { HiOutlineMenu,HiOutlineUser } from 'solid-icons/hi';

const Main: Component = () => {
    const [isMenuShowButInSmallScreen,setIsMenuShowButInSmallScreen]=createSignal(false);
    const [loginInfoVisible,setLoginInfoVisible]=createSignal(false);

    const [barberName]=createResource(async()=>{
        let barberRes=await getCurrentBarber();
        return barberRes.ok && barberRes.data!.realName;
    });

    let btnLoginInfo:HTMLButtonElement|undefined;

    const navigate = useNavigate();

    const handleLogout=async ()=>{
        await logout();

        localStorage.setItem("identity", "");

        navigate("/login");
    }

    window.matchMedia(`(min-width: ${(resolveConfig(tailwindConfig) as any).theme!.screens?.['lg']})`).addEventListener("change",(e)=>{
        if (e.matches){
            setIsMenuShowButInSmallScreen(false);
        }
    });
    
    return (
        <Show when={!isMenuShowButInSmallScreen()} fallback={
            <Menu setIsMenuShowButInSmallScreen={setIsMenuShowButInSmallScreen}></Menu>
        }>
            <div class="flex flex-row"> 
                <div class="hidden lg:block flex-none w-56 border-r">
                    <Menu setIsMenuShowButInSmallScreen={setIsMenuShowButInSmallScreen}></Menu>
                </div>
                <div class="grow flex flex-col h-screen overflow-y-hidden bg-gray-100">                    
                    <div class="flex-none flex flex-row lg:justify-end justify-between bg-sky-400 items-center border-b-2 border-rose-600">
                        <button class="lg:hidden ml-2 block hover:bg-sky-600 rounded" onClick={()=>setIsMenuShowButInSmallScreen(true)}> 
                            <HiOutlineMenu class="h-10 w-10 stroke-slate-50 fill-none stroke-1"/>
                        </button>
                        <div class="relative p-3">
                            <button ref={btnLoginInfo!} class="flex flex-row items-center gap-1 truncate hover:bg-sky-600 p-1 rounded" classList={{"bg-sky-600":loginInfoVisible()}} onClick={()=>{
                                setLoginInfoVisible(val=> !val);
                            }}>
                                <HiOutlineUser class="w-8 h-8 stroke-slate-50 fill-slate-50" />
                            </button>
                            <Show when={loginInfoVisible()}>
                                <div use:clickOutside={[()=>setLoginInfoVisible(false),btnLoginInfo!]}  class="absolute z-20 top-16 right-3 bg-white xs:w-40 w-32 flex flex-col border-1 shadow rounded-sm py-2">
                                    <span class="px-2 text-xs font-semibold">{barberName()}</span>
                                    <hr class="w-full h-px bg-gray-200 border-0 my-2" />
                                    <A class="p-2 hover:bg-slate-100 text-sm"  href="/profile" onClick={()=>setLoginInfoVisible(false)}>账户信息</A>
                                    <hr class="my-2 w-full h-px bg-gray-200 border-0" />
                                    <button class="p-2 hover:bg-slate-100 text-sm text-left" onClick={handleLogout}>退出登陆</button>
                                </div>
                            </Show>
                        </div>
                    </div>

                    <Outlet/>
                </div>
            </div>
        </Show>
    );
};

export default Main;
