import { useSearchParams, useNavigate, useLocation } from '@solidjs/router';
import { type Component, Show, createSignal, onMount, onCleanup } from 'solid-js';
import { HiOutlineX } from 'solid-icons/hi';
import toast from 'solid-toast';
import { createStore } from 'solid-js/store';
import { addMember, getMember, updateMember, deleteMember } from '../../utils/api';
import type { NewMember } from '../../types';
import Alert from '../../common/Alert';

const MemberInfo: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showAlert, setShowAlert] = createSignal(false);
  const [memberInfo, setMemberInfo] = createStore({
    realName: '',
    cellphone: '',
    gender: '',
    birthDay: '',
    remark: '',
  });

  onMount(async () => {
    if (searchParams.memberId) {
      const member = await getMember(searchParams.memberId);

      setMemberInfo({
        realName: member.realName ?? '',
        cellphone: member.cellphone,
        gender: member.gender ?? '',
        birthDay: member.birthDay ?? '',
        remark: member.remark ?? '',
      });
    }
  });

  const back = () => {
    if (searchParams.fromCalendarAdd) {
      // TODO location.search urlencoding
      navigate(`/appointment-add${location.search}`);
    } else {
      navigate(`/members${location.search}`);
    }
  };

  const save = async () => {
    if (!memberInfo.realName) {
      toast.error('请输入姓名');
      return;
    }

    if (!memberInfo.cellphone) {
      toast.error('请输入手机号码');
      return;
    }

    const member: NewMember = {
      cellphone: memberInfo.cellphone,
      realName: memberInfo.realName,
      gender: memberInfo.gender,
      birthDay: memberInfo.birthDay === '' ? undefined : memberInfo.birthDay,
      remark: memberInfo.remark,
    };

    if (searchParams.memberId) {
      const res = await updateMember(searchParams.memberId, member);
      if (res.ok) {
        toast.success('修改成功');
        navigate(`/members${location.search}`);
      } else {
        toast.error(`修改失败 ${res.msg}`);
      }
    } else {
      const res = await addMember(member);
      if (res.ok) {
        if (searchParams.fromCalendarAdd) {
          navigate(
            `/appointment-add${location.search}&memberId=${res.data?.memberId}` +
              `&memberName=${encodeURIComponent(res.data?.realName ?? '')}`,
          );
        } else {
          toast.success('添加成功');
          navigate('/members');
        }
      } else {
        toast.error(`添加失败 ${res.msg}`);
      }
    }
  };

  const onDeleteConfirm = async () => {
    const res = await deleteMember(searchParams.memberId);
    if (res.ok) {
      navigate('/members');
      toast.success('删除成功');
    } else {
      toast.error(`删除失败${res.msg}`);
    }
  };
  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (key === 'Escape' && !showAlert()) {
      back();
    }
  };

  onMount(() => {
    window.addEventListener('keyup', handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener('keyup', handleKeyDown);
  });

  return (
    <>
      <div class="flex flex-col max-h-screen bg-white">
        <div class="flex flex-col xs:flex-row justify-between p-4 xs:items-center border-b">
          <button class="hover:bg-slate-300/40" onClick={back}>
            <HiOutlineX class="h-10 w-10 stroke-slate-800 stroke-1" />
          </button>
          <div class="flex flex-col xs:flex-row gap-1 xs:gap-2">
            <Show when={searchParams.memberId}>
              <button
                class="w-24 py-2 border border-red-200 bg-white hover:border-red-500 rounded text-red-500"
                onClick={() => setShowAlert(true)}
              >
                删除会员
              </button>
            </Show>
            <button class="w-24 py-2 bg-black hover:bg-gray-800 rounded text-white" onClick={save}>
              保存
            </button>
          </div>
        </div>
        <div class="grow overflow-y-auto flex flex-col">
          <div class="flex flex-col mx-auto my-4">
            <span class="text-2xl  font-semibold">
              {searchParams.memberId ? '编辑会员' : '新增会员'}
            </span>
          </div>
          <div class="flex flex-col gap-5 m-2">
            <div class="flex flex-col gap-6 justify-center max-w-3xl mx-auto border w-full  rounded-md">
              <div class="border-b p-4 text-lg font-semibold">基本信息</div>
              <div class="flex flex-col px-4 pb-4 gap-4">
                <div class="flex flex-col sm:flex-row justify-between gap-2">
                  <div class="flex flex-col w-full">
                    <span class="text-gray-600 ">姓名</span>
                    <input
                      type="text"
                      value={memberInfo.realName}
                      onInput={(e) => setMemberInfo({ realName: e.currentTarget.value })}
                      class="w-full rounded border"
                      placeholder=""
                    />
                  </div>
                  <div class="flex flex-col w-full">
                    <span class="text-gray-700 ">手机号</span>
                    <input
                      type="text"
                      value={memberInfo.cellphone}
                      onInput={(e) => setMemberInfo({ cellphone: e.currentTarget.value })}
                      class="w-full rounded border"
                      placeholder=""
                    />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row  justify-between gap-2">
                  <div class="flex flex-col w-full">
                    <span class="text-gray-700">性别</span>
                    <select
                      value={memberInfo.gender}
                      onChange={(e) => setMemberInfo({ gender: e.currentTarget.value })}
                      class="w-full border rounded "
                    >
                      <option value="">全部</option>
                      <option value="男" selected={memberInfo.gender === '男'}>
                        男
                      </option>
                      <option value="女" selected={memberInfo.gender === '女'}>
                        女
                      </option>
                    </select>
                  </div>
                  <div class="flex flex-col w-full">
                    <span class="text-gray-700">出生日期</span>
                    <input
                      type="date"
                      value={memberInfo.birthDay}
                      onInput={(e) => setMemberInfo({ birthDay: e.currentTarget.value })}
                      class="w-full border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-6 justify-center max-w-3xl w-full mx-auto border rounded-md">
              <div class="border-b p-4 text-lg font-semibold">客户备注</div>
              <div class="px-4 pb-4">
                <textarea
                  class="w-full rounded"
                  value={memberInfo.remark}
                  onInput={(e) => setMemberInfo({ remark: e.currentTarget.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Show when={showAlert()}>
        <Alert setShowAlert={setShowAlert} message="删除会员" confirm={onDeleteConfirm} />
      </Show>
    </>
  );
};

export default MemberInfo;
