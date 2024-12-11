import SceneContextProvider from "@/sections/activity/christmas/context";
import Index from "@/sections/activity/christmas/christmas";
import GuidingTour from "@/components/GuidingTour";
import { MaskPlacement } from "@/components/GuidingTour/getStyleRect";

export default function ChristmasView() {
  return (
    <SceneContextProvider>
      <GuidingTour
        steps={[
          {
            selector: () => {
              return document.getElementById("tour-id-1");
            },
            title: "🎁 Gift Boxes",
            content:
              "from da Bera Clause, contain random rewards from high value NFTs, token & lot of fun stuff.",
            placement: MaskPlacement.BottomRight,
          },
          {
            selector: () => {
              return document.getElementById("tour-id-2");
            },
            title: "💰 Prize Inventory",
            content: 'Details of prizes can be viewed here',
            placement: MaskPlacement.BottomRight,
          },
          {
            selector: () => {
              return document.getElementById("tour-id-3");
            },
            title: "🏃 Game theory",
            content: 'The closer it is to the X-mas day, the higher chance you can get rare rewards of NFTs, token, WLs for upcoming mint and more!',
            placement: MaskPlacement.Bottom,
          },
          {
            selector: () => {
              return document.getElementById("tour-id-4");
            },
            title: "🧐 So how to get Gift boxes?",
            content: 'The tree will be decorated with all the gifts you have received. The more gifts you receive, the more beautiful the tree will be!',
            placement: MaskPlacement.BottomRight,
          },
          {
            selector: () => {
              return document.getElementById("tour-id-5");
            },
            title: "🙌 Light work is also work ",
            content: 'Follow McBera & do daily socials tasks to get your daily supply of gift boxes!',
            placement: MaskPlacement.BottomLeft,
          },
          {
            selector: () => {
              return document.getElementById("tour-id-6");
            },
            title: "👾 DeFi is fun again and POL is not hard!",
            content: "This is your perfect chance to spam transactions hoping for a fat airdrop from Berachain...Or simply having fun & learn about the ecosystem, about how Proof-of-liquidity works or how the DeFi Legos work.Swap, add LP, lend, stake, delegate etc... You got rewarded for every steps you make!",
            placement: MaskPlacement.BottomRight
          }
        ]}
      />;
      <Index />
    </SceneContextProvider>
  );
}
