import { JSX } from "solid-js"

//appointment
export type Appointment ={
    allDay:boolean,
    title:string,
    editable:boolean,
    startEditable:boolean,
    display:string,
    backgroundColor:string,
    extendedProps:any,

    order:Order,
}

export type Order ={
    id:string,
    merchantId:string,
    start:string,
    end:string,
}

export type NewAppointment={
    startTime:string,
    endTime:string,
    serviceTypeId:string,
    barberId:string,
    memberId?:string,
    paymentType:string,
    amount:number,
    remark:string,
}

//barber
export type Barber ={
    userId:string,
    barberId:string,
    merchantId:string,
    cellphone:string,
    email?:string,
    realName?:string,
    createTime:string,
    updateTime:string,

    merchant?:Merchant,

    permissionCodes:String[],
}

export type NewBarber={
    cellphone:string,
    email?:string,
    realName?:string,
    permissionIds:string[],
}

export type UpdateInfo={
    cellphone?:string,
    realName?:string,
    email?:string,
    newPassword?:string,
    oldPassword?:string,
    merchantName?:string,
    merchantAddress?:string,
    merchantRemark?:string,
}

//identity
export type Role ={
    roleId:string,
    roleCode:string,
    roleName:string,
    description:string,
    createTime:string,
    updateTime:string,
}

export type Permission ={
    permissionId:string,
    permissionCode:string,
    permissionName:string,
    description:string,
    createTime:string,
    updateTime:string,
}

export type Identity ={
    userId:string,
    roles:Role[],
    permissions:Permission[],
    permissionCodes:string[],
}

export type PermissionResponse ={
    allPermissions:Permission[],
    defaultPermissions:Permission[],
}

//member
export type Member ={
    memberId:string,
    cellphone:string,
    realName?:string,
    gender?:string,
    birthDay?:string,
    balance:string,
    createTime:string,
    updateTime:string,
    remark?:string,
}

export type NewMember ={
    cellphone:string,
    realName?:string,
    gender?:string,
    birthDay?:string,
    remark?:string,
}

export type Recharge ={
    amount:number,
}


//menu
//TODO 分成两个类型 `menuitem|menugroup`
export type Menu = {
    name:string,//menuitem && menugroup
    path?:string,//menuitem
    permissionCode?:string,//menuitem
    icon?:JSX.Element,//menu? && menugroup
    collapsed?:boolean,//menugroup
    menuGroup?: Menu[],//menugroup
}

//merchant
export type Merchant ={
    merchantId:string,
    merchantName:string,
    companyName?:string,
    credentialNo?:string,
    createTime:string,
    updateTime:string,
    address?:string,
    remark?:string,
}

//model
export type Pages<T> ={
    totalCount:number,
    data:T[],
}

export type Res<T> ={
    ok:boolean,
    msg?:string,
    data?:T,
}

//service
export type ServiceType ={
    serviceTypeId:string,
    name:string,
    estimatedDuration:number,
    normalPrize:number,
    memberPrize:number,
    createTime:string,
    updateTime:string,
}

export type NewServiceType ={
    name:string,
    estimatedDuration:number,
    normalPrize:number,
    memberPrize:number,
}

//statistic
export type StatisticOrderType ={
    id:string,
    serviceName:string,
    consumerType:string,
    memberName:string,
    memberCellphone:string,
    amount:string,
    totalMinutes:number,
    paymentType:string,
    barberName:string,
    createTime:string,
}

export type StatisticRechargeRecordType ={
    id:string,
    memberName:string,
    memberCellphone:string,
    amount:number,
    barberName:string,
    crateTime:string,
}

export type RechargeRecord={
    rechargeRecordId:string,
    merchantId:string,
    memberId:string,
    amount:number,
    barberId:string,
    createTime:string,
    updateTime:string,
}