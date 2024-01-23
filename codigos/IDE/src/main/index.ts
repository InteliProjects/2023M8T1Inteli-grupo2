import { app, shell, BrowserWindow, ipcMain } from 'electron'

import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import iconWindows from '../../resources/icon.ico?asset'

import path from 'path'
import fs from 'fs'
import os from 'os'

import { users, User } from './services/User.service'
import { Patient, patients } from './services/Patient.service'
import { Project, projects } from './services/Project.service'
import { codeBridge } from './bridge/Python.bridge'
import { Session, sessions } from './services/Session.service'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon: iconWindows }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('db:user.insert', async (_, user: User) => {
  return users.insert(user)
})

ipcMain.handle('db:user.update', async (_, user: User) => {
  return users.update(user)
})

ipcMain.handle('db:user.delete', async (_, id: string) => {
  return users.delete(id)
})

ipcMain.handle('db:user.get', async (_, id: string) => {
  return users.get(id)
})

ipcMain.handle('db:user.getAll', async () => {
  return users.getAll()
})

ipcMain.handle('db:user.getByUsername', async (_, username: string) => {
  return users.getByUsername(username)
})

ipcMain.handle('db:patient.insert', async (_, patient: Patient) => {
  return patients.insert(patient)
})

ipcMain.handle('db:patient.update', async (_, patient: Patient) => {
  return patients.update(patient)
})

ipcMain.handle('db:patient.delete', async (_, id: string) => {
  return patients.delete(id)
})

ipcMain.handle('db:patient.get', async (_, id: string) => {
  return patients.get(id)
})

ipcMain.handle('db:patient.getAll', async () => {
  return patients.getAll()
})
ipcMain.handle('db:project.insert', async (_, project: Project) => {
  return projects.insert(project)
})

ipcMain.handle('db:project.update', async (_, project: Project) => {
  return projects.update(project)
})

ipcMain.handle('db:project.delete', async (_, id: string) => {
  return projects.delete(id)
})

ipcMain.handle('db:project.get', async (_, id: string) => {
  return projects.get(id)
})

ipcMain.handle('db:project.getAll', async () => {
  return projects.getAll()
})

ipcMain.handle('compiler:compile', async (_, code: string) => {
  return codeBridge.compileCode(code)
})

ipcMain.handle(
  'compiler:saveAndRun',
  async (
    _,
    code: string,
    filepath: string,
    isSession?: boolean,
    patientId?: string,
    userId?: string
  ) => {
    const result = await codeBridge.saveCompiledCodeAndRun(code, filepath)
    if (!isSession) return result

    const session = new Session({
      projectId: 1,
      userId: parseInt(userId!),
      patientId: parseInt(patientId!),
      logPath: '',
      createdAt: Date.now().toString(),
      duration: result
    })
    await session.save()

    // await sessions.insert(session)
  }
)

ipcMain.handle('db:session.getByUserId', async (_, userId) => {
  return await sessions.getByUserId(userId)
})

ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error('Error reading file:', error)
    return null // ou manipule o erro como preferir
  }
})

ipcMain.handle('write-file', async (_, filePath, content) => {
  const directory = path.dirname(filePath)
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }

  try {
    fs.writeFileSync(filePath, content)
    return true
  } catch (error) {
    console.error('Error writing file:', error)
    return false
  }
})

ipcMain.handle('save-image', async (_, filePath, base64Data) => {
  const buffer = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64')
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    // Write the file
    fs.writeFileSync(filePath, buffer)
    return true
  } catch (error) {
    console.error('Error saving image:', error)
    return false
  }
})

ipcMain.handle('create-new-folder', async (event, folderName) => {
  const homeDirectory = os.homedir()
  const documentsPath = path.join(homeDirectory, 'Documents') // Adjust if the Documents folder has a different name on some systems
  const baseDirectory = path.join(documentsPath, 'MeusProjetos') // Final base directory
  const folderPath = path.join(baseDirectory, folderName) // Full folder path

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }) // Create the folder
  }

  global.myGlobalVariable = folderPath // Storing the path globally
  return folderPath
})

ipcMain.handle('read-project-folders', async () => {
  try {
    const homeDirectory = os.homedir()
    const documentsPath = path.join(homeDirectory, 'Documents')
    const baseDirectory = path.join(documentsPath, 'MeusProjetos')

    const folders = fs
      .readdirSync(baseDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
    return folders
  } catch (error) {
    console.error('Error reading project folders:', error)
    return [] // Return an empty list in case of an error
  }
})

ipcMain.handle('create-project-info', async (_, projectFolderPath) => {
  const filePath = path.join(projectFolderPath, 'project-info.json')
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}))
  }
})

// Handler to update the JSON file
ipcMain.handle('update-project-info', async (_, projectFolderPath, data) => {
  const filePath = path.join(projectFolderPath, 'project-info.json')
  fs.writeFileSync(filePath, JSON.stringify(data))
})

ipcMain.handle('get-folder-path', async (_, folderName) => {
  // Implement the logic to get the folder path based on folderName
  // This is an example assuming folderName is the name of the folder in the base directory
  const homeDirectory = os.homedir()
  const documentsPath = path.join(homeDirectory, 'Documents')
  const baseDirectory = path.join(documentsPath, 'MeusProjetos')
  const folderPath = path.join(baseDirectory, folderName)

  // Check if the folder exists and return its path
  if (fs.existsSync(folderPath)) {
    return folderPath
  } else {
    throw new Error('Folder not found')
  }
})

ipcMain.handle('save-canvas-state', async (_, filePath, data) => {
  try {
    // Ensure the canvas directory exists
    const canvasDir = path.dirname(filePath)
    if (!fs.existsSync(canvasDir)) {
      fs.mkdirSync(canvasDir, { recursive: true })
    }

    // Write the canvas state file
    fs.writeFileSync(filePath, data)
    return true
  } catch (error) {
    console.error('Error saving canvas state:', error)
    return false
  }
})

ipcMain.handle('read-canvas-state', async (_, filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return data
    } else {
      console.error('File not found:', filePath)
      return null
    }
  } catch (error) {
    console.error('Error reading canvas state:', error)
    return null
  }
})

ipcMain.handle('upload-and-save-image', async (_, filePath, base64Data) => {
  try {
    // Ensure the directory exists
    const directoryPath = path.dirname(filePath)
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }
    // Process and save the image
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Image, 'base64')
    fs.writeFileSync(filePath, buffer)
    // Read and return the saved image data
    const imageBuffer = fs.readFileSync(filePath)
    const dataUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`
    return dataUrl
  } catch (error) {
    console.error('Error in upload-and-save-image:', error)
    return null
  }
})

ipcMain.handle('save-wav-file', async (_, filePath, fileName, wavBuffer) => {
  try {
    const fullPath = path.join(filePath, fileName)

    // Ensure the directory exists
    const directory = path.dirname(fullPath)
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    const buffer = Buffer.from(wavBuffer)
    await fs.promises.writeFile(fullPath, buffer)
    return { success: true, path: fullPath }
  } catch (error) {
    console.error('Error saving WAV file:', error)
    return { success: false, error: error }
  }
})
