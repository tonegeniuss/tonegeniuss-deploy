import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'

function App() {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const [audioUrl, setAudioUrl] = useState("https://www.kozco.com/tech/piano2-CoolEdit.mp3") // default sample
  const [region, setRegion] = useState(null)
  const [status, setStatus] = useState("")
  const [format, setFormat] = useState("mp3")

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
    }

    if (waveformRef.current && audioUrl) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ccc',
        progressColor: '#007bff',
        height: 100,
        responsive: true,
        url: audioUrl,
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
      })

      wavesurfer.on('region-updated', (newRegion) => {
        setRegion({
          start: newRegion.start.toFixed(2),
          end: newRegion.end.toFixed(2)
        })
      })

      wavesurferRef.current = wavesurfer
    }

    return () => wavesurferRef.current?.destroy()
  }, [audioUrl])

  const handleLoad = () => {
    setStatus("🔄 Loading audio...")
    setRegion(null)
    setAudioUrl(audioUrl.trim())
    setTimeout(() => setStatus("✅ Audio loaded! Select your part."), 2000)
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
      <p>Create your own ringtone from any audio</p>

      <input
        type="text"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        placeholder="Paste YouTube audio URL or direct link"
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleLoad} style={{ padding: 8, marginBottom: 20 }}>🎼 Load Audio</button>

      <div ref={waveformRef} style={{ marginBottom: 20 }} />

      {region && (
        <p>
          Selected region: <strong>{region.start}s – {region.end}s</strong>
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
