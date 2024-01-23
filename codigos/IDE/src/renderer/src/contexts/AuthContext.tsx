// Define um contexto de autenticação utilizando a Context API do React.
// Ele inclui:
// 1. Interface `AuthContextType` - define a estrutura do contexto de autenticação, incluindo estado e funções para login e logout.
// 2. `AuthContext` - cria um contexto React para o estado de autenticação.
// 3. Componente `AutoRedirect` - redireciona usuários não autenticados para a página de login.
// 4. `AuthProvider` - um componente que fornece o contexto de autenticação para os componentes filhos, gerenciando o estado de login.
// 5. `useAuth` - um hook personalizado para acessar o contexto de autenticação.

import React, { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { successToast } from '../components/Toast'

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  username?: () => void
  userId?: () => string | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AutoRedirect = (props: any) => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return props.children
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(sessionStorage.getItem('isLogged')))

  const username = () => {
    const user = JSON.parse(sessionStorage.getItem('user_data') as string)
    if (user) {
      return user.username
    }
    return
  }

  const userId = () => {
    const user = JSON.parse(sessionStorage.getItem('user_data') as string)
    if (user) {
      return user.id
    }
    return
  }

  const login = () => {
    setIsLoggedIn(true)
    sessionStorage.setItem('isLogged', 'true')
  }

  const logout = async () => {
    successToast('Logout efetuado com sucesso.')
    sessionStorage.clear()
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, username, userId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
