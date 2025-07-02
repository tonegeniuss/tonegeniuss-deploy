import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

const BACKEND = "https://tonegeniuss-backend-1.onrender.com";

function App() {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [format, setFormat] = useState("mp3");
  const [region, setRegion] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    if (!input) return;

    wavesurferRef.current?.destroy();
    setRegion(null);
    setDownloadUrl("");
    setStatus("🔄 Loading audio into waveform...");

    const url =
      input.includes("youtube")
        ? `${BACKEND}/extract-audio/?query=${encodeURIComponent(
            input
          )}&start=0&end=30&format=mp3`
        : input;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#007bff",
      height: 100,
      responsive: true,
      url,
      plugins: [RegionsPlugin.create({ dragSelection: { slop: 5 } })],
    });

    ws.on("ready", () => {
      ws.enableDragSelection({ color: "rgba(0,123,255,0.1)" });
      setStatus("✅ Drag to select the part you want below.");
    });

    ws.on("region-updated", (r) =>
      setRegion({ start: +r.start.toFixed(2), end: +r.end.toFixed(2) })
    );

    wavesurferRef.current = ws;
    return () => ws.destroy();
  }, [input]);

  const handleLoad = () => {
    if (!input.trim()) {
      setStatus("❗ Please enter a link or search term.");
      return;
    }
    setInput(input.trim());
  };

  const handleGenerate = async () => {
    if (!region) {
      setStatus("⚠️ Select a region first on the waveform.");
      return;
    }
    setStatus("🔊 Generating trimmed ringtone…");

    try {
      const resp = await fetch(
        `${BACKEND}/extract-audio/?query=${encodeURIComponent(
          input
        )}&start=${region.start}&end=${region.end}&format=${format}`
      );
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      const url = BACKEND + data.file_url;
      setDownloadUrl(url);
      setStatus("✅ Ringtone ready—click the link below to download.");
    } catch (e) {
      setStatus("❌ Error: " + e.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h1>ToneGeniuss 🎵</h1>
      <input
        style={{ width: "100%", padding: 10 }}
        placeholder="Paste YouTube link or type a song name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleLoad} style={{ margin: "10px" }}>
        ▶️ Load into Waveform
      </button>

      <div ref={waveformRef} style={{ margin: "20px 0" }} />

      {region && (
        <p>
          Selected: <strong>{region.start}s – {region.end}s</strong>
        </p>
      )}

      <div style={{ margin: "10px" }}>
        <label>
          Format:&nbsp;
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="mp3">Android (.mp3)</option>
            <option value="m4r">iPhone (.m4r)</option>
          </select>
        </label>
      </div>

      <button onClick={handleGenerate} style={{ padding: "10px 20px" }}>
        📥 Generate Ringtone
      </button>

      {downloadUrl && (
        <p style={{ marginTop: 20 }}>
          <a href={downloadUrl} download>
            Download your ringtone
          </a>
        </p>
      )}

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
