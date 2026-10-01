# VocalMart Improvements

This pass connects the existing Voice button to the existing Flask Whisper service and to the Spring product catalog. It does not replace Whisper, and it does not add a second voice component.

## Voice architecture

```text
Voice button
  -> browser microphone permission
  -> MediaRecorder (WebM/Opus in Chrome, or MP4 where that is what the browser supports)
  -> POST http://localhost:5000/transcribe
  -> FFmpeg converts the clip to 16 kHz mono WAV
  -> openai/whisper-base
  -> JSON { "transcription": "..." }
  -> interpretVoiceTranscript()
  -> filter the products already loaded from Spring Boot
  -> Products page
```

The old button used `webkitSpeechRecognition` and never called Flask. That path is gone from `VoiceSearch.js`. Flask in `voice_search_project/app.py` is the transcription service.

The catalog is still Spring Boot on port 8081. Voice search filters that list in the browser. It does not query a second product database.

## FFmpeg requirement

Whisper cannot read a browser recording by itself. FFmpeg has to turn WebM, MP4, or other uploads into a 16 kHz mono WAV before transcription.

Windows install:

```powershell
winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
```

Close the terminal and open a new one, then check:

```powershell
ffmpeg -version
```

This machine completed that install (Gyan.FFmpeg 9.0.2). A new terminal is required before `ffmpeg` is on `PATH`.

If `ffmpeg` is not on `PATH`, the Flask app uses the `imageio-ffmpeg` package listed in `voice_search_project/requirements.txt`. That package ships an FFmpeg binary. `GET /health` reports `"ffmpeg": true` when either the system binary or that package is available.

Restart Flask after installing FFmpeg:

```powershell
Set-Location voice_search_project
pip install -r requirements.txt
$env:PYTHONIOENCODING = "utf-8"
python app.py
```

`PYTHONIOENCODING=utf-8` matters on Windows if any log line contains characters the cp1252 console cannot print. The transcription route itself no longer prints emoji.

## Flask endpoint

| Method | Path | Result |
| --- | --- | --- |
| GET | `/` | `Voice Search API is running.` |
| GET | `/health` | `{ "status": "ok", "model": "openai/whisper-base", "ffmpeg": true }` |
| POST | `/transcribe` | Form field `audio`. Returns `{ "transcription": "..." }` or `{ "error": "..." }`. |

CORS allows the React app on another port to post the recording. Verified from the page at `http://localhost:3000`.

Accepted uploads include `.webm`, `.wav`, `.ogg`, `.mp3`, `.m4a`, and `.mp4`. Chrome's MediaRecorder output was tested as `headphones.webm` and returned `Search for headphones.`

## React integration

- `voice-search-frontend/src/components/VoiceSearch.js` records for up to 7 seconds, or until the button is clicked again.
- States shown on the button or beside it: `Listening...`, `Processing...`, `Results found`, `No results found`, `Microphone permission denied`, `Voice search unavailable`, `No speech detected`.
- The voice API base URL is `REACT_APP_VOICE_API_URL`, default `http://localhost:5000`.
- `voice-search-frontend/src/voiceQuery.js` reads the real transcript. It does not invent product names.
- A transcript can set the text query, a known category (Electronics, Grocery, Clothing, Kitchen), and a maximum price (`under 2000`, `below`, `less than`, `up to`).
- The search box updates to the interpreted query. The products header shows the heard sentence.

## Speech-to-text model

`openai/whisper-base`, loaded once at Flask startup through Hugging Face Transformers. No API key. The first run downloads the model. Later runs use the local Hugging Face cache. Internet is not required after the model is cached. FFmpeg is still required to decode browser audio.

## Example tested commands

Transcripts below are what Whisper actually returned. They were not typed in by hand.

| Spoken phrase | Transcript | Products shown |
| --- | --- | --- |
| Search for headphones | `Search for headphones.` | Wireless Headphones |
| Show electronics | `show electronics.` | Wireless Headphones, Smart Watch, USB-C Laptop Stand, Portable Bluetooth Speaker, LED Desk Lamp. Electronics chip selected. |
| Find smart watch | `Find smartwatch.` | Smart Watch. The catalog name is "Smart Watch"; the search also matches the spaced form. |
| Show products under 2000 | `show products under 2000.` | 16 products priced at or below ₹2000. Headphones (₹2999), Smart Watch (₹4999), the speaker (₹2199), and sneakers (₹2299) were excluded. |

The four phrase tests went through the Voice button: the browser recorded the audio with MediaRecorder, posted it to `/transcribe`, and rendered the catalog matches. The audio for those four sentences was Windows speech synthesis played into that same microphone stream, because this session cannot speak into a physical microphone.

A separate click on Voice, using the browser's real microphone permission, recorded room silence. Whisper returned `Thank you.` and the page showed `No products found`. That sentence was not hardcoded.

Direct API checks that also passed:

- `GET /health` with `"ffmpeg": true`
- `POST /transcribe` of the WAV files
- `POST /transcribe` of the WebM file produced from the headphones WAV

## Remaining limitations

- Silence or noise can be transcribed as a short phrase such as "Thank you." The page then searches for that phrase and correctly shows no products. It does not mean the microphone failed.
- Voice search does not add items to the cart. "Add headphones to cart" is not a supported command. The transcript is only used as a search.
- The physical microphone was not used to speak the four test sentences. The recording code was used, with synthesized speech as the input stream.
- `Microphone permission denied` is implemented and was not triggered here, because this browser allowed the microphone.
- Product cards still show `No Image` and dollar prices. The cart still breaks when quantity changes, because it calls the Node API with Spring product ids. Checkout still does not save an order. Login is still a local demo. The Table page is still empty. The homepage still says MongoDB. Those are separate from this voice fix.

## Run instructions

Three processes:

```powershell
# 1. Product API — http://localhost:8081
Set-Location vocalmart\productapi
.\mvnw.cmd spring-boot:run

# 2. Voice API — http://localhost:5000
Set-Location vocalmart\voice_search_project
pip install -r requirements.txt
$env:PYTHONIOENCODING = "utf-8"
python app.py

# 3. Storefront — http://localhost:3000
Set-Location vocalmart\voice-search-frontend
npm start
```

Install FFmpeg first if `GET /health` reports `"ffmpeg": false`.

Click Voice, allow the microphone, and say "search for headphones" or "show products under 2000".
