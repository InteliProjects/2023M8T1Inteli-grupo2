/**
 * This file defines the Projects component for the application.
 * It includes:
 * - Importing necessary libraries and components.
 * - The Projects component which renders a page with a list of projects and a button to create a new project.
 * - The 'folders' state is used to store the list of project folders.
 * - The 'isModalOpen' and 'newFolderName' states are used to control the project creation modal and store the name of the new project, respectively.
 * - The 'createNewProject' function opens the project creation modal.
 * - The 'handleCreateProject' function creates a new project folder with subfolders for images and audios, creates a project info file, stores the project path in local storage, and navigates to the editor page.
 * - The 'selectProject' function is used to select a project from the list.
 */

import { useState, useEffect } from 'react'
import { AutoRedirect } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '@renderer/components/Navbar'
export default function Projects() {
  const [folders, setFolders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const navigate = useNavigate()

  const createNewProject = async () => {
    setIsModalOpen(true) // Open modal instead of directly creating a project
  }

  const handleCreateProject = async () => {
    try {
      const folderPath = await window.electronAPI.createNewFolder(newFolderName)
      await window.electronAPI.createNewFolder(`${newFolderName}/imgs`)
      await window.electronAPI.createNewFolder(`${newFolderName}/audios`)
      console.log('Folder created:', folderPath)

      await window.electronAPI.createProjectInfo(folderPath)

      localStorage.setItem('currentProjectPath', folderPath) // Store the path
      navigate('/editor') // Navigate to the editor
    } catch (error) {
      console.error('Error creating folder:', error)
    }
    await fetchFolders()
    setIsModalOpen(false) // Close modal after creation
  }

  const selectProject = async (folderName) => {
    console.log('Project selected:', folderName)
    try {
      const folderPath = await window.electronAPI.getFolderPath(folderName)

      localStorage.setItem('currentProjectPath', folderPath)
      navigate('/editor')
    } catch (error) {
      console.error('Error fetching folder path:', error)
    }
  }

  const fetchFolders = async () => {
    try {
      const response = await window.electronAPI.readProjectFolders()
      setFolders(response)
    } catch (error) {
      console.error('Error fetching folders:', error)
    }
  }

  useEffect(() => {
    fetchFolders()
  }, [])

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="bg-primary-background flex flex-col justify-center items-center flex-grow">
        <AutoRedirect />

        <div className="px-5 pb-10 flex flex-col justify-center items-center gap-10">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-1xl md:text-5xl font-bold pt-20 pb-20">Selecione um projeto</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto md:flex">
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div
              className="max-w-sm flex justify-center items-center text-center w-64 h-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transform transition duration-500 ease-in-out hover:scale-105"
              onClick={createNewProject}
            >
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-12 w-12 text-gray-500 mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="font-medium text-2xl dark:text-white">Novo Projeto</span>
              </div>
            </div>
            {folders.map((folder) => (
              <div
                key={folder}
                className="max-w-sm flex justify-center items-center text-center w-64 h-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transform transition duration-500 ease-in-out hover:scale-105"
                onClick={() => selectProject(folder)}
              >
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {folder}
                    </h5>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div
            id="create-project-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Criar novo projeto
                  </h3>
                  <button
                    type="button"
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setIsModalOpen(false)}
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
                        strokeWidth={2}
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Fechar</span>
                  </button>
                </div>
                <div className="p-4">
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="project-name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nome do projeto
                      </label>
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter project name"
                        required
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleCreateProject}
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Criar Projeto
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
