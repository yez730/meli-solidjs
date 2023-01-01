import type {
  Pages,
  Res,
  Member,
  NewMember,
  Recharge,
  Barber,
  NewBarber,
  UpdateInfo,
  Identity,
  PermissionResponse,
  NewServiceType,
  ServiceType,
  Appointment,
  NewAppointment,
  Merchant,
  StatisticOrderType,
  StatisticRechargeRecordType,
} from '../types';

const base = import.meta.env.VITE_API_BASE_URL;
export async function loginByPassword(account: string, password: string): Promise<Res<Barber>> {
  const res = await fetch(`${base}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      account,
      password,
    }),
  });
  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }
  const data = (await res.json()) as Barber;
  return {
    ok: true,
    data,
  };
}

export async function logout() {
  await fetch(`${base}/identity/logout`, {
    method: 'GET',
    credentials: 'include',
  });
}

export async function getCurrentIdentity(): Promise<Res<Identity>> {
  const res = await fetch(`${base}/identity/current`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as Identity;

  return {
    ok: true,
    data,
  };
}

export async function registerMerchant(
  merchantName: string,
  accountRealName: string,
  loginAccount: string,
  password: string,
): Promise<Res<Barber>> {
  const res = await fetch(`${base}/register/merchant`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      merchantName,
      accountRealName,
      loginAccount,
      password,
    }),
  });
  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }
  const data = (await res.json()) as Barber;
  return {
    ok: true,
    data,
  };
}

export async function getCurrentBarber(): Promise<Res<Barber>> {
  const res = await fetch(`${base}/barber`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as Barber;

  return {
    ok: true,
    data,
  };
}

export async function updateInfo(barber: UpdateInfo): Promise<Res<boolean>> {
  const res = await fetch(`${base}/barber`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(barber),
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

export async function getCurrentMerchant(): Promise<Res<Merchant>> {
  const res = await fetch(`${base}/merchant/current`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as Merchant;

  return {
    ok: true,
    data,
  };
}

// barbers--------------------------

export async function getBarbers(search: string): Promise<Barber[]> {
  const searchParams = new URLSearchParams();
  if (search) {
    searchParams.append('key', search);
  }

  const res = await fetch(`${base}/merchant/barbers?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

export async function addBarber(barber: NewBarber): Promise<Res<Barber>> {
  const res = await fetch(`${base}/merchant/barbers`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(barber),
  });
  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as Barber;
  return {
    ok: true,
    data,
  };
}

export async function getBarber(barberId: string): Promise<Barber> {
  const res = await fetch(`${base}/merchant/barber/${barberId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

export async function updateBarber(barberId: string, barber: NewBarber): Promise<Res<boolean>> {
  const res = await fetch(`${base}/merchant/barber/${barberId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(barber),
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

export async function deleteBarber(barberId: string): Promise<Res<boolean>> {
  const res = await fetch(`${base}/merchant/barber/${barberId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

// search: string
export async function getAllPermissions(): Promise<Res<PermissionResponse>> {
  const res = await fetch(`${base}/merchant/get_all_permissions`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as PermissionResponse;

  return {
    ok: true,
    data,
  };
}
// members--------------------------

export async function getMembers(
  page: number,
  pageSize: number,
  search: string,
  filterGender: string,
): Promise<Pages<Member>> {
  const searchParams = new URLSearchParams();
  searchParams.append('pageIndex', page.toString());
  searchParams.append('pageSize', pageSize.toString());
  if (search) {
    searchParams.append('key', search);
  }
  if (filterGender) {
    searchParams.append('filterGender', filterGender);
  }

  const res = await fetch(`${base}/members?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return (await res.json()) as Pages<Member>;
  }

  const err = await res.text();
  throw new Error(err);
}

export async function addMember(member: NewMember): Promise<Res<Member>> {
  const res = await fetch(`${base}/members`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(member),
  });
  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as Member;
  return {
    ok: true,
    data,
  };
}

export async function getMember(memberId: string): Promise<Member> {
  const res = await fetch(`${base}/member/${memberId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

export async function updateMember(memberId: string, member: NewMember): Promise<Res<boolean>> {
  const res = await fetch(`${base}/member/${memberId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(member),
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

export async function deleteMember(memberId: string): Promise<Res<boolean>> {
  const res = await fetch(`${base}/member/${memberId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

export async function recharge(memberId: string, rechargeModel: Recharge): Promise<Res<boolean>> {
  const res = await fetch(`${base}/member/recharge/${memberId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(rechargeModel),
  });
  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

export async function getOrdersByMemberId(
  memberId: string,
  page: number,
  pageSize: number,
): Promise<Pages<StatisticOrderType>> {
  const searchParams = new URLSearchParams();
  searchParams.append('pageIndex', page.toString());
  searchParams.append('pageSize', pageSize.toString());

  const res = await fetch(`${base}/member/orders/${memberId}?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

export async function getRechargeRecordsByMemberId(
  memberId: string,
  page: number,
  pageSize: number,
): Promise<Pages<StatisticRechargeRecordType>> {
  const searchParams = new URLSearchParams();
  searchParams.append('pageIndex', page.toString());
  searchParams.append('pageSize', pageSize.toString());

  const res = await fetch(`${base}/member/recharge_records/${memberId}?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}
// service_types--------------------------

export async function getServiceTypes(
  page: number,
  pageSize: number,
  search: string,
): Promise<Pages<ServiceType>> {
  const searchParams = new URLSearchParams();
  searchParams.append('pageIndex', page.toString());
  searchParams.append('pageSize', pageSize.toString());
  if (search) {
    searchParams.append('key', search);
  }

  const res = await fetch(`${base}/service_types?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

export async function addServiceType(serviceType: NewServiceType): Promise<Res<ServiceType>> {
  const res = await fetch(`${base}/service_types`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(serviceType),
  });
  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as ServiceType;

  return {
    ok: true,
    data,
  };
}

export async function getServiceType(serviceTypeId: string): Promise<ServiceType> {
  const res = await fetch(`${base}/service_type/${serviceTypeId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

export async function updateServiceType(
  serviceTypeId: string,
  serviceType: NewServiceType,
): Promise<Res<boolean>> {
  const res = await fetch(`${base}/service_type/${serviceTypeId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(serviceType),
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

export async function deleteServiceType(serviceTypeId: string): Promise<Res<boolean>> {
  const res = await fetch(`${base}/service_type/${serviceTypeId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  return {
    ok: true,
  };
}

// appointments--------------------------

export async function getAppointments(
  startDate: string,
  endDate: string,
  barberId: string,
): Promise<Appointment[]> {
  const searchParams = new URLSearchParams();
  searchParams.append('startDate', startDate);
  searchParams.append('endDate', endDate);
  if (barberId) {
    searchParams.append('barberId', barberId);
  }

  const res = await fetch(`${base}/appointments?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return (await res.json()) as Appointment[];
  }
  return [];
}

export async function addAppointment(appointment: NewAppointment): Promise<Res<Appointment>> {
  const res = await fetch(`${base}/appointments`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(appointment),
  });
  if (res.status !== 200) {
    const msg = await res.text();

    return {
      ok: false,
      msg,
    };
  }

  const data = (await res.json()) as Appointment;

  return {
    ok: true,
    data,
  };
}

export async function getAppointment(appointmentId: string): Promise<Appointment> {
  const res = await fetch(`${base}/appointment/${appointmentId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

// statistic-----------------------------------
export async function getOrders(
  page: number,
  pageSize: number,
  search: string,
): Promise<Pages<StatisticOrderType>> {
  const searchParams = new URLSearchParams();
  searchParams.append('pageIndex', page.toString());
  searchParams.append('pageSize', pageSize.toString());
  if (search) {
    searchParams.append('key', search);
  }

  const res = await fetch(`${base}/statistic/orders?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}

export async function getRechargeRecords(
  page: number,
  pageSize: number,
  search: string,
): Promise<Pages<StatisticRechargeRecordType>> {
  const searchParams = new URLSearchParams();
  searchParams.append('pageIndex', page.toString());
  searchParams.append('pageSize', pageSize.toString());
  if (search) {
    searchParams.append('key', search);
  }

  const res = await fetch(`${base}/statistic/recharge_records?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200) {
    return res.json();
  }

  const msg = await res.text();
  throw new Error(msg);
}
