import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'

function App() {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const [audioUrl, setAudioUrl] = useState("")
  const [region, setRegion] = useState(null)
  const [status, setStatus] = useState("")
  const [format, setFormat] = useState("mp3")
  const [searchTerm, setSearchTerm] = useState("")

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

  const handleLoadUrl = () => {
    if (!audioUrl) {
      setStatus("❗ Please paste a valid URL first.")
      return
    }
    setStatus("🔄 Loading audio...")
    loadAudio(audioUrl.trim())
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setStatus("❗ Please enter a song name.")
      return
    }

    setStatus(`🔍 Searching "${searchTerm}" (simulated)...`)
    // Simulate fetching top result and loading sample MP3
    setTimeout(() => {
      const demoMp3 = "https://file-examples.com/storage/fe798a6f6a101b7cf3f9b06/2017/11/file_example_MP3_700KB.mp3"
      setAudioUrl(demoMp3)
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
      <p>Search or paste a link to create a ringtone</p>

      <input
        type="text"
        placeholder="Search song (e.g. Eminem - Lose Yourself)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleSearch} style={{ padding: 8, marginBottom: 20 }}>🔍 Search & Load</button>

      <input
        type="text"
        placeholder="...or paste YouTube/audio URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleLoadUrl} style={{ padding: 8, marginBottom: 20 }}>🔗 Load URL</button>

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
