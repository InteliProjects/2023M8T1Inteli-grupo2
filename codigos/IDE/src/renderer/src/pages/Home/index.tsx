/**
 * This file defines the Home component for the application.
 * It includes:
 * - Importing necessary libraries, components, and assets.
 * - The Home component which renders a page with a navigation bar and two options for the user: "Acompanhar Desenvolvimento" and "Iniciar Novas Experiências".
 * - The 'AutoRedirect' component is used to automatically redirect the user based on certain conditions.
 * - The 'Navbar' component is used to display the navigation bar at the top of the page.
 * - The two options are represented as cards with an image and a title. The user can click on these cards to navigate to the corresponding page.
 */

import { AutoRedirect } from '../../contexts/AuthContext'
import child from '../../assets/img/baby.svg'
import folder from '../../assets/img/kid-toy.svg'
import Navbar from '@renderer/components/Navbar'

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="bg-primary-background flex flex-col justify-center items-center flex-grow">
        <AutoRedirect />

        <div className="px-5 pb-5 flex flex-col justify-center items-center gap-10">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-1xl md:text-5xl font-bold mb-5">O que vamos fazer hoje?</h1>
            <h3 className="text-xl font-medium mb-10">
              Você quer acompanhar o desenvolvimento das crianças ou iniciar novas experiências?
            </h3>
          </div>
        </div>
        <div className="max-w-4xl mx-auto md:flex">
          <div className="flex items-center justify-between gap-10">
            <div className="flex space-x-4">
              <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col text-center items-center gap-15 transform transition duration-500 ease-in-out hover:scale-105">
                <a href="/patients" className="no-underline">
                  <img className="p-8 rounded-t-lg" src={child} alt="product image" />
                </a>
                <div className="px-5 pb-5">
                  <a href="#" className="no-underline">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      Acompanhar Desenvolvimento
                    </h5>
                  </a>
                </div>
              </div>
              <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col text-center items-center gap-15 transform transition duration-500 ease-in-out hover:scale-105">
                <a href="/projects" className="no-underline">
                  <img className="p-8 rounded-t-lg" src={folder} alt="Visualizar Projetos" />
                </a>
                <div className="px-5 pb-5">
                  <a href="#" className="no-underline">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      Visualizar Projetos
                    </h5>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
