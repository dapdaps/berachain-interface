import { useDebounceFn } from "ahooks";
export default function Mobile({ className, children, onScrollBottom }: any) {
  const { run: scroll } = useDebounceFn(
    (ev) => {
      const el = ev.target;
      if (
        el.scrollHeight - el.scrollTop < el.clientHeight * 2 &&
        onScrollBottom
      ) {
        onScrollBottom();
      }
    },
    { wait: 500 }
  );
  return (
    <div className={className} onScroll={scroll}>
      {children}
    </div>
  );
}
