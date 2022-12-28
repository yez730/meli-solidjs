import { type Component, onMount,onCleanup } from "solid-js";

const InfiniteScroll: Component<{
  elementScroll?:HTMLDivElement,
  threshold:number,
  hasMore:boolean,
  loadMore:()=>void,
}> = (props) => {
    let component:HTMLDivElement | undefined; 

    onMount(()=>{
      const element = props.elementScroll ? props.elementScroll : component!.parentNode;

      element?.addEventListener("scroll", onScroll);
      element?.addEventListener("resize", onScroll);
    });

    let isLoadMore = false;

    const onScroll:(evt: Event)=> void = e => {
        const element = e.target as HTMLDivElement;
        
        const offset = element.scrollHeight - element.clientHeight - element.scrollTop;
        
        if (offset <= props.threshold) {
          if (!isLoadMore && props.hasMore) {
            props.loadMore();
          }
          isLoadMore = true;
        } else {
          isLoadMore = false;
        }
      };
    
      onCleanup(() => {
        const element = props.elementScroll ? props.elementScroll : component!.parentNode;
  
        element?.removeEventListener("scroll", onScroll);
        element?.removeEventListener("resize", onScroll);
      });

    return (
        <div ref={component!} class="w-0 h-0" />
    );
};
export default InfiniteScroll;