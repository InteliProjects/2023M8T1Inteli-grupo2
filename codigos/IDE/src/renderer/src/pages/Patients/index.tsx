/**
 * This file defines the Patients component for the application.
 * It includes:
 * - Importing necessary libraries, components, and assets.
 * - The IPatient interface to define the structure of a patient object.
 * - The Patients component which renders a page with a search bar, a data grid for displaying patient data, and various modals for different functionalities such as editing and deleting patients.
 * - The 'patients' and 'filteredPatients' states are used to store the list of patients and the list of patients that match the search query, respectively.
 * - The 'showModal', 'showEditModal', 'showOptionsModal', 'showDeleteModal', 'showDataGridModal', and 'showProjectsModal' states are used to control the visibility of the various modals.
 * - The 'selectedPatient' state is used to store the patient that is currently selected for editing or deleting.
 * - The 'projects' and 'sessions' states are used to store the list of projects and sessions related to the selected patient.
 */
import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { AutoRedirect, useAuth } from '../../contexts/AuthContext'
import { errorToast, infoToast, successToast } from '../../components/Toast'
import profilePhoto from '../../assets/img/profile-photo.png'
import Navbar from '@renderer/components/Navbar'
import { faUserEdit, faTrashAlt, faEye, faPlay } from '@fortawesome/free-solid-svg-icons'
import { DataGrid } from '@mui/x-data-grid'
import { LinearProgress } from '@mui/material'
import { IProject, SceneProcessor } from '@renderer/utils/util'

interface IPatient {
  birthdate: string
  createdAt: string
  id: number
  name: string
  observations: string
  surname: string
  updatedAt: string
}

