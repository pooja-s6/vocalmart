import { useCallback } from 'react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { interpretVoice } from '../voice/interpret';
import type { VoiceIntent } from '../voice/types';

export function VoiceSearch({
  onIntent,
  label = 'Voice search',
}: {
  onIntent: (intent: VoiceIntent) => void;
  label?: string;
}) {
  const handleFinal = useCallback((transcript: string) => {
    onIntent(interpretVoice(transcript));
  }, [onIntent]);
  const { listening, supported, interim, error, start, stop } = useVoiceSearch(handleFinal);

  return (
    <div className="voice-search">
      <button
        className={listening ? 'mic listening' : 'mic'}
        type="button"
        aria-pressed={listening}
        onClick={() => (listening ? stop() : start())}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
        </svg>
        {listening ? 'Listening…' : label}
      </button>
      {!supported && <p className="voice-status">Voice search works in Chrome or Edge. Example phrases still work.</p>}
      {interim && <p className="voice-status" aria-live="polite">Hearing: {interim}</p>}
      {error && <p className="voice-status warn" aria-live="polite">{error}</p>}
    </div>
  );
}
