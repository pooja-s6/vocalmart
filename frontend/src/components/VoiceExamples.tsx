import { interpretVoice } from '../voice/interpret';
import { VOICE_EXAMPLES, type VoiceIntent } from '../voice/types';

export function VoiceExamples({ onIntent }: { onIntent: (intent: VoiceIntent) => void }) {
  return (
    <div className="voice-examples">
      <span className="muted">Try saying</span>
      {VOICE_EXAMPLES.map((phrase) => (
        <button key={phrase} className="chip" type="button" onClick={() => onIntent(interpretVoice(phrase))}>
          {phrase}
        </button>
      ))}
    </div>
  );
}
