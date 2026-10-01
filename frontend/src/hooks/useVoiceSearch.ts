import { useEffect, useRef, useState } from 'react';
import { createRecognition, voiceSearchSupported } from '../voice/speech';

export function useVoiceSearch(onFinal: (transcript: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const onFinalRef = useRef(onFinal);
  const recognitionRef = useRef<ReturnType<typeof createRecognition>>(null);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    setSupported(voiceSearchSupported());
  }, []);

  function stop() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }

  function start() {
    recognitionRef.current?.stop();
    setError('');
    setInterim('');
    const recognition = createRecognition({
      onFinal: (transcript) => {
        setInterim('');
        onFinalRef.current(transcript);
      },
      onInterim: setInterim,
      onError: (message) => {
        setError(message);
        setListening(false);
      },
      onEnd: () => setListening(false),
    });
    if (!recognition) {
      setSupported(false);
      setError('Voice search works in Chrome or Edge. You can still tap an example phrase.');
      return;
    }
    try {
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      setError('Voice search is already listening.');
    }
  }

  return { listening, supported, interim, error, start, stop };
}
