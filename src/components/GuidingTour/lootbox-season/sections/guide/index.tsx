import ReactDOM from "react-dom";
import LootboxSeasonGuideContent from "./content";

const LootboxSeasonGuide = (props: any) => {
  const { open } = props;

  if (!open) return null;

  return ReactDOM.createPortal(
    (
      <LootboxSeasonGuideContent {...props} />
    ) as any,
    document.body
  ) as unknown as React.ReactPortal;
};

export default LootboxSeasonGuide;
