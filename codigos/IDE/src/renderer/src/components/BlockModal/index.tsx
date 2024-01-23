/**
 * This is a Modal component for React that can be used for various purposes.
 * It includes:
 * - ModalProps interface to define properties such as 'show', 'genericButtons', 'type', 'onClose', 'onAddBlock', 'onMusicButtonClick', 'onTimerButtonClick'.
 * - Importing necessary libraries and interfaces.
 * - A colorSwitch function to assign different colors based on the category.
 * - The component can handle different types of buttons including music and timer buttons.
 */

import { ReactElement } from 'react'
import { groupBy } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IBaseButton } from '@renderer/staticButtons'

interface ModalProps {
  show: boolean
  genericButtons: IBaseButton[]
  type: 'input' | 'other'
  onClose: () => void
  onAddBlock: (newBlock: IBaseButton) => void
  onMusicButtonClick?: (button: IBaseButton) => void // Optional prop for music button
  onTimerButtonClick?: (button: IBaseButton) => void // Optional prop for time button
}

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

export interface IBaseButtonProps {
  button: IBaseButton
  onClick: () => void
}

const InputButtonElement = ({ button, onClick }: IBaseButtonProps) => {
  const color = colorSwitch(button.category)
  return (
    <button
      className={`max-w-sm flex flex-col justify-center items-center text-center w-44 h-44 border border-gray-200 rounded-lg shadow dark:border-gray-700 transform transition duration-500 ease-in-out hover:scale-105`}
      style={{ backgroundColor: color, color: 'white' }}
      onClick={onClick}
    >
      <FontAwesomeIcon className="h-12 w-12 text-gray-500 mb-4 text-white" icon={button.icon} />
      <span className="font-medium text-2xl">{button.name}</span>
    </button>
  )
}

export default function Modal(props: ModalProps): ReactElement {
  const groupedButtons = groupBy(props.genericButtons, 'category')

  const handleAddButtonClick = (button: IBaseButton): void => {
    if (button.type === 'sound' && props.onMusicButtonClick) {
      props.onMusicButtonClick(button)
    } else {
      props.onAddBlock(button)
    }
    props.onClose()
  }

  return props.show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center flex-col backdrop-blur">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow dark:bg-gray-700 overflow-auto">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blocos de Comando</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="select-modal"
            onClick={props.onClose} // Add this line
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-4 md:p-5 overflow-auto max-h-96">
          <div className="p-4 md:p-5 flex flex-col">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Selecione o seu botão desejado</p>
            <div className="flex flex-col overflow-auto justify-center">
              {Object.entries(groupedButtons).map(([group, buttons]) => (
                <div key={group} className="mb-4">
                  <h5 className="text-lg font-semibold">
                    {group.charAt(0).toUpperCase() + group.slice(1)} Buttons
                  </h5>
                  <div className="flex flex-wrap gap-5">
                    {buttons.map((button, idx) => (
                      <InputButtonElement
                        key={idx}
                        button={button}
                        onClick={() => handleAddButtonClick({ ...button })}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 md:p-5">
          <button
            className="mt-5 text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={props.onClose} // Add this line
          >
            {' '}
            Cancelar
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
