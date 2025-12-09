const SOUND_PATHS = {
  click: "/images/gacha/sound/1-click.ogg",
  error: "/images/gacha/sound/2-error.ogg",
  gacha: "/images/gacha/sound/3-gacha.ogg",
  reward: "/images/gacha/sound/4-reward.ogg",
  background: "/images/gacha/sound/5-background.ogg",
  shake: "/images/gacha/sound/6-shake.ogg",
} as const;

const audioCache: Map<string, HTMLAudioElement> = new Map();

function getAudio(src: string): HTMLAudioElement {
  if (!audioCache.has(src)) {
    const audio = new Audio(src);
    audioCache.set(src, audio);
  }
  return audioCache.get(src)!;
}

function playSound(
  src: string,
  options?: {
    volume?: number;
    loop?: boolean;
    onEnded?: () => void;
  }
): HTMLAudioElement {
  const audio = getAudio(src);
  
  audio.currentTime = 0;
  
  if (options?.volume !== undefined) {
    audio.volume = Math.max(0, Math.min(1, options.volume));
  }
  
  audio.loop = options?.loop || false;
  
  if (options?.onEnded) {
    audio.onended = options.onEnded;
  }
  
  audio.play().catch((error) => {
    console.error("Failed to play audio:", error);
  });
  
  return audio;
}

function stopSound(src: string): void {
  const audio = audioCache.get(src);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function stopAllSounds(): void {
  audioCache.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

export const playClickSound = (options?: { volume?: number }) =>
  playSound(SOUND_PATHS.click, options);

export const playErrorSound = (options?: { volume?: number }) =>
  playSound(SOUND_PATHS.error, options);

export const playGachaSound = (options?: { volume?: number }) =>
  playSound(SOUND_PATHS.gacha, options);

export const playRewardSound = (options?: { volume?: number }) =>
  playSound(SOUND_PATHS.reward, options);

export const playBackgroundSound = (options?: { volume?: number; loop?: boolean }) =>
  playSound(SOUND_PATHS.background, { ...options, loop: options?.loop ?? true });

export const playShakeSound = (options?: { volume?: number }) =>
  playSound(SOUND_PATHS.shake, options);

export const stopBackgroundSound = () => stopSound(SOUND_PATHS.background);

export const stopAllAudio = stopAllSounds;

export { playSound, stopSound, SOUND_PATHS };