export default function Patients() {
  const [patients, setPatients] = useState<IPatient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<IPatient[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<IPatient>({} as IPatient)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDataGridModal, setShowDataGridModal] = useState(false)
  const [showProjectsModal, setShowProjectsModal] = useState(false)
  const [projects, setProjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [newPatient, setNewPatient] = useState<IPatient>({
    name: '',
    surname: '',
    birthdate: '',
    observations: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [loading, setLoading] = useState(false)
  const sceneProcessor = new SceneProcessor()
  const { userId } = useAuth()

  useEffect(() => {
    window.electron.ipcRenderer.invoke('db:patient.getAll').then((result) => {
      setPatients(result)
      setFilteredPatients(result)
    })
  }, [])

  useEffect(() => {
    setSelectedPatient({} as IPatient)
  }, [patients])

  const refreshPatients = () => {
    window.electron.ipcRenderer.invoke('db:patient.getAll').then((result) => {
      setPatients(result)
      setFilteredPatients(result)
    })
  }

  const fetchSessionsFromPatient = async (patientId: number) => {
    setLoading(true)
    const sessions = await window.electron.ipcRenderer.invoke('db:session.getByUserId', patientId)
    const mappedSessions = sessions.map((session) => {
      return session.dataValues
    })
    setSessions(mappedSessions)
    setLoading(false)
    return sessions
  }

  const fetchFolders = async () => {
    try {
      const response = await window.electronAPI.readProjectFolders()
      setProjects(response)
    } catch (error) {
      console.error('Error fetching folders:', error)
    }
  }

  const handleSearch = (e: any) => {
    const searchTerm = e.target.value
    console.log(searchTerm)
    setFilteredPatients(
      patients.filter((patient) => {
        return (
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.surname.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value })
  }

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPatient({ ...selectedPatient, [e.target.name]: e.target.value })
  }

  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await window.electron.ipcRenderer.invoke('db:patient.insert', newPatient)
      successToast(`Paciente criado com sucesso!`)
      setShowModal(false)
      refreshPatients()
    } catch (err) {
      errorToast('Paciente não criado')
    }
  }

  const handleUpdatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await window.electron.ipcRenderer.invoke('db:patient.update', selectedPatient)
      successToast('Paciente atualizado com sucesso!')
      setShowEditModal(false)
      refreshPatients()
    } catch (err) {
      alert(err)
      errorToast('Erro ao atualizar paciente')
    }
  }

  const handleDeletePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = selectedPatient.id
    try {
      await window.electron.ipcRenderer.invoke('db:patient.delete', id)
      successToast('Paciente excluído com sucesso!')
      setShowDeleteModal(false)
      refreshPatients()
    } catch (err) {
      errorToast('Erro ao excluir paciente')
    }
  }

  const handleListProjects = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowOptionsModal(false)

    try {
      await fetchFolders()
      setShowProjectsModal(true)
    } catch (err) {
      errorToast('Erro ao listar projetos')
    }
  }

  const handlePatientOptions = (patient) => {
    setSelectedPatient(patient)
    setShowOptionsModal(true)
  }

  const runProject = async (project) => {
    try {
      const patientId = selectedPatient.id
      const mainUserId = userId()

      infoToast('Carregando projeto...')
      const folderPath = await window.electronAPI.getFolderPath(project)
      const data = await window.electronAPI.readFile(`${folderPath}/project-info.json`)
      const projectData = JSON.parse(data) as IProject

      successToast('Projeto iniciado com sucesso!')
      infoToast('Compilando projeto...')

      const code = sceneProcessor.process(projectData)
      const compiledCode = await window.api.compileCode(code)
      successToast('Projeto compilado com sucesso!')
      infoToast('Executando projeto...')
      await window.api.saveAndRunCode(compiledCode, folderPath, true, patientId, mainUserId)
      successToast('Execução Registrada!')
    } catch (err) {
      alert(err)
      errorToast('Erro ao iniciar projeto')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="bg-primary-background flex flex-col justify-starts items-center flex-grow">
        <AutoRedirect />
        <div className="px-5 pb-10 flex flex-col justify-center items-center">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-1xl md:text-5xl font-bold pt-20 pb-10">Pacientes</h1>
          </div>
        </div>
        <SearchBar onChange={handleSearch} placeholder="Search patients" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <a
            href="#"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
          >
            <span
              onClick={() => setShowModal(true)}
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Adicionar Novo paciente
            </span>
          </a>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center space-x-4 p-4 border bg-gray-300 border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                onClick={() => handlePatientOptions(patient)}
              >
                <img src={profilePhoto} alt={patient.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {patient.name} {patient.surname}
                  </p>
                  <p className="text-sm text-gray-500">
                    DOB: {new Date(patient.birthdate).toLocaleDateString()}
                    <br />
                    Ultimas Alterações: {new Date(patient.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">Nenhum paciente encontrado</p>
          )}

          {showModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div
                id="create-patient-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Criar novo paciente
                      </h3>
                      <button
                        type="button"
                        className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setShowModal(false)}
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
                      <form className="space-y-4" onSubmit={handleCreatePatient}>
                        <div>
                          <label
                            htmlFor="patient-name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Nome do paciente
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="patient-name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Nome do paciente"
                            required
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patient-surname"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Sobrenome
                          </label>
                          <input
                            type="text"
                            name="surname"
                            id="patient-surname"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Sobrenome"
                            required
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patient-birthdate"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            name="birthdate"
                            id="patient-birthdate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patient-observations"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Observações
                          </label>
                          <textarea
                            name="observations"
                            id="patient-observations"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Observações"
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        >
                          Criar Paciente
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {showEditModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div
                id="edit-patient-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Editar Paciente
                      </h3>
                      <button
                        type="button"
                        className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setShowEditModal(false)}
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
                      <form className="space-y-4" onSubmit={handleUpdatePatient}>
                        <div>
                          <label
                            htmlFor="patient-name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Nome do paciente
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="patient-name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Nome do paciente"
                            required
                            value={selectedPatient.name}
                            onChange={handleUpdateInputChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patient-surname-edit"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Sobrenome
                          </label>
                          <input
                            type="text"
                            name="surname"
                            id="patient-surname-edit"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Sobrenome"
                            required
                            value={selectedPatient.surname}
                            onChange={handleUpdateInputChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patient-birthdate-edit"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Data de Nascimento
                          </label>
                          <input
                            type="date"
                            name="birthdate"
                            id="patient-birthdate-edit"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                            value={selectedPatient.birthdate}
                            onChange={handleUpdateInputChange}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patient-observations-edit"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Observações
                          </label>
                          <textarea
                            name="observations"
                            id="patient-observations-edit"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Observações"
                            value={selectedPatient.observations}
                            onChange={handleUpdateInputChange}
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                        >
                          Editar Paciente
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault
                            setShowDeleteModal(true)
                            setShowEditModal(false)
                          }}
                          className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                        >
                          Excluir Paciente
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {showDeleteModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div
                id="delete-patient-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Deletar Paciente
                      </h3>
                      <button
                        type="button"
                        className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => {
                          setShowDeleteModal(false)
                        }}
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
                      <p className="text-gray-900 dark:text-white">
                        Tem certeza de que você deseja excluir este paciente? Todos os dados
                      </p>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          className="mr-2 px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => {
                            setShowDeleteModal(false)
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={handleDeletePatient}
                        >
                          Excluir Paciente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {showOptionsModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div
                id="user-action-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedPatient.name} {selectedPatient.surname}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setShowOptionsModal(false)}
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
                        <span className="sr-only">Fechar modal</span>
                      </button>
                    </div>
                    <div className="p-4 md:p-5">
                      <ul className="space-y-4">
                        <li>
                          <a
                            onClick={handleListProjects}
                            href="#"
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                          >
                            <FontAwesomeIcon icon={faPlay} />
                            <span className="flex-1 ms-3 whitespace-nowrap">Iniciar Projeto</span>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => {
                              setShowOptionsModal(false)
                              setShowDataGridModal(true)
                              fetchSessionsFromPatient(selectedPatient.id)
                            }}
                            href="#"
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                          >
                            <FontAwesomeIcon icon={faEye} />
                            <span className="flex-1 ms-3 whitespace-nowrap">Acompanhamento</span>
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            onClick={() => {
                              setShowOptionsModal(false)
                              setShowEditModal(true)
                            }}
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                          >
                            <FontAwesomeIcon icon={faUserEdit} />
                            <span className="flex-1 ms-3 whitespace-nowrap">Editar</span>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => {
                              setShowOptionsModal(false)
                              setShowDeleteModal(true)
                            }}
                            href="#"
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                            <span className="flex-1 ms-3 whitespace-nowrap">Remover</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {showDataGridModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div
                id="create-patient-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[calc(100%-1rem)] max-h-full flex overflow-y-auto overflow-x-hidden"
              >
                <div className="relative p-4 w-1/2 max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Acompanhamento - {selectedPatient.name} {selectedPatient.surname}
                      </h3>
                      <button
                        type="button"
                        className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setShowDataGridModal(false)}
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
                      <DataGrid
                        rows={sessions}
                        sx={{
                          color: 'white'
                        }}
                        columns={[
                          { field: 'id', headerName: 'ID', width: 70 },
                          { field: 'patientId', headerName: 'Patient', width: 130 },
                          { field: 'userId', headerName: 'User', width: 130 },
                          { field: 'duration', headerName: 'Duration', width: 130 },
                          { field: 'updatedAt', headerName: 'Updated At', width: 130 }
                        ]}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                      />
                      {loading && <LinearProgress />}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {showProjectsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center flex-col backdrop-blur">
              <div className="w-full max-w-4xl bg-white rounded-lg shadow dark:bg-gray-700 overflow-auto">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projetos</h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="select-modal"
                    onClick={() => {
                      setShowProjectsModal(false)
                      setShowOptionsModal(true)
                    }}
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
                    <div className="flex flex-wrap gap-10 overflow-auto justify-center">
                      {projects.map((project) => (
                        <div
                          key={project}
                          className="max-w-sm flex justify-center items-center text-center w-48 h-48 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transform transition duration-500 ease-in-out"
                          onClick={() => runProject(project)}
                        >
                          <div className="text-ellipsis overflow-hidden">
                            <a href="#" title={project}>
                              <h5
                                className="mb-2 flex text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate"
                                title={project}
                              >
                                {project}
                              </h5>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 md:p-5">
                  <button
                    className="mt-5 text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      setShowOptionsModal(true)
                      setShowProjectsModal(false)
                    }}
                  >
                    {' '}
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
