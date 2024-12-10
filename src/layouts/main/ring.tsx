import { motion } from "framer-motion";
import Ring from "@/components/icons/ring";
import { useEffect, useState } from "react";
import { useInteractiveSound } from "@/hooks/use-interactive-sound";

export default function RingButton() {
  const [open, setOpen] = useState(false);
  const { playSound, pauseSound, isPlaying } = useInteractiveSound(
    "/audios/christmas.mp3",
    {
      autoPlay: true,
      loop: true,
      volume: 0.5
    }
  );

  useEffect(() => {
    setOpen(isPlaying);
  }, [isPlaying]);

  return (
    <button
      onClick={() => {
        open ? pauseSound() : playSound();
      }}
    >
      <Ring open={open} />
    </button>
  );
}
