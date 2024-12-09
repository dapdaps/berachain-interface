import SceneContextProvider from '@/sections/activity/christmas/context';
import Index from '@/sections/activity/christmas/christmas';

export default function ChristmasView() {
  return (
    <SceneContextProvider>
      <Index />
    </SceneContextProvider>
  );
}
