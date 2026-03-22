'use client';

import { useState, useEffect } from 'react';

interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function computeRemaining(target: string): CountdownResult {
  const diff = new Date(target).getTime() - Date.now();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, isExpired: false };
}

export function useCountdown(target: string): CountdownResult {
  const [remaining, setRemaining] = useState<CountdownResult>(() =>
    computeRemaining(target)
  );

  useEffect(() => {
    const update = () => setRemaining(computeRemaining(target));
    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return remaining;
}
