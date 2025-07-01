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
    // Re-trigger useEffect to reload waveform
    setAudioUrl(audioUrl.trim())
    setTimeout(() => setStatus("✅ Audio loaded! Select your part."), 2000)
  }

  const
