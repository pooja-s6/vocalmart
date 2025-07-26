// VoiceRecorder.js
import React, { useState, useRef } from 'react';

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setTranscription('Microphone permission denied.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('http://127.0.0.1:5000/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setTranscription(data.transcription || 'No transcription returned.');
    } catch (err) {
      console.error(err);
      setTranscription('An error occurred while transcribing.');
    }
  };

  return (
    <div>
      <h2>Voice Recorder</h2>
      {!recording && (
        <button onClick={startRecording}>🎤 Start Recording</button>
      )}
      {recording && (
        <button onClick={stopRecording}>🛑 Stop Recording</button>
      )}
      <div className="transcription-box">
        <h3>Transcription:</h3>
        <p>{transcription}</p>
      </div>
    </div>
  );
}

export default VoiceRecorder;
