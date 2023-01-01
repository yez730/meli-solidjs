import { onCleanup } from 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: [() => void, HTMLElement?];
    }
  }
}

const clickOutside: (element: Element, accessor: () => [() => void, HTMLElement?]) => void = (
  el,
  accessor,
) => {
  const [handleClick, excludingElement] = accessor();
  const onClick: (this: HTMLElement, ev: MouseEvent) => void = (e) =>
    !el.contains(e.target as Node) &&
    (!excludingElement || !excludingElement.contains(e.target as Node)) &&
    handleClick();

  document.body.addEventListener('click', onClick);

  onCleanup(() => document.body.removeEventListener('click', onClick));
};

export default clickOutside;
