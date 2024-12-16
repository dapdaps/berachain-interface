import Ring from "@/components/icons/ring";
import { useEffect, useMemo, useState } from 'react';
import { useInteractiveSound } from "@/hooks/use-interactive-sound";
import { ChristmasRingStatus, useChristmasStore } from '@/stores/christmas';

export default function RingButton(props: any) {
  const { className } = props;
  const ringStatus = useChristmasStore((state) => state.ringStatus);
  const setRingStatus = useChristmasStore((state) => state.setRingStatus);

  const [open, setOpen] = useMemo(() => {
    return [
      ringStatus === ChristmasRingStatus.Playing,
      (playing: boolean) => {
        setRingStatus(playing ? ChristmasRingStatus.Playing : ChristmasRingStatus.Paused);
      }
    ];
  }, [ringStatus, setRingStatus]);
  const { playSound, pauseSound, isPlaying } = useInteractiveSound(
    "/audios/christmas.mp3",
    {
      autoPlay: false,
      loop: true,
      volume: 0.5,
    }
  );

  useEffect(() => {
    setOpen(isPlaying);
  }, [isPlaying]);

  return (
    <button
      className={className}
      onClick={() => {
        open ? pauseSound() : playSound();
      }}
    >
      <Ring open={open} />
    </button>
  );
}
