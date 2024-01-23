/**
 * This file defines a SaveAsWav component for React that is used to save audio data as a WAV file.
 * It includes:
 * - Importing necessary libraries and functions.
 * - The SaveAsWav component which renders a button. When this button is clicked, the 'saveAsWav' function is called.
 * - The 'saveAsWav' function converts the audio data to a WAV file and saves it to the project's 'sounds' folder.
 * - The 'audioData' and 'activeSoundResourceId' props are used to get the audio data and the name of the sound resource.
 * - The 'AudioContext' is used to decode the audio data.
 * - The 'toWav' function is used to convert the audio buffer to a WAV buffer.
 * - The 'electronAPI.saveWavFile' function is used to save the WAV buffer to a file.
 * - Errors are logged to the console.
 */

import toWav from 'audiobuffer-to-wav'

const SaveAsWav = (props) => {
  const saveAsWav = async () => {
    if (!props.audioData || !props.activeSoundResourceId) return

    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await props.audioData.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const wavBuffer = toWav(audioBuffer)
      const projectFolderPath = localStorage.getItem('currentProjectPath')

      if (!projectFolderPath) {
        throw new Error('Project path not found')
      }

      const soundName = props.activeSoundResourceId + '.wav'
      const soundFolderPath = `${projectFolderPath}/sounds`

      console.log('WAV buffer:', wavBuffer)
      console.log('Sound name:', soundName)

      window.electronAPI
        .saveWavFile(soundFolderPath, soundName, wavBuffer)

        .then((response) => {
          if (response.success) {
            console.log('WAV file saved to:', response.path)
          } else {
            console.error('Error saving WAV file:', response.error)
          }
        })
        .catch((error) => console.error('IPC error:', error))
    } catch (error) {
      console.error('Error processing audio data:', error)
    }
  }

  return <button onClick={saveAsWav}>Save as WAV</button>
}

export default SaveAsWav
