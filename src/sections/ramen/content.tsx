import clsx from "clsx";
import CurrentLaunches from "@/sections/ramen/current";
import PastLaunches from "@/sections/ramen/past";
import useList from "./hooks/use-list";

const Content = (props: any) => {
  const { className } = props;
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
    <div className={clsx("max-h-[calc(100dvh_-_310px)] overflow-x-hidden overflow-y-auto", className)}>
      <CurrentLaunches
        list={featuredList}
        loading={featuredLoading}
      />
      <PastLaunches
        loading={finishedLoading}
        list={finishedList}
        page={finishedPage}
        onPage={setFinishedPage}
        more={finishedHasMore}
        total={finishedPageTotal}
      />
    </div>
  );
};

export default Content;
