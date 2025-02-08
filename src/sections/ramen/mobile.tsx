import clsx from "clsx";
import CurrentLaunches from "@/sections/ramen/current";
import PastLaunches from "@/sections/ramen/past";
import useList from "./hooks/use-list";

const MobileContent = (props: any) => {
  const { className, tab } = props;

  const {
    finishedPage,
    finishedPageTotal,
    finishedHasMore,
    setFinishedPage,
    featuredList,
    featuredLoading,
    finishedList,
    finishedLoading
  } = useList();

  return (
    <div className={clsx("max-h-[calc(100dvh_-_230px)] overflow-x-hidden overflow-y-auto pb-[10px]", className)}>
      {
        tab === 'current' && (
          <CurrentLaunches
            list={featuredList}
            loading={featuredLoading}
          />
        )
      }
      {
        tab === 'past' && (
          <PastLaunches
            loading={finishedLoading}
            list={finishedList}
            page={finishedPage}
            onPage={setFinishedPage}
            more={finishedHasMore}
            total={finishedPageTotal}
          />
        )
      }
    </div>
  );
};

export default MobileContent;
