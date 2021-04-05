import React, { FC, useState } from 'react'
import useLocalStorage from 'use-local-storage'

export type Connection = {
  name: string
  baseUrl: string
  username: string
  password: string
}

export const CredentialsContext = React.createContext<{
  connections: Connection[]
  setConnections: (
    hosts: Connection[] | ((prev: Connection[]) => Connection[])
  ) => void
  selectConnection: boolean
  setSelectConnection: (selectConnection: boolean) => void
  baseUrl: string
  setBaseUrl: (uri: string) => void
  username: string
  setUsername: (username: string) => void
  password: string
  setPassword: (password: string) => void
  logout: () => void
}>({
  connections: [],
  setConnections: () => null,
  selectConnection: false,
  setSelectConnection: () => null,
  baseUrl: '',
  setBaseUrl: () => null,
  username: '',
  setUsername: () => null,
  password: '',
  setPassword: () => null,
  logout: () => null,
})

export const CredentialsProvider: FC = ({ children }) => {
  const [selectConnection, setSelectConnection] = useState(false)
  const [connections, setConnections] = useLocalStorage(
    'connections',
    [] as Connection[]
  )
  const [baseUrl, setBaseUrl] = useLocalStorage('baseUrl', '')
  const [username, setUsername] = useLocalStorage('username', '')
  const [password, setPassword] = useLocalStorage('password', '')

  return (
    <CredentialsContext.Provider
      value={{
        connections,
        setConnections,
        selectConnection,
        setSelectConnection,
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
          setSelectConnection(true)
        },
      }}
    >
      {children}
    </CredentialsContext.Provider>
  )
}
