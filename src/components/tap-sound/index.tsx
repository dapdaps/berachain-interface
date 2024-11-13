'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';

const TapSound = forwardRef<Refs, Props>((props, ref) => {
  const {} = props;

  const soundRef = useRef<any>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    }
  };

  const refs = {
    play: playSound,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <audio
      ref={soundRef}
      src="/audios/cartoon-click.mp3"
      style={{
        width: 0,
        height: 0,
        position: 'absolute',
        zIndex: -9999,
        display: 'none',
        visibility: 'hidden',
        opacity: 0,
      }}
    />
  );
});

export default TapSound;

interface Props {
}

interface Refs {
  play(): void;
}
