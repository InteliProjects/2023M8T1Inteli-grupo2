// This script is part of the preload phase in an Electron application, which securely exposes selected Electron APIs to the renderer process.
// It uses the 'contextBridge' module from Electron to safely expose IPC (Inter-Process Communication) functionality to the renderer.
// The script:
// - Defines a set of methods under 'electronAPI' and 'api' that the renderer process can use. These methods act as wrappers around 'ipcRenderer.invoke' calls, facilitating communication with the main process.
// - Each method corresponds to a specific IPC event, such as file operations (read/write), image saving, project folder management, and canvas state handling.
// - Utilizes 'contextBridge.exposeInMainWorld' to expose these methods in the renderer's global scope, enhancing security by maintaining context isolation.
// - Includes a conditional check for 'process.contextIsolated' to determine the method of exposing the API, ensuring compatibility with different Electron security settings.
// - Handles errors during the context bridge exposure process and logs them to the console.
// - Provides TypeScript annotations for type safety and clarity in function signatures.
// - The script serves as a crucial link between the renderer and the main process, allowing the frontend to leverage Electron's powerful capabilities without direct access to its APIs.

import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  saveImage: (fileName, imgData) => ipcRenderer.invoke('save-image', fileName, imgData),
  createNewFolder: (folderName) => ipcRenderer.invoke('create-new-folder', folderName),
  readProjectFolders: (baseDirectory) => ipcRenderer.invoke('read-project-folders', baseDirectory),
  createProjectInfo: (projectFolderPath) =>
    ipcRenderer.invoke('create-project-info', projectFolderPath),
  updateProjectInfo: (projectFolderPath, data) =>
    ipcRenderer.invoke('update-project-info', projectFolderPath, data),
  getFolderPath: (folderName) => ipcRenderer.invoke('get-folder-path', folderName),
  saveCanvasState: (filePath, data) => ipcRenderer.invoke('save-canvas-state', filePath, data),
  readCanvasState: (filePath) => ipcRenderer.invoke('read-canvas-state', filePath),
  uploadAndSaveImage: (filePath, data) =>
    ipcRenderer.invoke('upload-and-save-image', filePath, data),
  readFileAsBuffer: (filePath) => ipcRenderer.invoke('readFileAsBuffer', filePath),
  convertArrayBufferToBuffer: (arrayBuffer) => Buffer.from(arrayBuffer),
  convertBlobToOgg: (buffer) => ipcRenderer.invoke('convert-blob-to-ogg', buffer),
  saveWavFile: (filePath, soundName, wavBuffer) =>
    ipcRenderer.invoke('save-wav-file', filePath, soundName, wavBuffer)
})

// Custom APIs for renderer
export const api = {
  readFile: (filePath: string): Promise<unknown> => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content): Promise<unknown> =>
    ipcRenderer.invoke('write-file', filePath, content),
  saveImage: (fileName, imgData): Promise<unknown> =>
    ipcRenderer.invoke('save-image', fileName, imgData),
  createNewFolder: (folderName): Promise<unknown> =>
    ipcRenderer.invoke('create-new-folder', folderName),
  readProjectFolders: (baseDirectory): Promise<unknown> =>
    ipcRenderer.invoke('read-project-folders', baseDirectory),
  createProjectInfo: (projectFolderPath): Promise<unknown> =>
    ipcRenderer.invoke('create-project-info', projectFolderPath),
  updateProjectInfo: (projectFolderPath, data): Promise<unknown> =>
    ipcRenderer.invoke('update-project-info', projectFolderPath, data),
  getFolderPath: (folderName): Promise<unknown> =>
    ipcRenderer.invoke('get-folder-path', folderName),
  saveCanvasState: (filePath, data): Promise<unknown> =>
    ipcRenderer.invoke('save-canvas-state', filePath, data),
  readCanvasState: (filePath): Promise<unknown> =>
    ipcRenderer.invoke('read-canvas-state', filePath),
  uploadAndSaveImage: (filePath, data): Promise<unknown> =>
    ipcRenderer.invoke('upload-and-save-image', filePath, data),
  readFileAsBuffer: (filePath): Promise<unknown> =>
    ipcRenderer.invoke('readFileAsBuffer', filePath),
  compileCode: (code: string): Promise<string> => ipcRenderer.invoke('compiler:compile', code),
  saveAndRunCode: (
    code: string,
    filepath: string,
    isSession: boolean,
    patientId?: string,
    userId?: string
  ): Promise<void> =>
    ipcRenderer.invoke('compiler:saveAndRun', code, filepath, isSession, patientId, userId)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
