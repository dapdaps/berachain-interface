import SceneContextProvider from "@/sections/activity/christmas/context";
import Index from "@/sections/activity/christmas/christmas";
import IndexMobile from "@/sections/activity/christmas/mobile";
import useIsMobile from '@/hooks/use-isMobile';

export default function ChristmasView() {
  const isMobile = useIsMobile();

  return (
    <SceneContextProvider>
      {
        isMobile ? (
          <IndexMobile />
        ) : (
          <Index />
        )
      }
    </SceneContextProvider>
  );
}
