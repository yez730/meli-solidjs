import { type Component, createResource, Show } from 'solid-js';
import moment from 'moment';
import { useSearchParams, useNavigate } from '@solidjs/router';
import { HiOutlineX } from 'solid-icons/hi';
import { getAppointment } from '../../utils/api';

const AppointmentShow: Component = () => {
  const [searchParams] = useSearchParams();

  const [appoinment] = createResource(async () => getAppointment(searchParams.id));

  const navigate = useNavigate();
  const back = () => {
    let path = `/calendar`;
    if (searchParams.barberId) {
      path += `?barberId=${searchParams.barberId}`;
    }
    navigate(path);
  };

  const goMember = (e: MouseEvent) => {
    e.preventDefault();
    let path = `/members?memberId=${
      appoinment()?.extendedProps.memberId
    }&fromCalendarShow=true&id=${searchParams.id}`;
    if (searchParams.barberId) {
      path += `&barberId=${searchParams.barberId}`;
    }

    navigate(path);
  };

  return (
    <div class="flex flex-col max-h-screen bg-white m-2 p-2 pb-4">
      <div class="flex-none flex flex-row border-b-slate-300 border-b xs:p-4 p-2">
        <div class="grow flex flex-col justify-center items-center">
          <span class="text-2xl font-semibold">查看订单</span>
        </div>
        <button class="flex-none hover:bg-slate-300/40" onClick={back}>
          <HiOutlineX class="h-10 w-10 stroke-slate-800 stroke-1" />
        </button>
      </div>
      <div class="grow overflow-y-auto">
        <div class="lg:mx-auto lg:max-w-3xl w-full flex flex-col lg:gap-8 gap-4 px-2 mt-8">
          <span class="text-lg lg:text-xl font-semibold text-slate-600">
            {moment(appoinment()?.extendedProps.startTime).format('YYYY年MM月DD日')}
          </span>
          <Show
            when={appoinment()?.extendedProps?.customer === 'walk-in'}
            fallback={
              <div class="flex flex-row items-center">
                <span class="text-gray-600">客人姓名：</span>
                <a
                  href="#/"
                  onClick={goMember}
                  class="text-blue-500 hover:underline hover:underline-offset-4 "
                >
                  {appoinment()?.extendedProps?.customer}
                </a>
              </div>
            }
          >
            <span>进店客人</span>
          </Show>
          <div class="hidden lg:flex flex-col w-full  gap-1">
            <div class="flex flex-row items-center gap-2 justify-between border-b">
              <span>
                {moment(appoinment()?.extendedProps.startTime).format('YYYY-MM-DD HH:mm')}
              </span>
              <div class="flex flex-col">
                <div class="flex flex-row justify-end">
                  <span>{appoinment()?.extendedProps?.serviceName}</span>
                </div>
                <div class="text-xs flex flex-row justify-end">
                  <span class="text-gray-600">理发师: </span>
                  <span class="ml-1">{appoinment()?.extendedProps?.barberName}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-row items-center justify-between">
              <span>
                {Math.trunc(Number(appoinment()?.extendedProps.totalMinutes) / 60) > 0
                  ? `${Math.trunc(Number(appoinment()?.extendedProps.totalMinutes) / 60)} 小时${
                      Number(appoinment()?.extendedProps.totalMinutes) % 60 === 0
                        ? ''
                        : ` ${Number(appoinment()?.extendedProps.totalMinutes) % 60}分钟`
                    }`
                  : `${Number(appoinment()?.extendedProps.totalMinutes) % 60} 分钟`}
              </span>
              <span class="text-lg">{appoinment()?.extendedProps?.amount}￥</span>
            </div>
          </div>

          <div class="lg:hidden flex flex-col gap-1">
            <span class="text-gray-600">服务类型</span>
            <span>{appoinment()?.extendedProps?.serviceName}</span>
          </div>

          <div class="lg:hidden flex flex-col gap-1">
            <span class="text-gray-600">理发师</span>
            <span>{appoinment()?.extendedProps?.barberName}</span>
          </div>

          <div class="lg:hidden flex flex-col gap-1">
            <span class="text-gray-600">开始时间</span>
            <span>{moment(appoinment()?.extendedProps.startTime).format('HH:mm')}</span>
          </div>

          <div class="lg:hidden flex flex-col gap-1">
            <span class="text-gray-600">花费时间</span>
            <span>
              {Math.trunc(Number(appoinment()?.extendedProps.totalMinutes) / 60) > 0
                ? `${Math.trunc(Number(appoinment()?.extendedProps.totalMinutes) / 60)} 小时${
                    Number(appoinment()?.extendedProps.totalMinutes) % 60 === 0
                      ? ''
                      : ` ${Number(appoinment()?.extendedProps.totalMinutes) % 60}分钟`
                  }`
                : `${Number(appoinment()?.extendedProps.totalMinutes) % 60} 分钟`}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-gray-600">备注信息</span>
            <span>
              {appoinment()?.extendedProps?.remark ? appoinment()?.extendedProps.remark : '暂无'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppointmentShow;
