import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'

function App() {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const [input, setInput] = useState("")
  const [region, setRegion] = useState(null)
  const [status, setStatus] = useState("")
  const [format, setFormat] = useState("mp3")
  const [downloadLink, setDownloadLink] = useState(null)

  const loadAudio = async (url) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
    }

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#ccc',
      progressColor: '#007bff',
      height: 100,
      responsive: true,
      url: url,
      plugins: [
        RegionsPlugin.create({
          dragSelection: { slop: 5 }
        })
      ]
    })

    wavesurfer.on('ready', () => {
      wavesurfer.enableDragSelection({
        color: 'rgba(0, 123, 255, 0.1)'
      })
      setStatus("✅ Audio loaded. Select your part.")
    })

    wavesurfer.on('region-updated', (newRegion) => {
      setRegion({
        start: newRegion.start.toFixed(2),
        end: newRegion.end.toFixed(2)
      })
    })

    wavesurferRef.current = wavesurfer
  }

  const handleLoad = async () => {
    setDownloadLink(null)
    if (!input.trim()) {
      setStatus("❗ Enter a song name or link.")
      return
    }

    setStatus("🔄 Fetching audio...")
    const demoMp3 = "https://file-examples.com/storage/fe798a6f6a101b7cf3f9b06/2017/11/file_example_MP3_700KB.mp3"
    await loadAudio(demoMp3)
  }

  const handleGenerate = async () => {
    if (!region || !input.trim()) {
      setStatus("⚠️ Please select a region and provide a link.")
      return
    }

    setStatus("🎧 Processing ringtone...")

    const apiUrl = `https://tonegeniuss-backend-1.onrender.com/extract-audio/?query=${encodeURIComponent(input)}&start=${region.start}&end=${region.end}&format=${format}`

    try {
      const res = await fetch(apiUrl)
      const data = await res.json()
      if (data.file_url) {
        const fullLink = `https://tonegeniuss-backend-1.onrender.com${data.file_url}`
        setDownloadLink(fullLink)
        setStatus("✅ Ringtone ready!")
      } else {
        setStatus("❌ Failed to process ringtone.")
      }
    } catch (e) {
      setStatus("❌ Error contacting server.")
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center', padding: 20 }}>
      <h1>ToneGeniuss 🎵</h1>
      <p>Paste a YouTube link or type a song name</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="E.g. Never Gonna Give You Up or https://youtube.com/..."
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleLoad} style={{ padding: 8, marginBottom: 20 }}>🎼 Load Audio</button>

      <div ref={waveformRef} style={{ marginBottom: 20 }} />

      {region && (
        <p>Selected: <strong>{region.start}s – {region.end}s</strong></p>
      )}

      <div style={{ marginBottom: 10 }}>
        <label>
          Format:
          <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ marginLeft: 10 }}>
            <option value="mp3">Android (.mp3)</option>
            <option value="m4r">iPhone (.m4r)</option>
          </select>
        </label>
      </div>

      <button onClick={handleGenerate} style={{ padding: 10 }}>
        📥 Generate Ringtone
      </button>

      {downloadLink && (
        <p style={{ marginTop: 20 }}>
          ✅ <a href={downloadLink} target="_blank" rel="noopener noreferrer">Download Ringtone</a>
        </p>
      )}

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
