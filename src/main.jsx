import React, { useState } from "react";
import Waveform from "./Waveform";

export default function App() {
  const [query, setQuery] = useState("");
  const [waveData, setWaveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const loadAudio = async () => {
    setLoading(true);
    const start = 0;
    const end = 30;
    try {
      const response = await fetch(
        `https://tonegeniuss-backend-1.onrender.com/extract-audio/?query=${encodeURIComponent(
          query
        )}&start=${start}&end=${end}&format=mp3`
      );
      const data = await response.json();
      if (data.file_url) {
        const fileUrl = `https://tonegeniuss-backend-1.onrender.com${data.file_url}`;
        setAudioUrl(fileUrl);
        setWaveData(fileUrl);
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (error) {
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ToneGeniuss</h1>
      <input
        className="w-full border p-2 mb-4"
        placeholder="Paste YouTube link here"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={loadAudio}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load into waveform"}
      </button>
      {waveData && <Waveform url={waveData} />}
      {audioUrl && (
        <a
          href={audioUrl}
          className="block mt-4 text-blue-600 underline"
          download
        >
          Download Trimmed Ringtone
        </a>
      )}
    </div>
  );
}
