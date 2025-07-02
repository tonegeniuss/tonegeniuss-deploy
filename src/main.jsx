from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import os
import uuid
import subprocess
import requests
from urllib.parse import parse_qs, urlparse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = "downloads"
os.makedirs(OUTPUT_DIR, exist_ok=True)

INVIDIOUS_INSTANCES = [
    "yewtu.be",
    "yewtu.eu"
]

def fetch_invidious_json(path: str):
    for inst in INVIDIOUS_INSTANCES:
        try:
            resp = requests.get(f"https://{inst}{path}", timeout=10)
            resp.raise_for_status()
            return resp.json()
        except Exception:
            continue
    return None

@app.get("/")
def root():
    return {"status": "ToneGeniuss Backend Running"}

@app.get("/extract-audio/")
def extract_audio(query: str = Query(...),
                  start: float = Query(0),
                  end: float = Query(30),
                  format: str = Query("mp3")):
    vid = None
    if "youtu" in query:
        p = urlparse(query)
        qs = parse_qs(p.query)
        vid = qs.get("v", [None])[0]
    else:
        search = fetch_invidious_json(f"/api/v1/search?q={query}")
        if not search:
            return JSONResponse({"error": "Search API unavailable or returned no results"}, status_code=502)
        vid = search[0].get("videoId")
    if not vid:
        return JSONResponse({"error": "Invalid YouTube link or no results"}, status_code=400)
    info = fetch_invidious_json(f"/api/v1/videos/{vid}")
    if not info or "adaptiveFormats" not in info:
        return JSONResponse({"error": "Video API unavailable or invalid response"}, status_code=502)
    formats = info["adaptiveFormats"]
    audio_fmt = next((f for f in formats if f.get("mimeType", "").startswith("audio")), None)
    if not audio_fmt or "url" not in audio_fmt:
        return JSONResponse({"error": "No audio format found"}, status_code=500)
    source_url = audio_fmt["url"]
    filename_id = str(uuid.uuid4())
    temp_path  = os.path.join(OUTPUT_DIR, f"{filename_id}_orig.mp3")
    final_path = os.path.join(OUTPUT_DIR, f"{filename_id}_trim.{format}")
    subprocess.run(["curl", "-L", source_url, "-o", temp_path], check=True)
    subprocess.run([
        "ffmpeg", "-y",
        "-ss", str(start), "-to", str(end),
        "-i", temp_path,
        final_path
    ], check=True)
    os.remove(temp_path)
    return {"file_url": f"/download/{filename_id}_trim.{format}"}

@app.get("/download/{filename}")
def download_file(filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path, media_type="audio/mpeg", filename=filename)
    return JSONResponse({"error": "File not found"}, status_code=404)
