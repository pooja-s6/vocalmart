import React, { useRef, useState } from 'react';

const VOICE_API = process.env.REACT_APP_VOICE_API_URL || 'http://localhost:5000';
const MAX_RECORDING_MS = 7000;

function extensionFor(mimeType) {
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

async function transcribeBlob(blob) {
  const form = new FormData();
  const mimeType = blob.type || 'audio/webm';
  form.append('audio', blob, `recording.${extensionFor(mimeType)}`);

  let response;
  try {
    response = await fetch(`${VOICE_API}/transcribe`, { method: 'POST', body: form });
  } catch (error) {
    throw new Error('Voice service is unavailable. Start the Flask API on port 5000.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Transcription failed');
  }
  return (data.transcription || '').trim();
}

function VoiceSearch({ onResult }) {
  const [phase, setPhase] = useState('idle');
  const [message, setMessage] = useState('');
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const busyRef = useRef(false);

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const finishRecording = () => {
    window.clearTimeout(timerRef.current);
    const recorder = recorderRef.current;
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      busyRef.current = false;
      setPhase('error');
      setMessage('Voice search unavailable');
      return;
    }

    setMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferredTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        releaseStream();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setPhase('processing');
        try {
          if (blob.size < 200) {
            setPhase('error');
            setMessage('No speech detected');
            return;
          }
          const transcript = await transcribeBlob(blob);
          if (!transcript) {
            setPhase('error');
            setMessage('No speech detected');
            return;
          }
          const matchCount = onResult(transcript);
          setPhase('idle');
          setMessage(matchCount > 0 ? 'Results found' : 'No results found');
        } catch (error) {
          setPhase('error');
          setMessage(error.message || 'Transcription failed');
        } finally {
          busyRef.current = false;
        }
      };

      recorderRef.current = recorder;
      recorder.start();
      setPhase('listening');
      timerRef.current = window.setTimeout(finishRecording, MAX_RECORDING_MS);
    } catch (error) {
      releaseStream();
      busyRef.current = false;
      const denied = error?.name === 'NotAllowedError' || error?.name === 'SecurityError';
      setPhase('error');
      setMessage(denied ? 'Microphone permission denied' : 'Voice search unavailable');
    }
  };

  const handleClick = () => {
    if (phase === 'processing' || (busyRef.current && phase !== 'listening')) {
      return;
    }
    if (phase === 'listening') {
      finishRecording();
      return;
    }
    busyRef.current = true;
    startRecording();
  };

  const label = phase === 'listening' ? 'Listening...' : phase === 'processing' ? 'Processing...' : 'Voice';

  return (
    <div className="voice-control">
      <button
        type="button"
        className={`voice-button${phase === 'listening' ? ' listening' : ''}${phase === 'processing' ? ' processing' : ''}`}
        onClick={handleClick}
        disabled={phase === 'processing'}
        aria-pressed={phase === 'listening'}
        aria-label={phase === 'idle' ? 'Start voice search' : label}
      >
        {phase === 'idle' ? '🎤 Voice' : label}
      </button>
      <span className="voice-status" role="status" aria-live="polite">
        {message}
      </span>
    </div>
  );
}

export default VoiceSearch;
