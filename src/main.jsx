import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

function App() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(30);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const extractAudio = async () => {
    setLoading(true);
    setFileUrl(null);
    const url = new URL("https://tonegeniuss-backend-1.onrender.com/extract-audio/");
    url.searchParams.append("query", link);
    url.searchParams.append("start", start);
    url.searchParams.append("end", end);
    url.searchParams.append("format", "mp3");

    const response = await fetch(url);
    const result = await response.json();
    setLoading(false);
    if (result.file_url) {
      setFileUrl("https://tonegeniuss-backend-1.onrender.com" + result.file_url);
    } else {
      alert("Error: " + JSON.stringify(result.error || result.details));
    }
  };

  const loadWaveform = async () => {
    setLoading(true);
    setFileUrl(null);
    const url = new URL("https://tonegeniuss-backend-1.onrender.com/extract-audio/");
    url.searchParams.append("query", link);
    url.searchParams.append("start", 0);
    url.searchParams.append("end", 30);
    url.searchParams.append("format", "mp3");

    const response = await fetch(url);
    const result = await response.json();
    setLoading(false);

    if (result.file_url) {
      const audioPath = "https://tonegeniuss-backend-1.onrender.com" + result.file_url;
      if (wavesurfer.current) wavesurfer.current.destroy();

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#555",
        url: audioPath,
      });

      wavesurfer.current.on("ready", () => {
        setAudioLoaded(true);
        setStart(0);
        setEnd(30);
      });
    } else {
      alert("Error loading waveform: " + JSON.stringify(result.error || result.details));
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🎵 ToneGeniuss</h1>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste YouTube link here"
        style={{ width: "80%", padding: 10, fontSize: 16 }}
      />
      <br /><br />
      <button onClick={loadWaveform} disabled={loading || !link}>
        Load into Waveform
      </button>
      <div ref={waveformRef} style={{ marginTop: 20, height: 100 }} />
      {audioLoaded && (
        <>
          <p>Start: <input type="number" value={start} onChange={(e) => setStart(e.target.value)} /></p>
          <p>End: <input type="number" value={end} onChange={(e) => setEnd(e.target.value)} /></p>
          <button onClick={extractAudio} disabled={loading}>Trim + Download</button>
        </>
      )}
      {loading && <p>Processing...</p>}
      {fileUrl && (
        <p>
          ✅ <a href={fileUrl} target="_blank" rel="noreferrer">Click here to download ringtone</a>
        </p>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
