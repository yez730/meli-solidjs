import { type Component } from "solid-js";
import { IoCutOutline } from 'solid-icons/io';
import {A} from "@solidjs/router";

const Index: Component = () => {
    return (
        <div class="min-h-screen">
    <div class="mx-auto max-w-4xl gap-60 flex flex-col">
        <div class="flex flex-row justify-between p-3">
            <div class="flex flex-row gap-2 items-center">
                <A href="/">
                    <IoCutOutline size={30} />
                  </A>
                <span class=" text-slate-700 ssm:block text-xl sm:text-2xl">头顶尚丝美发</span>
            </div>
            <div class="flex flex-row items-center gap-2 sm:gap-5">
                <A href="/login" class="text-slate-500 hover:text-slate-600">登录</A>
                <A href="/register-merchant" class="w-20 text-center py-1 sm:w-24 sm:py-2 border border-slate-500 hover:border-slate-600 rounded text-slate-500 hover:text-slate-600" >注册商户</A>
            </div>
        </div>

    </div>
</div>

    );
};
export default Index;
