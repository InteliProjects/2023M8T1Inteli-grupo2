/**
 * This file defines a MusicModal component for React that is used to handle audio recording and uploading.
 * It includes:
 * - Importing necessary libraries, components, and functions.
 * - The MusicModalProps interface to define properties such as 'show', 'onClose', 'onConfirm', and 'activeSoundResourceId'.
 * - The MusicModal component which renders either the AudioRecorder or AudioUploader component based on the current mode.
 * - The 'show' prop determines whether the modal is displayed.
 * - The 'onClose' prop is a callback function to be called when the modal is closed.
 * - The 'onConfirm' prop is a callback function to be called when the audio data is confirmed.
 * - The 'activeSoundResourceId' prop is the id of the currently active sound resource.
 * - The 'saveAsWav' function is used to convert the audio data to WAV format and save it to the project folder.
 */

import React, { useState } from 'react'
import AudioRecorder from '../AudioRecord'
import AudioUploader from '../AudioUpload'
import toWav from 'audiobuffer-to-wav'

interface MusicModalProps {
  show: boolean
  onClose: () => void
  onConfirm: (audioData, activeSoundResourceId: string) => void
  activeSoundResourceId: string
}

const MusicModal = (props: MusicModalProps) => {
  const [mode, setMode] = useState<string | null>(null)

  if (!props.show) return null

  const saveAsWav = async (audioData, activeSoundResourceId: string) => {
    if (audioData === null || !activeSoundResourceId) return

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioData.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const wavBuffer = toWav(audioBuffer)
      const projectFolderPath = localStorage.getItem('currentProjectPath')

      if (!projectFolderPath) {
        throw new Error('Project path not found')
      }

      const soundName = activeSoundResourceId + '.wav'
      const soundFolderPath = `${projectFolderPath}/audios`

      console.log('WAV buffer:', wavBuffer)
      console.log('Sound name:', soundName)

      const response = await window.electronAPI.saveWavFile(soundFolderPath, soundName, wavBuffer)
      console.log('WAV file saved to:', response.path)
    } catch (error) {
      console.error('Error processing audio data:', error)
    }
  }

  const handleConfirm = async (audioData) => {
    console.log(audioData)
    await saveAsWav(audioData, props.activeSoundResourceId)
    props.onConfirm(audioData, props.activeSoundResourceId)
    setMode(null)
  }

  const handleCancel = () => {
    setMode(null)
    props.onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md w-full max-w-md">
        <div className="border-b dark:border-gray-600 p-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Adicionar Música ou Som
          </h4>
        </div>
        <div className="p-4">
          {!mode && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setMode('record')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Gravar Áudio
              </button>
              <button
                onClick={() => setMode('upload')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                Carregar Arquivo
              </button>
            </div>
          )}
          {mode === 'record' && (
            <AudioRecorder
              confirmEvent={handleConfirm}
              activeSoundResourceId={props.activeSoundResourceId}
            />
          )}
          {mode === 'upload' && (
            <AudioUploader
              confirmEvent={handleConfirm}
              activeSoundResourceId={props.activeSoundResourceId}
            />
          )}
        </div>
        <div className="flex gap-5 justify-end p-4 border-t dark:border-gray-600">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default MusicModal
