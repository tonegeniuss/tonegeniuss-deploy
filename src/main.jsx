import React, { useState } from "react";
import WaveSurfer from "wavesurfer.js";

function App() {
  const [url, setUrl] = useState("");
  const [waveform, setWaveform] = useState(null);
  const [audio, setAudio] = useState(null);

  const loadAudio = async () => {
    try {
      const backend = "https://tonegeniuss-backend-1.onrender.com";
      const response = await fetch(`${backend}/extract-audio/?query=${encodeURIComponent(url)}&start=0&end=30&format=mp3`);
      const data = await response.json();
      if (data.file_url) {
        const fullUrl = `${backend}${data.file_url}`;
        setAudio(fullUrl);

        const wave = WaveSurfer.create({
          container: "#waveform",
          waveColor: "gray",
          progressColor: "purple",
        });
        wave.load(fullUrl);
        setWaveform(wave);
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      alert("Request failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ToneGeniuss</h1>
      <input
        type="text"
        placeholder="Paste YouTube link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px" }}
      />
      <button onClick={loadAudio}>Load into Waveform</button>
      <div id="waveform" style={{ marginTop: "30px" }} />
      {audio && <audio controls src={audio} style={{ marginTop: "20px" }} />}
    </div>
  );
}

export default App;
