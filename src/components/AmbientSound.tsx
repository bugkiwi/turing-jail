import { useEffect, useRef } from 'react';

type Props = { enabled: boolean };

export function AmbientSound({ enabled }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
    const audio = audioRef.current;
    if (!audio) return;
    if (enabled) {
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [enabled]);

  useEffect(() => {
    const audio = new Audio('/audio/turing-jail-ambient.mp3');
    audio.loop = true;
    audio.volume = 0.16;
    audio.preload = 'auto';
    audioRef.current = audio;

    const tryStart = () => {
      if (enabledRef.current) void audio.play().catch(() => undefined);
    };
    window.addEventListener('pointerdown', tryStart, { passive: true });
    window.addEventListener('keydown', tryStart);
    tryStart();

    return () => {
      window.removeEventListener('pointerdown', tryStart);
      window.removeEventListener('keydown', tryStart);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, []);

  return null;
}
