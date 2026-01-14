'use client'

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import EntranceOne from '@/components/EntraceOne/';
import { useSound } from './SoundProvider';

export default function SoundGate({ children }: { children: React.ReactNode }) {
  const { loaded, preference, setPreference, toggle } = useSound();

  // Until localStorage has been read, render nothing behind (prevents gate flash + EntranceOne starting).
  if (!loaded) return null;

  const showGate = preference === 'unknown';

  return (
    <>
      {/* Block app entrance until sound choice is made */}
      {!showGate ? <EntranceOne>{children}</EntranceOne> : null}

      {showGate ? (
        <div className="sound-gate" role="dialog" aria-modal="true" aria-label="Sound preference">
          <div className="sound-gate__inner">
            <h2 className="sound-gate__title">SOUND</h2>
            <div className="sound-gate__btns">
              <button
                type="button"
                className="sound-gate__choice"
                onClick={() => setPreference('on')}
              >
                <span className="sound-gate__circle" aria-hidden>
                  <Volume2 size={22} />
                </span>
                <span className="sound-gate__label">ON</span>
              </button>

              <button
                type="button"
                className="sound-gate__choice"
                onClick={() => setPreference('off')}
              >
                <span className="sound-gate__circle" aria-hidden>
                  <VolumeX size={22} />
                </span>
                <span className="sound-gate__label">OFF</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Floating mute/unmute button (global, layout-level) */}
      {preference !== 'unknown' ? (
        <button
          type="button"
          className="sound-fab"
          aria-label={preference === 'on' ? 'Mute sound' : 'Unmute sound'}
          onClick={toggle}
        >
          {preference === 'on' ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      ) : null}
    </>
  );
}
