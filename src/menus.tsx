import type { Menu } from "./types";
import { HiSolidCalendar,HiSolidUsers,HiSolidChartBar } from 'solid-icons/hi';
import { FaSolidScrewdriverWrench } from 'solid-icons/fa';

export const menus:Menu[]=[
    { 
        name:"首页", 
        path:"/calendar", 
        permissionCode:"Canlendar",
        icon:<HiSolidCalendar />
    },
    { 
        name:"会员管理", 
        path:"/members", 
        permissionCode:"Member",
        icon:<HiSolidUsers />
    },
    { 
        name:"业务统计", 
        menuGroup:[
            {
                name:'订单统计',
                path:'/orders',
                permissionCode:'Statistic',
            },
            {
                name:'充值记录',
                path:'/recharge-records',
                permissionCode:'Statistic',
            },
        ],
        collapsed:true,
        icon: <HiSolidChartBar />
    },
    { 
        name:"设置", 
        menuGroup:[
        {
            name:'服务类型',
            path:'/service-types',
            permissionCode:'ServiceType',
        },
        {
            name:'团队成员',
            path:'/barbers',
            permissionCode:'Barber',
        }
        ] ,
        collapsed:true,
        icon:<FaSolidScrewdriverWrench />
    }
];
