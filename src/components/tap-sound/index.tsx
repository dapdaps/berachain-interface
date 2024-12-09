"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

const TapSound = forwardRef((props: any, ref) => {
  const { src = "/audios/cartoon-click.mp3", config } = props;

  const soundRef = useRef<any>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    }
  };

  const pauseSound = () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  };

  const refs = {
    play: playSound,
    pause: pauseSound
  };
  useImperativeHandle(ref, () => refs);

  return (
    <audio
      ref={soundRef}
      src={src}
      style={{
        width: 0,
        height: 0,
        position: 'absolute',
        zIndex: -9999,
        visibility: "hidden",
        opacity: 0
      }}
      {...config}
    />
  );
});

export default TapSound;
