import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'

function App() {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const [region, setRegion] = useState(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ccc',
        progressColor: '#007bff',
        height: 100,
        responsive: true,
        url: 'https://www.kozco.com/tech/piano2-CoolEdit.mp3', // TEMP: sample audio
        plugins: [
          RegionsPlugin.create({
            dragSelection: {
              slop: 5
            }
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
  }, [])

  const handleDownload = () => {
    if (!region) {
      setStatus("⚠️ Please select a region first.")
      return
    }

    setStatus(`🔄 Preparing ringtone from ${region.start}s to ${region.end}s...`)
    setTimeout(() => {
      setStatus("✅ Your ringtone is ready! (Simulated)")
    }, 2000)
  }

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', textAlign: 'center', padding: 20 }}>
      <h1>ToneGeniuss 🎵</h1>
      <p>Select part of the audio to create a ringtone</p>
      <div ref={waveformRef} style={{ marginBottom: 20 }} />
      {region && (
        <p>
          Selected: <strong>{region.start}s – {region.end}s</strong>
        </p>
      )}
      <button onClick={handleDownload} style={{ padding: 10, marginTop: 10 }}>
        🎧 Generate Ringtone
      </button>
      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
