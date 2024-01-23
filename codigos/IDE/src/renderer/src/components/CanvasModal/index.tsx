/**
 * This file defines a CanvasModal component for React that is used to edit a scene.
 * It includes:
 * - Importing necessary libraries, styles, and components.
 * - The ModalProps interface to define properties such as 'show', 'activeSceneResourceId', and 'onClose'.
 * - The CanvasModal component which renders a modal with a header, body, and footer. The body contains the CanvasEditor component.
 * - The modal is conditionally rendered based on the 'show' prop.
 * - The 'onClose' prop is a callback function to be called when the 'Cancelar' button is clicked.
 */

import CanvasEditor from '../CanvasEditor'
// import './styles.css'
import { ReactElement } from 'react'
interface ModalProps {
  show: boolean
  activeSceneResourceId: string
  onClose: () => void
}

export default function CanvasModal(props: ModalProps): ReactElement {
  return props.show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transform transition duration-500 ease-in-out w-full h-full md:w-5/6 flex flex-col items-center justify-center text-center p-5">
        <div className="modal-header">
          <h4 className="modal-title text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Editar Cena
          </h4>
        </div>
        <div className="modal-body flex-grow w-full h-full">
          <CanvasEditor activeSceneResourceId={props.activeSceneResourceId} />
        </div>
        <div className="modal-footer">
          <button
            className="text-white mt-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={props.onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
