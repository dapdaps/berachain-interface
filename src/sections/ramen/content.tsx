import clsx from "clsx";
import CurrentLaunches from "@/sections/ramen/current";
import PastLaunches from "@/sections/ramen/past";
import useList from "./hooks/use-list";

const Content = (props: any) => {
  const { className } = props;
  const {
    finishedPage,
    setFinishedPage,
    featuredList,
    featuredLoading,
    finishedList,
    finishedLoading
  } = useList();
  return (
    <div className={clsx("", className)}>
      <CurrentLaunches />
      <PastLaunches />
    </div>
  );
};

export default Content;
