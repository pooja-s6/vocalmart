import os
import shutil
import subprocess
import uuid
import wave

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

UPLOAD_FOLDER = "audio_samples"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {".webm", ".wav", ".ogg", ".mp3", ".m4a", ".mp4", ".mpeg", ".mpga"}
MODEL_NAME = "openai/whisper-base"


def resolve_ffmpeg():
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return None


FFMPEG = resolve_ffmpeg()
asr = pipeline("automatic-speech-recognition", model=MODEL_NAME)


def read_wav(path):
    with wave.open(path, "rb") as wav_file:
        sample_rate = wav_file.getframerate()
        channels = wav_file.getnchannels()
        sample_width = wav_file.getsampwidth()
        frames = wav_file.readframes(wav_file.getnframes())

    if sample_width == 2:
        audio = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
    elif sample_width == 4:
        audio = np.frombuffer(frames, dtype=np.int32).astype(np.float32) / 2147483648.0
    else:
        raise RuntimeError("Only 16-bit or 32-bit PCM wav audio can be transcribed.")

    if channels > 1:
        audio = audio.reshape(-1, channels).mean(axis=1)
    return audio, sample_rate


def convert_to_wav(source_path):
    if not FFMPEG:
        raise RuntimeError(
            "FFmpeg was not found. Install it and add it to PATH, then restart this service. "
            "On Windows: winget install --id Gyan.FFmpeg -e"
        )

    destination = f"{source_path}.wav"
    command = [
        FFMPEG,
        "-y",
        "-i",
        source_path,
        "-ar",
        "16000",
        "-ac",
        "1",
        "-f",
        "wav",
        destination,
    ]
    completed = subprocess.run(command, capture_output=True)
    if completed.returncode != 0 or not os.path.exists(destination):
        detail = completed.stderr.decode("utf-8", errors="replace")[-400:]
        raise RuntimeError(f"FFmpeg could not read that audio file. {detail}")
    return destination


@app.route("/")
def home():
    return "Voice Search API is running."


@app.route("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "model": MODEL_NAME,
            "ffmpeg": bool(FFMPEG),
        }
    )


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    upload = request.files["audio"]
    if not upload.filename and upload.content_length == 0:
        return jsonify({"error": "No audio file provided."}), 400

    original_name = secure_filename(upload.filename or "recording.webm")
    extension = os.path.splitext(original_name)[1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        extension = ".webm"

    stored_path = os.path.join(app.config["UPLOAD_FOLDER"], f"{uuid.uuid4().hex}{extension}")
    wav_path = None
    upload.save(stored_path)

    try:
        if os.path.getsize(stored_path) < 200:
            return jsonify({"error": "The recording was empty."}), 400

        wav_path = convert_to_wav(stored_path)
        audio, sample_rate = read_wav(wav_path)
        if audio.size == 0:
            return jsonify({"transcription": ""})

        result = asr({"array": audio, "sampling_rate": sample_rate}, generate_kwargs={"language": "en"})
        text = (result.get("text") or "").strip()
        print(f"Transcription: {text}")
        return jsonify({"transcription": text})
    except Exception as error:
        print(f"Whisper error: {error}")
        return jsonify({"error": str(error)}), 500
    finally:
        for path in {stored_path, wav_path}:
            if path and os.path.exists(path):
                os.remove(path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False, use_reloader=False)
