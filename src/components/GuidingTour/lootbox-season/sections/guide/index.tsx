import ReactDOM from "react-dom";
import LootboxSeasonGuideContent from "./content";
import useIsMobile from "@/hooks/use-isMobile";

const LootboxSeasonGuide = (props: any) => {
  const { open } = props;

  const isMobile = useIsMobile();

  if (!open || isMobile) return null;

  return ReactDOM.createPortal(
    (
      <LootboxSeasonGuideContent {...props} />
    ) as any,
    document.body
  ) as unknown as React.ReactPortal;
};

export default LootboxSeasonGuide;
