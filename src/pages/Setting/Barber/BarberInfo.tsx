import { type Component, onMount, createSignal, Show } from 'solid-js';
import { useSearchParams, useNavigate, useLocation } from '@solidjs/router';
import { HiOutlineX } from 'solid-icons/hi';
import toast from 'solid-toast';
import type { NewBarber } from '../../../types';
import { getBarber, updateBarber, addBarber, deleteBarber } from '../../../utils/api';
import Alert from '../../../common/Alert';

const BarberInfo: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showAlert, setShowAlert] = createSignal(false);

  const [realName, setRealName] = createSignal('');
  const [cellphone, setCellphone] = createSignal('');
  const [email, setEmail] = createSignal('');

  onMount(async () => {
    if (searchParams.barberId) {
      const barber = await getBarber(searchParams.barberId);

      setRealName(barber.realName ?? '');
      setCellphone(barber.cellphone);
      setEmail(barber.email ?? '');
    }
  });

  const back = () => {
    const search = new URLSearchParams(location.search);
    search.delete('barberId');
    navigate(`/barbers?${search}`);
  };

  const save = async () => {
    if (!realName()) {
      toast.error('请输入理发师姓名');
      return;
    }

    if (!cellphone()) {
      toast.error('请输入理发师手机号');
      return;
    }

    const barber: NewBarber = {
      cellphone: cellphone(),
      realName: realName(),
      email: email() === '' ? undefined : email(),
      permissionIds: [], // TODO
    };

    if (searchParams.barberId) {
      const res = await updateBarber(searchParams.barberId, barber);
      if (res.ok) {
        toast.success('修改成功');

        const search = new URLSearchParams(location.search);
        search.delete('barberId');
        navigate(`/barbers?${search}`);
      } else {
        toast.error(`修改失败 ${res.msg}`);
      }
    } else {
      const res = await addBarber(barber);

      if (res.ok) {
        toast.success('添加成功');

        navigate('/barbers');
      } else {
        toast.error(`添加失败 ${res.msg}`);
      }
    }
  };

  const onDeleteConfirm = async () => {
    const res = await deleteBarber(searchParams.barberId);
    if (res.ok) {
      navigate('/barbers');

      toast.success('删除成功');
    } else {
      toast.error(`删除失败 ${res.msg}`);
    }
  };

  return (
    <>
      <div class="flex flex-col max-h-screen bg-white m-2 p-2 pb-4">
        <div class="flex flex-col xs:flex-row justify-between p-4 xs:items-center border-b">
          <button class="hover:bg-slate-300/40" onClick={back}>
            <HiOutlineX class="h-10 w-10 stroke-slate-800" />
          </button>
          <div class="flex flex-col xs:flex-row gap-1 xs:gap-2">
            <Show when={searchParams.barberId}>
              <button
                class="w-24 py-2 border border-red-200 bg-white hover:border-red-500 rounded text-red-500"
                onClick={() => setShowAlert(true)}
              >
                移除理发师
              </button>
            </Show>
            <button class="w-24 py-2 bg-black hover:bg-gray-800 rounded text-white" onClick={save}>
              保存
            </button>
          </div>
        </div>

        <div class="grow flex flex-col overflow-y-auto gap-4">
          <div class="flex flex-col mx-auto my-4">
            <span class="text-2xl  font-semibold">
              {searchParams.barberId ? '编辑理发师' : '新增理发师'}
            </span>
          </div>
          <div class="flex flex-col gap-6 justify-center max-w-3xl mx-auto w-full px-2">
            <div class="flex flex-col sm:flex-row justify-between gap-6 sm:gap-2">
              <div class="flex flex-col w-full gap-2">
                <span class="text-gray-600 ">姓名</span>
                <input
                  type="text"
                  value={realName()}
                  onInput={(e) => setRealName(e.currentTarget.value)}
                  class="w-full rounded border"
                  placeholder=""
                />
              </div>
              <div class="flex flex-col w-full gap-2">
                <span class="text-gray-700 ">手机号</span>
                <input
                  type="text"
                  value={cellphone()}
                  onInput={(e) => setCellphone(e.currentTarget.value)}
                  class="w-full rounded border"
                  placeholder=""
                />
              </div>
            </div>
            <div class="flex flex-col sm:flex-row  justify-between gap-2">
              <div class="flex flex-col w-full gap-2">
                <span class="text-gray-700">邮箱</span>
                <input
                  type="text"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  class="w-full rounded border"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Show when={showAlert()}>
        <Alert setShowAlert={setShowAlert} message="移除理发师" confirm={onDeleteConfirm} />
      </Show>
    </>
  );
};
export default BarberInfo;
