// This code allows the user to upload their own audio files and visualize them. The component uses the wavesurfer.js library to handle the audio visualization process.

import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface AudioUploaderProps {
  activeSoundResourceId: string
  confirmEvent: (audioData) => void
}

const AudioUploader = (props: AudioUploaderProps) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileBlob, setFileBlob] = useState(null) // Store the actual file blob

  const waveSurferRef = useRef(null)
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(URL.createObjectURL(file))
      setFileBlob(file) // Store the file blob
    }
  }

  const onConfirm = () => {
    props.confirmEvent(fileBlob)
  }

  useEffect(() => {
    if (uploadedFile) {
      waveSurferRef.current = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        barWidth: 2,
        height: 200,
        responsive: true,
        backend: 'WebAudio'
      })
      waveSurferRef.current.load(uploadedFile)
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy()
      }
    }
  }, [uploadedFile])

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div id="waveform" />
      {uploadedFile && (
        <>
          <div>
            <button
              onClick={() => {
                waveSurferRef.current.playPause()
              }}
            >
              Play/Pause
            </button>
          </div>
          <button onClick={onConfirm}>confirmar</button>
        </>
      )}
    </div>
  )
}

export default AudioUploader
