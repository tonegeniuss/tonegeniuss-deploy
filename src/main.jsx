import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState("mp3")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [status, setStatus] = useState("")

  const handleDownload = () => {
    setStatus("Downloading ringtone...")
    // Placeholder – backend logic to be integrated next
    setTimeout(() => {
      setStatus("✅ Your ringtone is ready (download simulation)")
    }, 2000)
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: 600, margin: '50px auto', padding: 20 }}>
      <h1>ToneGeniuss 🎵</h1>
      <p>Make your own ringtone from any YouTube video</p>

      <input
        type="text"
        placeholder="Paste YouTube link here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "10px 0" }}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
        <input type="text" placeholder="Start (sec)" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="text" placeholder="End (sec)" value={end} onChange={(e) => setEnd(e.target.value)} />
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>
          Format:
          <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ marginLeft: 10 }}>
            <option value="mp3">Android (.mp3)</option>
            <option value="m4r">iPhone (.m4r)</option>
          </select>
        </label>
      </div>

      <button onClick={handleDownload} style={{ padding: 10, marginTop: 10 }}>
        🎧 Generate Ringtone
      </button>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
