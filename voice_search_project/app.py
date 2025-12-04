from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import os
from werkzeug.utils import secure_filename

# ✅ Correct __name__
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "audio_samples"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ✅ Load Whisper once
asr = pipeline("automatic-speech-recognition", model="openai/whisper-base")

@app.route("/")
def home():
    return "Voice Search API is running."

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided."}), 400

    file = request.files["audio"]
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        print(f"✅ Processing: {file_path}")
        result = asr(file_path, generate_kwargs={"language": "en"})
        print(f"✅ Transcription: {result['text']}")
        return jsonify({"transcription": result["text"]})
    except Exception as e:
        print(f"❌ Whisper error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
