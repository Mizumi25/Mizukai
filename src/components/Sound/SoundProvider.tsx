'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type SoundPreference = 'unknown' | 'on' | 'off';

type SoundContextValue = {
  loaded: boolean;
  preference: SoundPreference;
  setPreference: (p: Exclude<SoundPreference, 'unknown'>) => void;
  toggle: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = 'mizukai_sound_preference';

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [preference, setPreferenceState] = useState<SoundPreference>('unknown');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load stored preference once - ALWAYS START WITH 'unknown' to show gate
  useEffect(() => {
    // Always start with 'unknown' so sound gate shows every time
    setPreferenceState('unknown');
    setLoaded(true);
  }, []);

  // Create audio element once.
  useEffect(() => {
    const audio = new Audio('/musics/Piano.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      // best-effort cleanup
      audioRef.current = null;
    };
  }, []);

  // Apply preference -> play/pause.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (preference === 'on') {
      audio.muted = false;
      audio.volume = 0.8;
      audio.play().catch(() => {
        // Autoplay can still be blocked; user can tap the floating button.
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [preference]);

  const setPreference = useCallback((p: Exclude<SoundPreference, 'unknown'>) => {
    setPreferenceState(p);
    try {
      window.localStorage.setItem(STORAGE_KEY, p);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    if (preference === 'unknown') return;
    setPreference(preference === 'on' ? 'off' : 'on');
  }, [preference, setPreference]);

  const value = useMemo<SoundContextValue>(
    () => ({
      loaded,
      preference,
      setPreference,
      toggle,
    }),
    [loaded, preference, setPreference, toggle]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within SoundProvider');
  return ctx;
}
