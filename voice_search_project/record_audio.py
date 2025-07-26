import sounddevice as sd
from scipy.io.wavfile import write

# Settings
duration = 5  # seconds
samplerate = 16000  # 16kHz - preferred by Whisper
output_path = "audio_samples/live_record.wav"

print("🎙️ Recording... Speak now!")
recording = sd.rec(int(samplerate * duration), samplerate=samplerate, channels=1, dtype='int16')
sd.wait()
write(output_path, samplerate, recording)
print(f"✅ Recording saved to {output_path}")
