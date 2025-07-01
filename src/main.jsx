import React, { useEffect, useRef, useState } from 'react'
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

  const loadAudio = (url) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
    }

    if (waveformRef.current && url) {
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
        setStatus("✅ Audio loaded! Select your part.")
      })

      wavesurfer.on('region-updated', (newRegion) => {
        setRegion({
          start: newRegion.start.toFixed(2),
          end: newRegion.end.toFixed(2)
        })
      })

      wavesurferRef.current = wavesurfer
    }
  }

  const handleLoad = () => {
    if (!input.trim()) {
      setStatus("❗ Enter a song name or link.")
      return
    }

    const isYouTube = input.includes("youtube.com") || input.includes("youtu.be")
    setStatus("🔄 Loading audio...")

    // For now, simulate result (later: backend fetch real audio from YouTube)
    setTimeout(() => {
      const demoMp3 = "https://file-examples.com/storage/fe798a6f6a101b7cf3f9b06/2017/11/file_example_MP3_700KB.mp3"
      loadAudio(demoMp3)
    }, 1500)
  }

  const handleDownload = () => {
    if (!region) {
      setStatus("⚠️ Please select a region first.")
      return
    }

    setStatus(`🔊 Preparing ringtone (${format}) from ${region.start}s to ${region.end}s...`)
    setTimeout(() => {
      setStatus(`✅ Ringtone ready! (Simulated: .${format})`)
    }, 2000)
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center', padding: 20 }}>
      <h1>ToneGeniuss 🎵</h1>
      <p>Paste a link or type a song name</p>

      <input
        type="text"
        placeholder="E.g. Rick Astley Never Gonna Give You Up or YouTube link"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <button onClick={handleLoad} style={{ padding: 8, marginBottom: 20 }}>🎼 Load</button>

      <div ref={waveformRef} style={{ marginBottom: 20 }} />

      {region && (
        <p>
          Selected: <strong>{region.start}s – {region.end}s</strong>
        </p>
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

      <button onClick={handleDownload} style={{ padding: 10 }}>
        📥 Generate Ringtone
      </button>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
