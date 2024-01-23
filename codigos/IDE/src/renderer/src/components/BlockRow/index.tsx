/**
 * This file defines a BlockRow component for React that is used to display a row of blocks.
 * It includes:
 * - Importing necessary libraries, styles, and interfaces.
 * - The IBlockRowProps interface to define properties such as 'blocks', 'rowId', 'addButtonHandler', 'editCanvasHandler', 'editTimeHandler', 'editMusicHandler'.
 * - A colorSwitch function to assign different colors based on the category of the block.
 * - The BlockRow component which renders a row of blocks and handles various events such as adding a block, editing a canvas, editing time, and editing music.
 */
import './styles.css'
import { ReactElement } from 'react'
import { GenericBlock } from '../Blocks'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { IBaseButton } from '@renderer/pages/BlockEditor'

interface IBlockRowProps {
  blocks: IBaseButton[]
  rowId?: number
  addButtonHandler: () => void
  editCanvasHandler: (canvasIdx: string) => void
  editTimeHandler: (rowId, timerIdx: number) => void
  editMusicHandler: (musicIdx: number) => void
}
export default function BlockRow(props: IBlockRowProps): ReactElement {
  const colorSwitch = (category: string): string => {
    switch (category) {
      case 'input':
        return 'green'
      case 'action':
        return 'darkOrange'
      case 'logical':
        return '#fa5947'
      case 'resource':
      case 'graphical':
        return '#7a238d'
      default:
        return 'darkBlue'
    }
  }

  function buttonSwitch(button: IBaseButton): string {
    switch (button.type) {
      case 'wait':
        return `Esperar ${Number(button.src) / 1000}s`
      default:
        return button.name
    }
  }

  return (
    <span
      style={{
        width: '100%',
        display: 'flex',
        position: 'relative',
        justifyContent: 'flex-start',
        backgroundColor: 'offwhite',
        flexWrap: 'nowrap',
        overflow: 'auto',
        color: 'white'
      }}
    >
      {props.blocks.map((block, idx) => {
        return (
          <div key={idx}>
            <GenericBlock
              type={idx === 0 ? 'start' : 'middle'}
              color={colorSwitch(block.category)}
              icon={block.icon}
              onClick={() => {
                if (block.type === 'scene') {
                  props.editCanvasHandler(block.id)
                } else if (block.type === 'wait') {
                  props.editTimeHandler(props.rowId, idx)
                } else if (block.type === 'music') {
                  props.editMusicHandler(idx)
                }
              }}
            />
            <div
              style={{
                backgroundColor: colorSwitch(block.category),
                padding: '1em'
              }}
              className="text-center text-white font-bold rounded"
            >
              {buttonSwitch(block)}
            </div>
          </div>
        )
      })}
      <div>
        <GenericBlock
          type="end"
          color="darkBlue"
          icon={faPlusSquare}
          onClick={props.addButtonHandler}
        />
        <div
          style={{ backgroundColor: 'darkblue', padding: '1em' }}
          className="text-center text-white font-bold rounded"
        >
          Adicionar Bloco
        </div>
      </div>
    </span>
  )
}
