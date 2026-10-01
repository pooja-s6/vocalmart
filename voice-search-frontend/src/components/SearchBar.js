import React, { useState, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, onVoiceSearch }) {
  const [searchText, setSearchText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleTextSearch = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  const handleVoiceSearch = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          onVoiceSearch(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
      }
    }
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleTextSearch}>
        <input
          type="text"
          placeholder="Search for products... (e.g., 'laptop', 'phone', 'headphones')"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍 Search
        </button>
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`voice-button ${isRecording ? 'recording' : ''}`}
          title="Voice Search"
        >
          {isRecording ? '⏹️ Stop' : '🎤 Voice'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
