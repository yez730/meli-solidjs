import { type Component } from 'solid-js';
import { HiOutlineX } from 'solid-icons/hi';
import clickOutside from '../directives/clickOutside';

const Alert: Component<{
  message: string;
  setShowAlert: (show: boolean) => void;
  confirm: () => void;
}> = (props) => {
  return (
    <div class="fixed inset-0 bg-black/20 z-20 flex flex-col">
      <div
        use:clickOutside={[() => props.setShowAlert(false)]}
        class="mx-auto sm:my-auto sm:max-w-md w-full h-full overflow-y-auto sm:h-auto flex flex-col bg-white rounded gap-4"
      >
        <div class="w-full flex flex-row justify-between items-center border-b p-3">
          <span class="font-semibold  text-lg">{props.message}</span>
          <button class="border-none hover:bg-slate-100" onClick={() => props.setShowAlert(false)}>
            <HiOutlineX size={24} />
          </button>
        </div>
        <div class="pl-2">
          <span class="text-slate-600 text-base">该操作无法撤销，是否继续？</span>
        </div>
        <div class="flex flex-col xxs:flex-row xxs:justify-end p-2 gap-2">
          <button
            class="w-20 py-1 border border-slate-300  bg-white hover:border-slate-500 rounded text-black"
            onClick={() => props.setShowAlert(false)}
          >
            取消
          </button>
          <button
            class="w-20 py-1 bg-red-600 hover:bg-red-500 rounded text-white"
            onClick={() => props.confirm()}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
};
export default Alert;
