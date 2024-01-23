// BlockEditor.js is a comprehensive React compnt that serves as an interactive editor for managing and assembling blocks within a scene.
// The component leverages several custom components and utilities, including BlockRow, Modal, CanvasModal, and MusicModal, for various aspects of scene creation and editing.
// Key functionalities include:
// - Managing modal visibility and types (standard, canvas editing, music) through state.
// - Handling the creation and arrangement of blocks (represented by IBlockRow[]).
// - Utilizing SceneProcessor for processing the scene and BlockUtil for block-specific logic.
// - Dynamically adding blocks to rows and handling their interactions.
// - Providing UI elements for user interaction, such as buttons for adding blocks, editing canvas, and music settings.
// - The component also contains experimental or placeholder func

import './styles.css'
import { ReactElement, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faPlayCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import BlockRow from '@renderer/components/BlockRow'
import Modal from '@renderer/components/BlockModal'
import CanvasModal from '@renderer/components/CanvasModal'
import { SceneProcessor, BlockUtil, IProject } from '@renderer/utils/util'
import { IBaseButton, genericButtons, inputButtons } from '@renderer/staticButtons'
import MusicModal from '@renderer/components/MusicModal'
import TimerModal from '@renderer/components/TimerModal'
import { infoToast } from '@renderer/components/Toast'
import Navbar from '@renderer/components/Navbar'
import { AutoRedirect } from '@renderer/contexts/AuthContext'

export interface IBlockRow {
  order: number
  blocks: IBaseButton[]
}
function BlockEditor(): ReactElement {
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [showEditCanvasModal, setShowEditCanvasModal] = useState(false)
  const [modalType, setModalType] = useState<'input' | 'other'>('input')
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [timerValue, setTimerValue] = useState<number>(5)
  const [rows, setRows] = useState<IBlockRow[]>([])
  const sceneProcessor = new SceneProcessor()
  const [showMusicModal, setShowMusicModal] = useState(false)
  const [showTimerModal, setShowTimerModal] = useState(false)

  // Be aware that this is VERY INNEFICIENT and will lead to "counter" leaks.
  // This is just a quick fix to make sure that the "src" property of each block is uniquely mapped.
  const [globalResourceCounter, setGlobalResourceCounter] = useState(0)

  const handleOpenModal = (rowIndex: number, modalType: string): void => {
    setActiveRowIndex(rowIndex)
    setModalType(modalType as 'input' | 'other')
    setShowModal(true)
  }

  const loadBlockSelections = async (projectFolderPath): Promise<any> => {
    try {
      const data = await window.electronAPI.readFile(`${projectFolderPath}/project-info.json`)
      const projectData = JSON.parse(data) as IProject
      setRows(projectData.blockRows || [])
      setGlobalResourceCounter(projectData.globalCounter || 0)
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  const saveProjectAndNavigate = async () => {
    console.log('CompleteAndNavigate Called')

    const projectFolderPath = localStorage.getItem('currentProjectPath')
    console.log('Project folder path:', projectFolderPath)

    if (projectFolderPath) {
      try {
        const projectData = {
          name: projectName,
          blockRows: rows,
          globalCounter: globalResourceCounter
        }
        await window.electronAPI.writeFile(
          `${projectFolderPath}/project-info.json`,
          JSON.stringify(projectData)
        )
        console.log('Selections saved successfully!')
        // navigate('/projects')
      } catch (err) {
        console.error('Error during file operations:', err)
      }
    } else {
      console.log('No project folder path found.')
    }
    infoToast('Projeto salvo com sucesso!')
  }

  useEffect(() => {
    // Load the project data on component mount
    const projectFolderPath = localStorage.getItem('currentProjectPath')
    console.log('Component Mounted - Editor')

    if (projectFolderPath) {
      console.log('Project Folder Path:', projectFolderPath)
      loadBlockSelections(projectFolderPath)
      const pathParts = projectFolderPath.split(/[\/\\]/)
      const extractedName = pathParts[pathParts.length - 1]
      setProjectName(extractedName)
    } else {
      console.error('Project folder path not found')
    }
  }, [])

  const compileCodeHandler = async (): Promise<void> => {
    const code = sceneProcessor.process({ name: 'teste', blockRows: rows, globalCounter: 0 })
    try {
      const compiledCode = await window.api.compileCode(code)
      console.log(compiledCode)
      alert(compiledCode)
      try {
        const projectFolderPath = localStorage.getItem('currentProjectPath')
        const runCode = await window.api.saveAndRunCode(compiledCode, projectFolderPath)
        console.log(runCode)
      } catch (err) {
        alert(err)
      }
    } catch (err) {
      alert(err)
    }
  }

  const appendNewBlockToRow = (
    newBlock: IBaseButton,
    rows: IBlockRow[],
    activeRowIndex: number
  ): IBlockRow[] => {
    if (activeRowIndex < rows.length) {
      const updatedRows = rows.map((row, index) => {
        if (index === activeRowIndex) {
          return { ...row, blocks: [...row.blocks, newBlock] }
        }
        return row
      })
      return updatedRows
    } else {
      const newRow = { order: activeRowIndex, blocks: [newBlock] }
      return [...rows, newRow]
    }
  }
  const handleMusicButtonClick = (button: IBaseButton) => {
    setShowMusicModal(true)
  }
  const handleTimerButtonClick = (button: IBaseButton) => {
    setShowTimerModal(true)
  }

  const addBlockToRow = (newBlock: IBaseButton): void => {
    if (activeRowIndex !== null) {
      BlockUtil.remapBlockCompiledCode(
        newBlock,
        activeRowIndex,
        globalResourceCounter,
        setGlobalResourceCounter
      )
      setActiveBlockId(newBlock.id ? newBlock.id : null)
      if (newBlock.type === 'sound') {
        handleMusicButtonClick(newBlock)
      }
      const updatedRows = appendNewBlockToRow(newBlock, rows, activeRowIndex)
      setRows(updatedRows)
    }
    setShowModal(false)
  }

  const addBlockToRowHandler = (newBlock: IBaseButton): void => {
    addBlockToRow(newBlock)
  }

  const editCanvasHandler = (canvasIdx: string): void => {
    setActiveBlockId(canvasIdx)
    setShowEditCanvasModal(true)
  }

  const editTimerHandler = (rowIdx, blockIdx): void => {
    setActiveRowIndex(rowIdx)
    setActiveBlockId(blockIdx)
    setTimerValue(Number(rows[rowIdx].blocks[blockIdx].src || '5000') / 1000)
    setShowTimerModal(true)
  }

  const handleEditTimerClose = (newSecondsInterval: number): void => {
    if (activeRowIndex === null || activeBlockId === null) return
    const updatedRows = rows.map((row, index) => {
      if (index === activeRowIndex) {
        return {
          ...row,
          blocks: row.blocks.map((block) => {
            if (Number(block.id) == Number(activeBlockId) - 1) {
              const newTimerValue = newSecondsInterval * 1000
              return {
                ...block,
                src: String(newTimerValue),
                correspondingCompileCode: `esperar(${newTimerValue})`
              }
            }
            return block
          })
        }
      }
      return row
    })
    setRows(updatedRows)
    setShowTimerModal(false)
  }

  const handleClose = (): void => setShowModal(false)
  const handleEditCanvasClose = (): void => setShowEditCanvasModal(false)
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="bg-primary-background flex flex-col justify-center items-center flex-grow">
        <AutoRedirect />

        <Modal
          show={showModal}
          onClose={handleClose}
          type={modalType}
          genericButtons={modalType === 'input' ? inputButtons : genericButtons}
          onAddBlock={addBlockToRowHandler}
          onMusicButtonClick={addBlockToRowHandler}
          onTimerButtonClick={handleTimerButtonClick}
        />
        <MusicModal
          show={showMusicModal}
          onClose={() => setShowMusicModal(false)}
          onConfirm={() => setShowMusicModal(false)}
          activeSoundResourceId={activeBlockId || ''}
        />
        <TimerModal
          show={showTimerModal}
          onClose={handleEditTimerClose}
          onCanceled={() => setShowTimerModal(false)}
          defaultValue={timerValue}
        />
        <CanvasModal
          show={showEditCanvasModal}
          activeSceneResourceId={activeBlockId || ''}
          onClose={handleEditCanvasClose}
        />
        <span style={{ padding: '1em', width: '80%', height: '40em' }}>
          <div
            style={{
              backgroundColor: 'transparent',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              overflowY: 'scroll',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {rows.map((row, idx) => (
              <BlockRow
                key={idx}
                blocks={row.blocks}
                addButtonHandler={() => handleOpenModal(idx, 'other')}
                editCanvasHandler={editCanvasHandler}
                editTimeHandler={editTimerHandler}
                rowId={idx}
                editMusicHandler={(musicIdx) => {}}
              />
            ))}
          </div>
        </span>
        <div className="button-container">
          <button className="editor-button" onClick={() => handleOpenModal(rows.length, 'input')}>
            <FontAwesomeIcon icon={faPlusCircle} size="2x" />
          </button>
          <button className="editor-button" onClick={saveProjectAndNavigate}>
            <FontAwesomeIcon icon={faCheckCircle} size="2x" />
          </button>
          <button className="editor-button" onClick={compileCodeHandler}>
            <FontAwesomeIcon icon={faPlayCircle} size="2x" />
          </button>
        </div>
      </div>
    </div>
  )
}
export default BlockEditor
