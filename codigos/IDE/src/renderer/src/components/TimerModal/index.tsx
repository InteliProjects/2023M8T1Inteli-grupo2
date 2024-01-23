/**
 * This file defines a TimerModal component for React that is used to set a timer delay.
 * It includes:
 * - Importing necessary libraries and components.
 * - The ITimerModalProps interface to define properties such as 'show', 'defaultValue', 'onClose', and 'onCanceled'.
 * - The TimerModal component which renders a modal with a slider to set the timer delay.
 * - The 'show' prop determines whether the modal is displayed.
 * - The 'onClose' prop is a callback function to be called when the modal is closed with a value.
 * - The 'onCanceled' prop is a callback function to be called when the modal is closed without a value.
 * - The 'defaultValue' prop is the initial value of the timer delay.
 * - The 'handleChange' function updates the timer delay when the slider is moved.
 */
import Slider from '@mui/material/Slider'
import { ReactElement, useEffect, useState } from 'react'

interface ITimerModalProps {
  show: boolean
  defaultValue?: number
  onClose: (value: number) => void
  onCanceled: () => void
}

const TimerModal = ({
  show,
  onClose,
  onCanceled,
  defaultValue
}: ITimerModalProps): ReactElement => {
  const [value, setValue] = useState(defaultValue)
  if (!show) return <> </>

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md w-full max-w-md">
        <div className="border-b dark:border-gray-600 p-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Novo temporizador (delay)
          </h4>
        </div>
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-400">Escolha o tempo de espera em segundos</p>
          <Slider value={value} onChange={handleChange} />

          <input
            type="number"
            className="w-full mt-4 text-center appearance-none border border-gray-300 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={value}
            onChange={handleChange}
            placeholder="Tempo em segundos"
          />
        </div>
        <div className="flex justify-end p-4 border-t dark:border-gray-600 gap-5">
          <button
            onClick={() => {
              onCanceled()
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onClose(value)
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimerModal
