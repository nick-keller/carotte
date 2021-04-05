import React, { FC, useState } from 'react'
import useLocalStorage from 'use-local-storage'

export type Connexion = {
  name: string
  baseUrl: string
  username: string
  password: string
}

export const CredentialsContext = React.createContext<{
  connexions: Connexion[]
  setConnexions: (
    hosts: Connexion[] | ((prev: Connexion[]) => Connexion[])
  ) => void
  selectConnexion: boolean
  setSelectConnexion: (selectConnexion: boolean) => void
  baseUrl: string
  setBaseUrl: (uri: string) => void
  username: string
  setUsername: (username: string) => void
  password: string
  setPassword: (password: string) => void
  logout: () => void
}>({
  connexions: [],
  setConnexions: () => null,
  selectConnexion: false,
  setSelectConnexion: () => null,
  baseUrl: '',
  setBaseUrl: () => null,
  username: '',
  setUsername: () => null,
  password: '',
  setPassword: () => null,
  logout: () => null,
})

export const CredentialsProvider: FC = ({ children }) => {
  const [selectConnexion, setSelectConnexion] = useState(false)
  const [connexions, setConnexions] = useLocalStorage(
    'connexions',
    [] as Connexion[]
  )
  const [baseUrl, setBaseUrl] = useLocalStorage('baseUrl', '')
  const [username, setUsername] = useLocalStorage('username', '')
  const [password, setPassword] = useLocalStorage('password', '')

  return (
    <CredentialsContext.Provider
      value={{
        connexions,
        setConnexions,
        selectConnexion,
        setSelectConnexion,
        baseUrl,
        setBaseUrl,
        username,
        setUsername,
        password,
        setPassword,
        logout: () => {
          setBaseUrl('')
          setUsername('')
          setPassword('')
          setSelectConnexion(true)
        },
      }}
    >
      {children}
    </CredentialsContext.Provider>
  )
}
