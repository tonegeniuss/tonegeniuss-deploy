import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import WaveSurfer from "wavesurfer.js";
import "./index.css";

const App = () => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [query, setQuery] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [format, setFormat] = useState("mp3");
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const backendUrl = "https://tonegeniuss-backend-1.onrender.com";

  const loadAudio = async () => {
    setAudioLoaded(false);
    setDownloadUrl("");

    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }

    const response = await fetch(
      `${backendUrl}/extract-audio/?query=${encodeURIComponent(query)}&start=0&end=30&format=mp3`
    );
    const data = await response.json();

    if (data.file_url) {
      const fileUrl = `${backendUrl}${data.file_url}`;
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#999",
        progressColor: "#555",
        height: 100,
        responsive: true,
        url: fileUrl,
      });

      wavesurfer.current.on("ready", () => {
        setAudioLoaded(true);
      });
    } else {
      alert("Failed to load audio");
    }
  };

  const download = async () => {
    const response = await fetch(
      `${backendUrl}/extract-audio/?query=${encodeURIComponent(
        query
      )}&start=${startTime}&end=${endTime}&format=${format}`
    );
    const data = await response.json();

    if (data.file_url) {
      setDownloadUrl(`${backendUrl}${data.file_url}`);
    } else {
      alert("Trimming failed.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>ToneGeniuss</h2>
      <input
        type="text"
        placeholder="Paste YouTube link or search keyword"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "80%", padding: "10px" }}
      />
      <button onClick={loadAudio} style={{ marginLeft: "10px", padding: "10px" }}>
        Load into Waveform
      </button>

      <div ref={waveformRef} style={{ marginTop: "30px" }}></div>

      {audioLoaded && (
        <div style={{ marginTop: "20px" }}>
          <label>Start (sec): </label>
          <input
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <label style={{ marginLeft: "10px" }}>End (sec): </label>
          <input
            type="number"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <label style={{ marginLeft: "10px" }}>Format: </label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="ogg">OGG</option>
          </select>
          <button onClick={download} style={{ marginLeft: "10px", padding: "10px" }}>
            Download
          </button>
        </div>
      )}

      {downloadUrl && (
        <div style={{ marginTop: "20px" }}>
          <a href={downloadUrl} download>
            Click here to download your ringtone
          </a>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
