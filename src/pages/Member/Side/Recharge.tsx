import { type Component, createSignal } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { HiOutlineX } from 'solid-icons/hi';
import toast from 'solid-toast';
import type { Recharge as RechangeType } from '../../../types';
import { recharge as rechargeApi } from '../../../utils/api';

const Recharge: Component<{
  hideShowRecharge: () => void;
  handleRechargeSuccess: () => void;
}> = (props) => {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = createSignal('');

  const recharge = async () => {
    if (Number.isNaN(Number(amount()))) {
      toast.error('请输入数字');
      return;
    }

    const rechargeType: RechangeType = {
      amount: Number(amount()),
    };

    const res = await rechargeApi(searchParams.memberId, rechargeType);
    if (res.ok) {
      toast.success('充值成功');

      props.handleRechargeSuccess();
      props.hideShowRecharge();
    } else {
      toast.error(`充值失败 ${res.msg}`);
    }
  };

  return (
    <div class="fixed inset-0 bg-black/20 z-20 flex flex-col ">
      <div class="mx-auto sm:my-auto sm:max-w-md w-full h-full sm:h-auto flex flex-col bg-white rounded gap-4">
        <div class="w-full flex flex-row justify-between items-center border-b p-4">
          <span class="text-lg font-semibold">会员充值</span>
          <button class="border-none hover:bg-slate-100" onClick={() => props.hideShowRecharge()}>
            <HiOutlineX class="h-8 w-8 " />
          </button>
        </div>

        <div class="w-full sm:grow-0 grow flex flex-col py-4 px-4">
          <div class="flex flex-col gap-2">
            <span class="">金额</span>
            <input
              type="number"
              value={amount()}
              onInput={(e) => setAmount(e.currentTarget.value)}
              class="w-full rounded border"
              placeholder=""
            />
          </div>
        </div>

        <div class="w-full flex flex-col xxs:flex-row justify-end border-t p-4 items-center">
          <div class="flex flex-col xxs:flex-row  gap-2">
            <button
              class="w-24 py-2 border border-slate-300  bg-white hover:border-slate-500 rounded text-black"
              onClick={() => props.hideShowRecharge()}
            >
              取消
            </button>
            <button
              class="w-24 py-2  bg-black hover:bg-gray-800 rounded text-white"
              onClick={recharge}
            >
              充值
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Recharge;
