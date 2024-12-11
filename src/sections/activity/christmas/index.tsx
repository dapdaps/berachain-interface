import SceneContextProvider from "@/sections/activity/christmas/context";
import Index from "@/sections/activity/christmas/christmas";
import GuidingTour from "@/components/GuidingTour";
import { MaskPlacement } from "@/components/GuidingTour/getStyleRect";


export default function ChristmasView() {
  <GuidingTour
  steps={
    [
      {
        selector: () => {
          return document.getElementById('tour-id-1');
        },
        title: "🎁 Gift Boxes",
        content: "from da Bera Clause, contain random rewards from high value NFTs, token & lot of fun stuff.",
        placement: MaskPlacement.BottomRight
      },
      {
        selector: () => {
          return document.getElementById('btn-group2');
        },
        renderContent: () => {
          return "神说要有光2";
        },
        placement: MaskPlacement.BottomLeft
      },
    ]
} />
  return (
    <SceneContextProvider>
      <Index />
    </SceneContextProvider>
  );
}
