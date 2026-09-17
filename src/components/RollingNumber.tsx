import { useEffect, useState } from 'react';

type Props = { value: number; replayKey?: number };

export function RollingNumber({ value, replayKey = 0 }: Props) {
  const [started, setStarted] = useState(false);
  const text = value.toFixed(2);

  useEffect(() => {
    setStarted(false);
    const frame = window.requestAnimationFrame(() => setStarted(true));
    return () => window.cancelAnimationFrame(frame);
  }, [replayKey, value]);

  return (
    <span className="stitch-rolling-number" aria-label={text}>
      {text.split('').map((character, index) => character === '.' ? <span className="stitch-rolling-separator" key={`${character}-${index}`}>.</span> : <span className="stitch-digit-window" key={`${character}-${index}`}><span className="stitch-digit-track" style={{ transform: started ? `translateY(-${Number(character)}em)` : 'translateY(0)', transitionDelay: `${index * 55}ms` }}>{Array.from({ length: 10 }, (_, digit) => <span key={digit}>{digit}</span>)}</span></span>)}
    </span>
  );
}
