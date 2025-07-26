import React, { useState, useRef } from 'react';

function VoiceRecorder({ onVoiceResult }) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [lastTranscription, setLastTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError(null);
      setLastTranscription('');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Voice recording not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      setError(`Microphone error: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);

      const stream = mediaRecorderRef.current.stream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      setProcessing(true);
    }
  };

  const handleStop = async () => {
    if (audioChunksRef.current.length === 0) {
      setError('No audio data recorded.');
      setProcessing(false);
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch('http://127.0.0.1:5000/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const transcription = data.transcription || '';
      setLastTranscription(transcription);

      if (transcription.trim()) {
        onVoiceResult(transcription.trim());
      } else {
        setError('No speech detected.');
      }
    } catch (err) {
      console.error('Voice search failed:', err);
      setError(`Voice search failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleClick = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="voice-recorder">
      <button
        onClick={handleClick}
        disabled={processing}
        className={`voice-button ${recording ? 'recording' : ''} ${processing ? 'processing' : ''}`}
        title={recording ? 'Stop recording' : 'Start voice search'}
      >
        {processing ? '⏳' : recording ? '🛑 Stop' : '🎤 Speak'}
      </button>

      {error && <div className="voice-error">{error}</div>}
      {recording && <div className="voice-status">🔴 Recording...</div>}
      {processing && <div className="voice-status">⏳ Processing...</div>}
      {lastTranscription && (
        <div className="voice-status">
          <strong>Heard:</strong> "{lastTranscription}"
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;
